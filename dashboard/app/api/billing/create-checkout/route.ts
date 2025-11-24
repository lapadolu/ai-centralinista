import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db, UserProfile } from '@/lib/firebase';
import { getOrCreateCustomer, createCheckoutSession } from '@/lib/stripe';
import { PRICING_PLANS } from '@/lib/pricing';
import { checkoutSchema } from '@/lib/validation';
import { z } from 'zod';

/**
 * POST /api/billing/create-checkout
 * Crea Stripe Checkout Session per subscription con validazione Zod
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'client') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email!;
    const body = await request.json();

    // Validate input with Zod
    let validatedData;
    try {
      validatedData = checkoutSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return NextResponse.json(
          { error: firstError.message },
          { status: 400 }
        );
      }
      throw error;
    }

    const { planId } = validatedData;
    const setupFee = body.setupFee !== false; // Default true
    const config = body.config; // Configurazione completa del cliente

    // Validate config if provided
    if (config) {
      if (!config.company_name || !config.industry || !config.customer_phone || !config.phone_provider) {
        return NextResponse.json(
          { error: 'Configurazione incompleta. Compila tutti i campi obbligatori.' },
          { status: 400 }
        );
      }
      if (!config.whatsapp_configs || config.whatsapp_configs.length === 0) {
        return NextResponse.json(
          { error: 'Configura almeno un numero WhatsApp.' },
          { status: 400 }
        );
      }
    }

    const pricingPlan = PRICING_PLANS[planId];
    if (!pricingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Get user profile
    const userDoc = await db.collection('users').doc(userEmail).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const userData = userDoc.data() as UserProfile;

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      userEmail,
      userData.name || userEmail,
      {
        user_id: userEmail,
        subscription_plan: planId,
      }
    );

    // Salva Stripe Customer ID se non già salvato
    if (!userData.stripe_customer_id) {
      await db.collection('users').doc(userEmail).update({
        stripe_customer_id: customer.id,
      });
    }

    // Get Price ID from environment variables
    const priceIdEnvKey = `STRIPE_PRICE_ID_${planId.toUpperCase()}`;
    const priceId = process.env[priceIdEnvKey];

    if (!priceId) {
      return NextResponse.json(
        { 
          error: `Stripe Price ID not configured for plan ${planId}. Please set ${priceIdEnvKey} in environment variables.` 
        },
        { status: 500 }
      );
    }

    // Salva configurazione temporaneamente in pending_checkout (sarà usata dopo Stripe success)
    let pendingCheckoutId: string | undefined;
    if (config) {
      pendingCheckoutId = `pending-${Date.now()}`;
      await db.collection('pending_checkouts').doc(pendingCheckoutId).set({
        id: pendingCheckoutId,
        user_id: userEmail,
        user_name: userData.name || userEmail,
        plan_id: planId,
        config: config,
        stripe_customer_id: customer.id,
        created_at: new Date(),
      });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      userEmail,
      customer.id,
      priceId,
      {
        user_id: userEmail,
        subscription_plan: planId,
        setup_fee: setupFee ? pricingPlan.setupFee.toString() : '0',
        pending_checkout_id: pendingCheckoutId, // Link config to session
      }
    );

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id,
    });

  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}

