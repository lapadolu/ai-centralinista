import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserOrders } from '@/lib/orders';

/**
 * GET /api/orders/current
 * Recupera ordine corrente del cliente (più recente)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const orders = await getUserOrders(session.user.email);
    
    // Ritorna ordine più recente
    const currentOrder = orders.length > 0 ? orders[0] : null;

    return NextResponse.json({
      order: currentOrder,
    });

  } catch (error: any) {
    console.error('Error fetching current order:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dell\'ordine' },
      { status: 500 }
    );
  }
}

