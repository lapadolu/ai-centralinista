import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/support/consultation
 * Richiesta consulenza personalizzata
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    
    const { name, email, phone, company, industry, request: consultationRequest } = body;

    // Validation
    if (!name || !email || !phone || !consultationRequest) {
      return NextResponse.json(
        { error: 'Nome, email, telefono e richiesta sono obbligatori' },
        { status: 400 }
      );
    }

    // Salva richiesta in Firestore
    const consultationRef = db.collection('consultation_requests').doc();
    await consultationRef.set({
      id: consultationRef.id,
      user_id: session?.user?.email || email, // Può essere anonimo o autenticato
      name,
      email,
      phone,
      company: company || '',
      industry: industry || '',
      request: consultationRequest.trim(),
      status: 'pending', // pending, contacted, scheduled, completed
      created_at: Timestamp.now(),
      priority: 'normal', // low, normal, high
    });

    // TODO: Invia email a sales/support team
    // TODO: Crea task in CRM (HubSpot, Salesforce, ecc.)
    // TODO: Notifica admin via email/Slack

    return NextResponse.json({
      success: true,
      message: 'Richiesta consulenza inviata con successo',
      request_id: consultationRef.id,
    });

  } catch (error: any) {
    console.error('Error creating consultation request:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'invio della richiesta' },
      { status: 500 }
    );
  }
}

