import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { getStripe, getOrCreateCustomer } from '@/lib/stripe';
import { PRICING_PLANS } from '@/lib/pricing';

/**
 * POST /api/admin/users/[email]/activate-subscription
 * Attiva abbonamento Stripe per un utente (admin only)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ email: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato - Accesso riservato agli admin' }, { status: 403 });
    }

    const { email } = await context.params;
    const body = await request.json();
    const { planId = 'starter' } = body;

    // Verifica plan valido
    const pricingPlan = PRICING_PLANS[planId];
    if (!pricingPlan) {
      return NextResponse.json({ error: 'Plan non valido' }, { status: 400 });
    }

    // Recupera utente
    const userDoc = await db.collection('users').doc(email).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const userData = userDoc.data();
    if (!userData) {
      return NextResponse.json({ error: 'Dati utente non validi' }, { status: 400 });
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      email,
      userData.name || email,
      {
        user_id: email,
        subscription_plan: planId,
      }
    );

    // Salva Stripe Customer ID se non già salvato
    if (!userData.stripe_customer_id) {
      await db.collection('users').doc(email).update({
        stripe_customer_id: customer.id,
      });
    }

    // Get Price ID from environment variables
    const priceIdEnvKey = `STRIPE_PRICE_ID_${planId.toUpperCase()}`;
    const priceId = process.env[priceIdEnvKey];

    if (!priceId) {
      return NextResponse.json(
        { 
          error: `Stripe Price ID non configurato per il piano ${planId}. Configura ${priceIdEnvKey} nelle variabili d'ambiente.` 
        },
        { status: 500 }
      );
    }

    // Crea subscription direttamente (senza checkout)
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      metadata: {
        user_id: email,
        subscription_plan: planId,
        activated_by: session.user.email || 'admin',
        activated_at: new Date().toISOString(),
      },
    });

    // Aggiorna profilo utente con subscription info
    await db.collection('users').doc(email).update({
      stripe_customer_id: customer.id,
      stripe_subscription_id: subscription.id,
      subscription_plan: planId,
      subscription_status: subscription.status,
      subscription_start_date: new Date(),
      monthly_calls_limit: pricingPlan.monthlyCallLimit,
      updated_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: `Abbonamento ${planId} attivato con successo per ${email}`,
      subscription_id: subscription.id,
      customer_id: customer.id,
      plan: planId,
    });

  } catch (error: any) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'attivazione dell\'abbonamento', details: error.message },
      { status: 500 }
    );
  }
}

