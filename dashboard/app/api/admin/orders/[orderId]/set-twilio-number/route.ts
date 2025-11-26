import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrder, updateTwilioNumber } from '@/lib/orders';
import { linkTwilioNumberToVapi } from '@/lib/vapi';

/**
 * POST /api/admin/orders/[orderId]/set-twilio-number
 * Aggiunge manualmente un numero Twilio esistente (non acquista)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato - Accesso riservato agli admin' }, { status: 403 });
    }

    const { orderId } = await context.params;
    const body = await request.json();
    const { phone_number, sid } = body;

    if (!phone_number) {
      return NextResponse.json({ error: 'phone_number è obbligatorio' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    }

    // Salva numero (usa SID se fornito, altrimenti genera uno placeholder)
    await updateTwilioNumber(orderId, phone_number, sid || `manual-${Date.now()}`);

    // Collega a Vapi se presente
    if (order.vapi_assistant_id) {
      try {
        await linkTwilioNumberToVapi(order.vapi_assistant_id, phone_number);
      } catch (error) {
        console.error('Error linking to Vapi:', error);
        // Non bloccare se fallisce il linking
      }
    }

    return NextResponse.json({
      success: true,
      phone_number,
      sid: sid || `manual-${Date.now()}`,
      message: 'Numero Twilio aggiunto manualmente',
    });

  } catch (error: any) {
    console.error('Error setting Twilio number:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiunta del numero' },
      { status: 500 }
    );
  }
}

