import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Call } from '@/lib/firebase';

/**
 * GET /api/dashboard/calls
 * Recupera tutte le chiamate per l'utente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Recupera tutte le chiamate filtrate per user_id
    let callsSnapshot;
    try {
      callsSnapshot = await db
        .collection('calls')
        .where('user_id', '==', session.user.email)
        .orderBy('started_at', 'desc')
        .limit(200)
        .get();
    } catch (error) {
      // Fallback: recupera tutte e filtra lato client
      const allCallsSnapshot = await db
        .collection('calls')
        .orderBy('started_at', 'desc')
        .limit(500)
        .get();
      
      callsSnapshot = {
        docs: allCallsSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.user_id === session.user.email || !data.user_id;
        })
      };
    }

    const calls = callsSnapshot.docs.map((doc) => {
      const data = doc.data() as Call;
      return {
        id: doc.id,
        call_id: data.call_id,
        customer_number: data.customer_number,
        status: data.status,
        started_at: data.started_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        ended_at: data.ended_at?.toDate?.()?.toISOString() || null,
        duration: data.duration || 0,
        transcript: data.transcript || '',
        client_info: data.client_info || {},
      };
    });

    return NextResponse.json({ calls });

  } catch (error: any) {
    console.error('Error fetching calls:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle chiamate' },
      { status: 500 }
    );
  }
}

