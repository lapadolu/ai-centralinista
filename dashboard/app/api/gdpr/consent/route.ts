import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

/**
 * POST /api/gdpr/consent
 * Salva consenso GDPR per una chiamata/lead
 * Chiamato dal webhook Vapi quando l'AI riceve il consenso
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { call_id, consent, phone_number, user_id } = body;

    if (!call_id || typeof consent !== 'boolean') {
      return NextResponse.json(
        { error: 'call_id e consent (boolean) sono obbligatori' },
        { status: 400 }
      );
    }

    // Salva consenso in Firestore
    await db.collection('gdpr_consents').doc(call_id).set({
      call_id,
      consent,
      phone_number: phone_number || null,
      user_id: user_id || null,
      timestamp: new Date(),
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
    }, { merge: true });

    // Se consenso = false, rimuovi dati personali dalla call (anonimizza)
    if (!consent) {
      const callRef = db.collection('calls').doc(call_id);
      const callDoc = await callRef.get();
      
      if (callDoc.exists) {
        const callData = callDoc.data();
        // Anonimizza: mantieni solo dati aggregati, rimuovi nome e telefono
        await callRef.update({
          'client_info.nome': 'Anonimo',
          'client_info.telefono': null,
          customer_number: null,
          gdpr_consent: false,
          anonymized: true,
          anonymized_at: new Date(),
        });
      }
    } else {
      // Se consenso = true, aggiorna la call con il flag
      const callRef = db.collection('calls').doc(call_id);
      await callRef.update({
        gdpr_consent: true,
        consent_timestamp: new Date(),
      });
    }

    return NextResponse.json({ 
      success: true,
      message: consent ? 'Consenso salvato' : 'Consenso negato, dati anonimizzati'
    });

  } catch (error: any) {
    console.error('Error saving GDPR consent:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio del consenso' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gdpr/consent?call_id=xxx
 * Verifica consenso GDPR per una chiamata
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('call_id');

    if (!callId) {
      return NextResponse.json(
        { error: 'call_id è obbligatorio' },
        { status: 400 }
      );
    }

    const consentDoc = await db.collection('gdpr_consents').doc(callId).get();
    
    if (!consentDoc.exists) {
      return NextResponse.json({ 
        consent: null,
        message: 'Consenso non trovato'
      });
    }

    const consentData = consentDoc.data();
    return NextResponse.json({
      consent: consentData?.consent || false,
      timestamp: consentData?.timestamp?.toDate?.()?.toISOString() || null,
    });

  } catch (error: any) {
    console.error('Error fetching GDPR consent:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero del consenso' },
      { status: 500 }
    );
  }
}

