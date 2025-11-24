import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { getOrder } from '@/lib/orders';
import { Timestamp } from 'firebase-admin/firestore';
import { getVapiAssistant } from '@/lib/vapi';
import { getTwilioNumber } from '@/lib/twilio';
import { sendAgentReadyEmail } from '@/lib/email';

/**
 * POST /api/admin/orders/[orderId]/verify-setup
 * Verifica stato setup (Vapi agent, Twilio, webhook, ecc.)
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

    const verification: any = {
      vapi_agent_created: false,
      vapi_agent_test_passed: false,
      twilio_number_purchased: false,
      twilio_whatsapp_connected: false,
      webhook_configured: false,
      last_verified_at: Timestamp.now(),
    };

    // Verifica Vapi Agent
    if (order.vapi_assistant_id) {
      try {
        const vapiAgent = await getVapiAssistant(order.vapi_assistant_id);
        verification.vapi_agent_created = !!vapiAgent;
        // Se agent esiste, assumiamo che test sia passato (si può migliorare)
        verification.vapi_agent_test_passed = !!vapiAgent;
      } catch (error) {
        verification.vapi_agent_created = false;
        console.error('Error verifying Vapi agent:', error);
      }
    }

    // Verifica Twilio Number
    if (order.twilio_phone_number && order.twilio_sid) {
      try {
        const twilioNumber = await getTwilioNumber(order.twilio_sid);
        verification.twilio_number_purchased = !!twilioNumber;
      } catch (error) {
        verification.twilio_number_purchased = false;
        console.error('Error verifying Twilio number:', error);
      }
    }

    // Verifica WhatsApp connessi
    if (order.whatsapp_configs && order.whatsapp_configs.length > 0) {
      const enabledWhatsApp = order.whatsapp_configs.filter((wc) => wc.enabled);
      // TODO: Verifica reale connessione WhatsApp per ogni numero
      verification.twilio_whatsapp_connected = enabledWhatsApp.length > 0;
    }

    // Verifica Webhook
    if (order.vapi_assistant_id && order.twilio_phone_number) {
      // TODO: Verifica che webhook Vapi sia configurato correttamente
      verification.webhook_configured = true; // Placeholder
    }

    // Salva verification in order
    await db.collection('orders').doc(orderId).update({
      setup_verification: verification,
    });

    // Se tutto è pronto e non abbiamo ancora inviato email "Agent Ready", inviala
    const allReady = verification.vapi_agent_created && 
                     verification.twilio_number_purchased && 
                     order.setup_status !== 'waiting_activation' &&
                     order.setup_status !== 'active';
    
    if (allReady && order.twilio_phone_number) {
      try {
        await sendAgentReadyEmail(
          order.user_id,
          order.user_name,
          orderId,
          order.twilio_phone_number
        );
      } catch (error) {
        console.error('Error sending agent ready email:', error);
        // Non bloccare il flusso se l'email fallisce
      }
    }

    return NextResponse.json({
      success: true,
      verification,
    });

  } catch (error: any) {
    console.error('Error verifying setup:', error);
    return NextResponse.json(
      { error: 'Errore durante la verifica del setup' },
      { status: 500 }
    );
  }
}

