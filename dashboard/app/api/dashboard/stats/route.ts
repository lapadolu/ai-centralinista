import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/dashboard/stats
 * Recupera statistiche dashboard per l'utente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Recupera tutte le calls e filtra per user_id
    let allTodayCalls, allWeekCalls, allMonthCalls;
    
    try {
      // Prova a filtrare per user_id se presente
      allTodayCalls = await db
        .collection('calls')
        .where('user_id', '==', session.user.email)
        .where('started_at', '>=', Timestamp.fromDate(todayStart))
        .get();
      
      allWeekCalls = await db
        .collection('calls')
        .where('user_id', '==', session.user.email)
        .where('started_at', '>=', Timestamp.fromDate(weekStart))
        .get();
      
      allMonthCalls = await db
        .collection('calls')
        .where('user_id', '==', session.user.email)
        .where('started_at', '>=', Timestamp.fromDate(monthStart))
        .get();
    } catch (error) {
      // Se fallisce (indice mancante), recupera tutte e filtra lato client
      const allCalls = await db
        .collection('calls')
        .where('started_at', '>=', Timestamp.fromDate(monthStart))
        .get();
      
      const userCalls = allCalls.docs.filter(doc => {
        const data = doc.data();
        return data.user_id === session.user.email || !data.user_id; // Retrocompatibilità
      });
      
      allTodayCalls = { docs: userCalls.filter(doc => {
        const data = doc.data();
        return data.started_at?.toDate() >= todayStart;
      })};
      
      allWeekCalls = { docs: userCalls.filter(doc => {
        const data = doc.data();
        return data.started_at?.toDate() >= weekStart;
      })};
      
      allMonthCalls = { docs: userCalls };
    }

    const todayCalls = allTodayCalls;
    const weekCalls = allWeekCalls;
    const monthCalls = allMonthCalls;

    // Conta leads oggi (chiamate completate con dati)
    const todayLeads = todayCalls.docs.filter(doc => {
      const data = doc.data();
      const clientInfo = (data.client_info || {}) as { nome?: string };
      return data.status === 'completed' && clientInfo.nome && clientInfo.nome !== 'Non specificato';
    }).length;

    // Recupera chiamate recenti
    let recentCallsSnapshot;
    try {
      recentCallsSnapshot = await db
        .collection('calls')
        .where('status', '==', 'completed')
        .where('user_id', '==', session.user.email)
        .orderBy('ended_at', 'desc')
        .limit(10)
        .get();
    } catch (error) {
      // Fallback: recupera tutte e filtra
      const allRecent = await db
        .collection('calls')
        .where('status', '==', 'completed')
        .orderBy('ended_at', 'desc')
        .limit(100)
        .get();
      
      recentCallsSnapshot = {
        docs: allRecent.docs.filter(doc => {
          const data = doc.data();
          return data.user_id === session.user.email || !data.user_id;
        }).slice(0, 10)
      };
    }

    const recentCalls = recentCallsSnapshot.docs.map((doc) => {
      const data = doc.data();
      const clientInfo = (data.client_info || {}) as {
        nome?: string;
        telefono?: string;
        zona?: string;
      };
      return {
        id: data.call_id,
        nome: clientInfo.nome || 'Non specificato',
        telefono: clientInfo.telefono || data.customer_number,
        zona: clientInfo.zona || 'Non specificato',
        timestamp: data.ended_at?.toDate?.()?.toLocaleString('it-IT') || new Date().toLocaleString('it-IT'),
        duration: data.duration || 0,
      };
    });

    return NextResponse.json({
      stats: {
        today: todayCalls.size,
        week: weekCalls.size,
        month: monthCalls.size,
        todayLeads,
      },
      recentCalls,
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle statistiche' },
      { status: 500 }
    );
  }
}

