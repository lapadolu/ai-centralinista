import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/support/chat
 * Invia messaggio assistenza clienti
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const body = await request.json();
    const { message } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Messaggio obbligatorio' },
        { status: 400 }
      );
    }

    // Salva messaggio in Firestore
    const supportRef = db.collection('support_messages').doc();
    await supportRef.set({
      id: supportRef.id,
      user_id: session.user.email,
      user_name: session.user.name,
      message: message.trim(),
      status: 'open', // open, in_progress, resolved
      created_at: Timestamp.now(),
      type: 'chat',
    });

    // TODO: Invia email notifica a support team
    // TODO: Integrazione con sistema ticketing (Zendesk, Intercom, ecc.)

    return NextResponse.json({
      success: true,
      message: 'Messaggio inviato con successo',
      ticket_id: supportRef.id,
    });

  } catch (error: any) {
    console.error('Error sending support message:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'invio del messaggio' },
      { status: 500 }
    );
  }
}

