/**
 * Orders Management - Helper Functions
 * Gestione ordini per managed service
 */

import { db } from './firebase';
import { Order, OrderStatus } from './firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Crea nuovo ordine dopo Stripe checkout completato
 */
export async function createOrder(
  userEmail: string,
  userName: string,
  stripeSessionId: string,
  stripeCustomerId: string,
  orderData: {
    company_name: string;
    industry: string;
    subscription_plan: 'starter' | 'pro' | 'enterprise';
    customer_phone: string;
    customer_whatsapp?: string;
    structured_output_config?: {
      fields: Array<{
        name: string;
        label: string;
        type: 'text' | 'number' | 'select' | 'boolean';
        required: boolean;
        options?: string[];
      }>;
      example?: string;
    };
    order_details?: string;
  }
): Promise<string> {
  const orderId = `order-${Date.now()}`;
  const now = Timestamp.now();

  const order: Order = {
    id: orderId,
    user_id: userEmail,
    user_name: userName,
    company_name: orderData.company_name,
    industry: orderData.industry,
    subscription_plan: orderData.subscription_plan,
    stripe_checkout_session_id: stripeSessionId,
    stripe_customer_id: stripeCustomerId,
    customer_phone: orderData.customer_phone,
    phone_provider: '', // Sarà aggiornato dopo se presente in config
    whatsapp_configs: orderData.customer_whatsapp ? [
      {
        whatsapp_number: orderData.customer_whatsapp,
        structured_output_config: orderData.structured_output_config || { fields: [] },
        enabled: true,
      }
    ] : [],
    response_mode: 'immediate', // Default, sarà aggiornato se presente in config
    order_details: orderData.order_details,
    setup_status: 'pending_setup',
    call_forwarding_enabled: false,
    created_at: now,
    paid_at: now,
  };

  await db.collection('orders').doc(orderId).set(order);

  return orderId;
}

/**
 * Aggiorna status ordine
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  adminEmail?: string
): Promise<void> {
  const updateData: any = {
    setup_status: status,
    updated_at: Timestamp.now(),
  };

  // Aggiungi timestamp specifico per status
  switch (status) {
    case 'setup_in_progress':
      updateData.setup_started_at = Timestamp.now();
      if (adminEmail) updateData.setup_admin = adminEmail;
      break;
    case 'waiting_activation':
      updateData.agent_ready_at = Timestamp.now();
      break;
    case 'active':
      updateData.activated_at = Timestamp.now();
      break;
  }

  await db.collection('orders').doc(orderId).update(updateData);
}

/**
 * Aggiorna configurazione Vapi Assistant
 */
export async function updateVapiAssistantConfig(
  orderId: string,
  vapiAssistantId: string,
  config: {
    prompt: string;
    voice: string;
    first_message: string;
    end_call_function_enabled: boolean;
    response_mode: 'immediate' | 'missed_call_only';
  }
): Promise<void> {
  await db.collection('orders').doc(orderId).update({
    vapi_assistant_id: vapiAssistantId,
    vapi_assistant_config: config,
    updated_at: Timestamp.now(),
  });
}

/**
 * Aggiorna numero Twilio
 */
export async function updateTwilioNumber(
  orderId: string,
  twilioPhoneNumber: string,
  twilioSid: string
): Promise<void> {
  await db.collection('orders').doc(orderId).update({
    twilio_phone_number: twilioPhoneNumber,
    twilio_sid: twilioSid,
    updated_at: Timestamp.now(),
  });
}

/**
 * Conferma attivazione inoltro chiamate
 */
export async function confirmCallForwarding(orderId: string): Promise<void> {
  await db.collection('orders').doc(orderId).update({
    call_forwarding_enabled: true,
    updated_at: Timestamp.now(),
  });
}

/**
 * Get order by ID
 */
export async function getOrder(orderId: string): Promise<Order | null> {
  const doc = await db.collection('orders').doc(orderId).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Order;
}

/**
 * Get orders by user email
 */
export async function getUserOrders(userEmail: string): Promise<Order[]> {
  const snapshot = await db
    .collection('orders')
    .where('user_id', '==', userEmail)
    .orderBy('created_at', 'desc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

/**
 * Get pending orders (for admin)
 */
export async function getPendingOrders(): Promise<Order[]> {
  const snapshot = await db
    .collection('orders')
    .where('setup_status', '==', 'pending_setup')
    .orderBy('created_at', 'asc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

/**
 * Get orders by status (for admin)
 */
export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  const snapshot = await db
    .collection('orders')
    .where('setup_status', '==', status)
    .orderBy('created_at', 'asc')
    .get();

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Order));
}

