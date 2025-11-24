import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { confirmCallForwarding, getOrder, updateOrderStatus } from '@/lib/orders';

/**
 * POST /api/orders/[orderId]/confirm-forwarding
 * Cliente conferma di aver attivato inoltro chiamate
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

    // Conferma inoltro
    await confirmCallForwarding(orderId);

    // Trigger test call automatico (se possibile)
    // TODO: Implementare chiamata test

    return NextResponse.json({
      success: true,
      message: 'Inoltro confermato. Stiamo testando il tuo centralino...',
    });

  } catch (error: any) {
    console.error('Error confirming forwarding:', error);
    return NextResponse.json(
      { error: 'Errore durante la conferma' },
      { status: 500 }
    );
  }
}

