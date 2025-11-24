import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getOrdersByStatus, getPendingOrders } from '@/lib/orders';
import { OrderStatus } from '@/lib/firebase';

/**
 * GET /api/admin/orders
 * Lista ordini per admin (filtrabile per status)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato - Accesso riservato agli admin' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const status = statusParam && statusParam !== 'all' ? (statusParam as OrderStatus) : null;

    let orders;
    if (status) {
      orders = await getOrdersByStatus(status);
    } else {
      // Se no status, mostra pending (più comuni)
      orders = await getPendingOrders();
      // Aggiungi anche altri status per vista completa
      const inProgress = await getOrdersByStatus('setup_in_progress');
      const waiting = await getOrdersByStatus('waiting_activation');
      orders = [...orders, ...inProgress, ...waiting];
    }

    return NextResponse.json({
      orders,
      count: orders.length,
    });

  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero degli ordini' },
      { status: 500 }
    );
  }
}

