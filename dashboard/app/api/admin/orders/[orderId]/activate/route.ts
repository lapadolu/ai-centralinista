import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrder, updateOrderStatus } from '@/lib/orders';
import { sendActivationEmail } from '@/lib/email';

/**
 * POST /api/admin/orders/[orderId]/activate
 * Attiva ordine - notifica cliente e invia istruzioni
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato - Accesso riservato agli admin' }, { status: 403 });
    }

    const { orderId } = await context.params;
    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    }

    // Verifica che setup sia completo
    if (!order.vapi_assistant_id || !order.twilio_phone_number) {
      return NextResponse.json(
        { error: 'Completa prima la configurazione Vapi Agent e Twilio Number' },
        { status: 400 }
      );
    }

    // Aggiorna status a waiting_activation
    await updateOrderStatus(orderId, 'waiting_activation', session.user.email);

    // Invia email cliente con istruzioni provider-specific
    try {
      await sendActivationEmail(
        order.user_id,
        order.user_name,
        orderId,
        order.twilio_phone_number!,
        order.phone_provider || 'Generico',
        order.customer_phone
      );
    } catch (error) {
      console.error('Error sending activation email:', error);
      // Non bloccare il flusso se l'email fallisce
    }

    return NextResponse.json({
      success: true,
      message: 'Ordine attivato. Cliente notificato.',
      status: 'waiting_activation',
    });

  } catch (error: any) {
    console.error('Error activating order:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'attivazione dell\'ordine' },
      { status: 500 }
    );
  }
}

