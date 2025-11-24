import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrder, updateTwilioNumber } from '@/lib/orders';
import { purchaseAvailableItalianNumber, configureTwilioNumberWebhook } from '@/lib/twilio';
import { linkTwilioNumberToVapi } from '@/lib/vapi';

/**
 * POST /api/admin/orders/[orderId]/purchase-twilio-number
 * Acquista numero Twilio per l'ordine
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

    if (!order.vapi_assistant_id) {
      return NextResponse.json(
        { error: 'Crea prima l\'agent Vapi prima di acquistare il numero Twilio' },
        { status: 400 }
      );
    }

    // Acquista numero Twilio italiano disponibile
    const purchasedNumber = await purchaseAvailableItalianNumber();
    const twilioPhoneNumber = purchasedNumber.phoneNumber;
    const twilioSid = purchasedNumber.sid;

    // Salva numero in order
    await updateTwilioNumber(orderId, twilioPhoneNumber, twilioSid);

    // Collega numero a Vapi agent
    if (order.vapi_assistant_id) {
      try {
        await linkTwilioNumberToVapi(order.vapi_assistant_id, twilioPhoneNumber);
      } catch (linkError: any) {
        // Log errore ma non bloccare (potrebbe essere già collegato)
        console.error('Error linking Twilio number to Vapi:', linkError);
      }
    }

    return NextResponse.json({
      success: true,
      phone_number: twilioPhoneNumber,
      sid: twilioSid,
      message: 'Numero Twilio acquistato con successo',
    });

  } catch (error: any) {
    console.error('Error purchasing Twilio number:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'acquisto del numero Twilio' },
      { status: 500 }
    );
  }
}

