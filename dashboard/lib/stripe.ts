/**
 * Stripe Client Configuration
 */

import Stripe from 'stripe';

// Server-side Stripe client - lazy initialization
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      // During build, env vars might not be available - return a dummy instance
      // This will fail at runtime if STRIPE_SECRET_KEY is not set, which is expected
      stripeInstance = new Stripe('sk_test_dummy_for_build', {
        apiVersion: '2025-10-29.clover',
        typescript: true,
      });
    } else {
      stripeInstance = new Stripe(secretKey, {
        apiVersion: '2025-10-29.clover',
        typescript: true,
      });
    }
  }
  return stripeInstance;
}

// Export getStripe function - use getStripe() in API routes instead of direct import

// Stripe Config
export const STRIPE_CONFIG = {
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  successUrl: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`
    : 'http://localhost:3000/dashboard/billing?success=true',
  cancelUrl: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`
    : 'http://localhost:3000/dashboard/billing?canceled=true',
};

/**
 * Crea una Checkout Session Stripe per subscription
 */
export async function createCheckoutSession(
  customerEmail: string,
  customerId: string | undefined,
  priceId: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Checkout.Session> {
  const stripe = getStripe();
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: 'subscription',
    customer: customerId,
    customer_email: customerId ? undefined : customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata,
    },
    payment_method_types: ['card'],
    success_url: STRIPE_CONFIG.successUrl,
    cancel_url: STRIPE_CONFIG.cancelUrl,
    metadata,
  };

  return await stripe.checkout.sessions.create(sessionParams);
}

/**
 * Verifica firma webhook Stripe
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_CONFIG.webhookSecret
  );
}

/**
 * Crea o recupera Stripe Customer
 */
export async function getOrCreateCustomer(
  email: string,
  name: string,
  metadata: Record<string, string> = {}
): Promise<Stripe.Customer> {
  const stripe = getStripe();
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0];
  }

  return await stripe.customers.create({
    email,
    name,
    metadata,
  });
}

