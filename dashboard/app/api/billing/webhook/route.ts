import { NextRequest, NextResponse } from 'next/server';
import { getStripe, verifyWebhookSignature } from '@/lib/stripe';
import { db } from '@/lib/firebase';
import { PRICING_PLANS } from '@/lib/pricing';
import { createOrder, getOrder } from '@/lib/orders';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { autoSetupOrder } from '@/lib/auto-setup';
import Stripe from 'stripe';

/**
 * POST /api/billing/webhook
 * Webhook Stripe per gestire eventi subscription
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verifica firma webhook
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (error: any) {
      console.error('Webhook signature verification failed:', error.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Idempotency check: verifica se evento già processato
    const eventId = event.id;
    const processedEventsRef = db.collection('stripe_webhook_events').doc(eventId);
    const processedEventDoc = await processedEventsRef.get();

    if (processedEventDoc.exists) {
      // Evento già processato, ritorna successo senza ri-processare
      console.log(`Event ${eventId} already processed, skipping`);
      return NextResponse.json({ received: true, skipped: true });
    }

    // Marca evento come in processing prima di gestirlo
    await processedEventsRef.set({
      event_id: eventId,
      event_type: event.type,
      processed_at: new Date(),
      status: 'processing',
    });

    try {
      // Gestisci eventi Stripe
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutCompleted(session);
          break;
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionUpdated(subscription);
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await handleSubscriptionDeleted(subscription);
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as Stripe.Invoice;
          await handlePaymentSucceeded(invoice);
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as Stripe.Invoice;
          await handlePaymentFailed(invoice);
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Marca evento come completato
      await processedEventsRef.update({
        status: 'completed',
        completed_at: new Date(),
      });

    } catch (error: any) {
      // Marca evento come failed
      await processedEventsRef.update({
        status: 'failed',
        error: error.message,
        failed_at: new Date(),
      });
      throw error; // Rilancia per gestione errore globale
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Gestisci checkout completato
 * Crea order con configurazione cliente se presente
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userEmail = session.metadata?.user_id;
  const planId = session.metadata?.subscription_plan as 'starter' | 'pro' | 'enterprise';

  if (!userEmail || !planId) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  const pricingPlan = PRICING_PLANS[planId];
  if (!pricingPlan) {
    console.error('Invalid plan ID:', planId);
    return;
  }

  // Setup fee: crea invoice item se presente
  const setupFee = parseFloat(session.metadata?.setup_fee || '0');
  if (setupFee > 0 && session.customer) {
    try {
      const stripe = getStripe();
      await stripe.invoiceItems.create({
        customer: session.customer as string,
        amount: Math.round(setupFee * 100), // Converti in centesimi
        currency: 'eur',
        description: `Setup fee - ${pricingPlan.name} plan`,
      });
    } catch (error) {
      console.error('Error creating setup fee invoice item:', error);
    }
  }

  // Cerca configurazione in pending_checkouts
  // Prova prima con pending_checkout_id dal metadata se presente
  let pendingDoc: any = null;
  const pendingCheckoutId = session.metadata?.pending_checkout_id;
  
  if (pendingCheckoutId) {
    // Cerca per ID diretto (più veloce e preciso)
    const pendingRef = db.collection('pending_checkouts').doc(pendingCheckoutId);
    const pendingCheckoutDoc = await pendingRef.get();
    if (pendingCheckoutDoc.exists) {
      pendingDoc = pendingCheckoutDoc;
    }
  }
  
  // Fallback: cerca per user_id e customer_id
  if (!pendingDoc) {
    const pendingCheckoutsRef = db.collection('pending_checkouts');
    const pendingSnapshot = await pendingCheckoutsRef
      .where('user_id', '==', userEmail)
      .where('stripe_customer_id', '==', session.customer as string)
      .orderBy('created_at', 'desc')
      .limit(1)
      .get();
    
    if (!pendingSnapshot.empty) {
      pendingDoc = pendingSnapshot.docs[0];
    }
  }

  let orderId: string | null = null;

  if (pendingDoc) {
    // Configurazione trovata - crea order
    const pendingData = pendingDoc.data();
    const config = pendingData.config;

    // Get user profile per nome
    const userDoc = await db.collection('users').doc(userEmail).get();
    const userData = userDoc.data();

    // Trova il primo WhatsApp config abilitato (non assumere che sia il primo)
    const enabledWhatsAppConfig = config.whatsapp_configs?.find((wc: any) => wc.enabled) || config.whatsapp_configs?.[0] || null;

    // Crea order con configurazione
    orderId = await createOrder(
      userEmail,
      userData?.name || userEmail,
      session.id,
      session.customer as string,
      {
        company_name: config.company_name,
        industry: config.industry,
        subscription_plan: planId,
        customer_phone: config.customer_phone,
        customer_whatsapp: enabledWhatsAppConfig?.whatsapp_number || '',
        structured_output_config: enabledWhatsAppConfig?.structured_output_config || { fields: [] },
        order_details: config.order_details,
      }
    );

    // Aggiorna order con tutti i dati completi (inclusi WhatsApp multipli e voice_id)
    await db.collection('orders').doc(orderId).update({
      phone_provider: config.phone_provider,
      whatsapp_configs: config.whatsapp_configs,
      response_mode: config.response_mode,
      default_structured_output: config.default_structured_output,
      voice_id: config.voice_id, // Salva voice selection se presente
    });

    // Cancella pending checkout (usa ref se è un QueryDocumentSnapshot, altrimenti doc)
    if (pendingDoc.ref) {
      await pendingDoc.ref.delete();
    } else if (pendingDoc.id) {
      await db.collection('pending_checkouts').doc(pendingDoc.id).delete();
    }

    console.log(`Order created: ${orderId} for ${userEmail}`);
    
    // 🚀 AUTO-SETUP: Crea automaticamente assistant Vapi e compra numero Twilio
    try {
      const order = await getOrder(orderId);
      if (order) {
        console.log(`Starting auto-setup for order ${orderId}...`);
        const setupResult = await autoSetupOrder(order);
        
        if (setupResult.success) {
          console.log(`✅ Auto-setup completed for order ${orderId}:`, {
            vapiAssistantId: setupResult.vapiAssistantId,
            twilioPhoneNumber: setupResult.twilioPhoneNumber,
          });
        } else {
          console.error(`❌ Auto-setup failed for order ${orderId}:`, setupResult.error);
          // Non bloccare il flusso - l'admin può completare manualmente
        }
      }
    } catch (error) {
      console.error('Error during auto-setup:', error);
      // Non bloccare il flusso - l'admin può completare manualmente
    }
    
    // Invia email di conferma ordine
    try {
      const planName = PRICING_PLANS[planId]?.name || planId;
      await sendOrderConfirmationEmail(userEmail, userData?.name || userEmail, orderId, planName);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      // Non bloccare il flusso se l'email fallisce
    }
  } else {
    console.log(`No config found for ${userEmail}, creating subscription only`);
  }

  // Aggiorna user profile
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  await db.collection('users').doc(userEmail).update({
    subscription_plan: planId,
    subscription_status: 'active',
    monthly_calls_limit: pricingPlan.monthlyCallLimit,
    monthly_calls: 0, // Reset contatore mensile
    current_month_start: monthStart,
    stripe_customer_id: session.customer as string,
    stripe_subscription_id: session.subscription as string | undefined,
  });

  console.log(`Checkout completed for ${userEmail} - Plan: ${planId}${orderId ? ` - Order: ${orderId}` : ''}`);
}

/**
 * Gestisci subscription creata/aggiornata
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  // Trova user per customer ID
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('stripe_customer_id', '==', customerId).limit(1).get();
  
  if (snapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  const userDoc = snapshot.docs[0];
  const planId = subscription.metadata?.subscription_plan as 'starter' | 'pro' | 'enterprise';

  if (!planId) {
    console.error('Missing plan in subscription metadata:', subscription.id);
    return;
  }

  const pricingPlan = PRICING_PLANS[planId];
  if (!pricingPlan) {
    console.error('Invalid plan ID:', planId);
    return;
  }

  const status = subscription.status === 'active' ? 'active' : 
                 subscription.status === 'trialing' ? 'trial' :
                 subscription.status === 'past_due' || subscription.status === 'unpaid' ? 'suspended' :
                 'cancelled';

  await db.collection('users').doc(userDoc.id).update({
    subscription_status: status,
    subscription_plan: planId,
    monthly_calls_limit: pricingPlan.monthlyCallLimit,
    stripe_subscription_id: subscription.id,
  });

  console.log(`Subscription ${subscription.id} updated - Status: ${status}`);
}

/**
 * Gestisci subscription cancellata
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('stripe_customer_id', '==', customerId).limit(1).get();
  
  if (snapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await db.collection('users').doc(snapshot.docs[0].id).update({
    subscription_status: 'cancelled',
    stripe_subscription_id: null,
  });

  console.log(`Subscription ${subscription.id} cancelled`);
}

/**
 * Gestisci pagamento riuscito
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('stripe_customer_id', '==', customerId).limit(1).get();
  
  if (snapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  // Aggiorna subscription status a active se era suspended
  const userData = snapshot.docs[0].data();
  if (userData.subscription_status === 'suspended') {
    await db.collection('users').doc(snapshot.docs[0].id).update({
      subscription_status: 'active',
    });
  }

  console.log(`Payment succeeded for invoice ${invoice.id}`);
}

/**
 * Gestisci pagamento fallito
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('stripe_customer_id', '==', customerId).limit(1).get();
  
  if (snapshot.empty) {
    console.error('User not found for customer:', customerId);
    return;
  }

  await db.collection('users').doc(snapshot.docs[0].id).update({
    subscription_status: 'suspended',
  });

  console.log(`Payment failed for invoice ${invoice.id}`);
}

