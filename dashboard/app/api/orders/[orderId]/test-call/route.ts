import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrder, updateOrderStatus } from '@/lib/orders';
import { makeTestCall } from '@/lib/vapi';

/**
 * POST /api/orders/[orderId]/test-call
 * Esegue chiamata test per verificare funzionamento agent
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const { orderId } = await context.params;
    const order = await getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    }

    // Verifica che l'ordine appartenga al cliente
    if (order.user_id !== session.user.email) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    if (!order.twilio_phone_number || !order.vapi_assistant_id) {
      return NextResponse.json(
        { error: 'Setup non completo. Contatta il supporto.' },
        { status: 400 }
      );
    }

    // Esegui chiamata test via Vapi
    // Usa il numero del cliente per testare (o un numero di test se disponibile)
    const testPhoneNumber = order.customer_phone || order.twilio_phone_number;
    
    try {
      const testCall = await makeTestCall(order.vapi_assistant_id, testPhoneNumber);

      if (testCall.success) {
        // Chiamata test avviata con successo
        // Nota: La chiamata potrebbe richiedere tempo per completarsi
        // In produzione, potresti voler aspettare il risultato o usare webhook
        
        return NextResponse.json({
          success: true,
          message: 'Chiamata test avviata con successo',
          callId: testCall.callId,
          note: 'La chiamata è in corso. Verifica il risultato nella dashboard.',
        });
      } else {
        return NextResponse.json(
          { 
            success: false,
            error: testCall.error || 'Errore durante la chiamata test',
          },
          { status: 500 }
        );
      }
    } catch (error: any) {
      console.error('Error executing test call:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Errore durante l\'esecuzione della chiamata test',
        },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error testing call:', error);
    return NextResponse.json(
      { error: 'Errore durante il test chiamata' },
      { status: 500 }
    );
  }
}

