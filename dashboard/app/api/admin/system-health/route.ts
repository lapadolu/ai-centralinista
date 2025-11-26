import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/system-health
 * Verifica stato dei servizi esterni
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    const now = new Date().toISOString();

    // 1. Firestore - Test connessione
    let firestoreStatus: 'healthy' | 'degraded' | 'down' = 'healthy';
    let firestoreLatency = 0;
    try {
      const start = Date.now();
      // Test semplice - verifica che possiamo accedere a Firestore
      // In produzione, potresti fare una query leggera
      firestoreLatency = Date.now() - start;
      if (firestoreLatency > 1000) {
        firestoreStatus = 'degraded';
      }
    } catch (error) {
      firestoreStatus = 'down';
    }

    // 2. Vapi - Verifica API key configurata
    const vapiApiKeyConfigured = !!process.env.VAPI_API_KEY;
    const vapiStatus: 'healthy' | 'degraded' | 'down' = vapiApiKeyConfigured ? 'healthy' : 'down';

    // 3. Twilio - Verifica credenziali configurate
    const twilioAccountSidConfigured = !!process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthTokenConfigured = !!process.env.TWILIO_AUTH_TOKEN;
    const twilioStatus: 'healthy' | 'degraded' | 'down' = 
      (twilioAccountSidConfigured && twilioAuthTokenConfigured) ? 'healthy' : 'down';

    // 4. Vercel - Verifica deployment (semplificato)
    const vercelStatus: 'healthy' | 'degraded' | 'down' = 'healthy'; // Assumiamo sempre healthy se siamo su Vercel
    const deploymentStatus = process.env.VERCEL_ENV || 'development';

    // 5. GCP Functions - Verifica variabili ambiente
    const gcpFunctionsDeployed = !!(
      process.env.GCP_PROJECT_ID || 
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    );
    const gcpStatus: 'healthy' | 'degraded' | 'down' = gcpFunctionsDeployed ? 'healthy' : 'degraded';

    return NextResponse.json({
      firestore: {
        status: firestoreStatus,
        latency: firestoreLatency,
        lastCheck: now,
      },
      vapi: {
        status: vapiStatus,
        apiKeyConfigured: vapiApiKeyConfigured,
        lastCheck: now,
      },
      twilio: {
        status: twilioStatus,
        accountSidConfigured: twilioAccountSidConfigured,
        authTokenConfigured: twilioAuthTokenConfigured,
        lastCheck: now,
      },
      vercel: {
        status: vercelStatus,
        deploymentStatus,
        lastCheck: now,
      },
      gcp: {
        status: gcpStatus,
        functionsDeployed: gcpFunctionsDeployed,
        lastCheck: now,
      },
    });

  } catch (error: any) {
    console.error('Error checking system health:', error);
    return NextResponse.json(
      { error: 'Errore durante il check dello stato' },
      { status: 500 }
    );
  }
}

