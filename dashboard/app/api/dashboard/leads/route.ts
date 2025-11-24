import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Call } from '@/lib/firebase';

/**
 * GET /api/dashboard/leads
 * Recupera tutti i leads (chiamate completate) per l'utente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Recupera chiamate completate filtrate per user_id
    // Il webhook ora salva user_id nelle calls tramite assistant_id -> order lookup
    let callsSnapshot;
    try {
      // Prova prima a filtrare per user_id (se presente nelle calls)
      callsSnapshot = await db
        .collection('calls')
        .where('status', '==', 'completed')
        .where('user_id', '==', session.user.email)
        .orderBy('ended_at', 'desc')
        .limit(100)
        .get();
    } catch (error) {
      // Se fallisce (indice mancante o campo non presente), filtra lato client
      const allCallsSnapshot = await db
        .collection('calls')
        .where('status', '==', 'completed')
        .orderBy('ended_at', 'desc')
        .limit(500) // Prendi più calls per filtrare lato client
        .get();
      
      // Filtra per user_id se presente, altrimenti usa tutti (temporaneo)
      callsSnapshot = {
        docs: allCallsSnapshot.docs.filter(doc => {
          const data = doc.data();
          return data.user_id === session.user.email || !data.user_id; // Include calls senza user_id per retrocompatibilità
        })
      };
    }

    const leads = callsSnapshot.docs.map((doc) => {
      const data = doc.data() as Call;
      const clientInfo = (data.client_info || {}) as {
        nome?: string;
        telefono?: string;
        tipo_richiesta?: string;
        zona?: string;
        tipo_immobile?: string;
        budget?: string;
        note?: string;
      };
      
      return {
        id: data.call_id,
        nome: clientInfo.nome || 'Non specificato',
        telefono: clientInfo.telefono || data.customer_number,
        tipo_richiesta: clientInfo.tipo_richiesta || 'Non specificato',
        zona: clientInfo.zona || 'Non specificato',
        tipo_immobile: clientInfo.tipo_immobile || 'Non specificato',
        budget: clientInfo.budget || 'Non specificato',
        note: clientInfo.note || '',
        status: 'nuovo' as const,
        timestamp: data.ended_at?.toDate?.()?.toLocaleString('it-IT') || new Date().toLocaleString('it-IT'),
        duration: data.duration || 0,
        transcript: data.transcript || '',
        call_id: data.call_id,
      };
    });

    return NextResponse.json({ leads });

  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero dei leads' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/dashboard/leads
 * Aggiorna status di un lead
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const body = await request.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json(
        { error: 'leadId e status sono obbligatori' },
        { status: 400 }
      );
    }

    // Per ora salva in una collection separata per tracking status
    // In futuro potresti aggiungere un campo status alla collection calls
    await db.collection('lead_status').doc(leadId).set({
      lead_id: leadId,
      status,
      updated_at: new Date(),
      updated_by: session.user.email,
    }, { merge: true });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento del lead' },
      { status: 500 }
    );
  }
}

