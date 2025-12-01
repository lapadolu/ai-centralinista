import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/admin/stats
 * Statistiche globali per admin dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    // 1. Conta clienti
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'client')
      .get();
    
    const totalClients = usersSnapshot.size;
    
    // Conta clienti attivi (con subscription active o trial non scaduto)
    const now = new Date();
    let activeClients = 0;
    let trialClients = 0;
    
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      const subscriptionStatus = data.subscription_status;
      const trialEndsAt = data.trial_ends_at;
      
      if (subscriptionStatus === 'active') {
        activeClients++;
      } else if (subscriptionStatus === 'trial') {
        if (trialEndsAt) {
          const trialEnd = trialEndsAt.toDate();
          if (trialEnd > now) {
            trialClients++;
          }
        } else {
          trialClients++;
        }
      }
    });

    // 2. Conta chiamate totali
    const callsSnapshot = await db.collection('calls').get();
    const totalCalls = callsSnapshot.size;

    // 3. Calcola revenue ricorrente (da ordini attivi)
    const ordersSnapshot = await db.collection('orders')
      .where('setup_status', '==', 'active')
      .get();
    
    const planPrices: Record<string, number> = {
      'starter': 109,
      'pro': 179,
      'enterprise': 329,
    };
    
    const totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      const plan = data.subscription_plan;
      return sum + (planPrices[plan] || 0);
    }, 0);

    // 4. Calcola conversion rate medio (da chiamate con lead)
    const callsWithLead = callsSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.client_info?.nome && data.client_info.nome !== 'Non specificato';
    }).length;
    
    const averageConversion = totalCalls > 0 
      ? Math.round((callsWithLead / totalCalls) * 100) 
      : 0;

    return NextResponse.json({
      totalClients,
      activeClients,
      trialClients,
      totalCalls,
      totalRevenue,
      averageConversion,
    });

  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle statistiche' },
      { status: 500 }
    );
  }
}

