import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';

/**
 * GET /api/dashboard/zones
 * Recupera zone assignments e agents per l'utente
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Recupera user profile
    const userDoc = await db.collection('users').doc(session.user.email).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const userData = userDoc.data();
    
    return NextResponse.json({
      agents: userData?.agents || [],
      zoneAssignments: userData?.zone_assignments || {},
    });

  } catch (error: any) {
    console.error('Error fetching zones:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero delle zone' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dashboard/zones
 * Salva zone assignments e agents
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const body = await request.json();
    const { agents, zoneAssignments } = body;

    // Aggiorna user profile
    const updateData: any = {};
    
    if (agents !== undefined) {
      updateData.agents = agents;
    }
    
    if (zoneAssignments !== undefined) {
      updateData.zone_assignments = zoneAssignments;
    }

    updateData.updated_at = new Date();

    await db.collection('users').doc(session.user.email).update(updateData);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Error saving zones:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio delle zone' },
      { status: 500 }
    );
  }
}

