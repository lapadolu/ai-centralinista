import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/admin/api-costs
 * Calcola costi API per il mese corrente e storico
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM format
    const year = searchParams.get('year');

    // Calcola periodo (mese corrente se non specificato)
    const now = new Date();
    const targetMonth = month ? parseInt(month.split('-')[1]) : now.getMonth() + 1;
    const targetYear = year ? parseInt(year) : now.getFullYear();
    
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    // 1. VAPI COSTS - Chiamate processate
    const callsSnapshot = await db.collection('calls')
      .where('created_at', '>=', startTimestamp)
      .where('created_at', '<=', endTimestamp)
      .get();

    const totalCalls = callsSnapshot.size;
    const callsWithDuration = callsSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.duration && data.duration > 0;
    });

    // Calcola minuti totali
    const totalMinutes = callsWithDuration.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.duration || 0);
    }, 0);

    // Costi Vapi (stima basata su pricing tipico)
    // Vapi: ~$0.02-0.05 per minuto (varia in base al provider voice)
    const vapiCostPerMinute = 0.03; // $0.03/minuto (stima media)
    const vapiCost = (totalMinutes * vapiCostPerMinute).toFixed(2);

    // 2. TWILIO COSTS - SMS/WhatsApp
    // Conta notifiche WhatsApp inviate (dalle chiamate con lead_status = 'completed')
    const completedCalls = callsSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.lead_status === 'completed' || data.lead_status === 'qualified';
    });

    const whatsappMessages = completedCalls.length;
    // Twilio WhatsApp: ~$0.005-0.01 per messaggio
    const twilioWhatsAppCostPerMessage = 0.0075; // $0.0075/messaggio (stima media)
    const twilioWhatsAppCost = (whatsappMessages * twilioWhatsAppCostPerMessage).toFixed(2);

    // Twilio Phone Numbers: ~$1.5/mese per numero (se acquistati manualmente)
    // Conta ordini attivi con numero Twilio
    const ordersSnapshot = await db.collection('orders')
      .where('setup_status', '==', 'active')
      .get();
    
    const activeTwilioNumbers = ordersSnapshot.docs.filter(doc => {
      const data = doc.data();
      return data.twilio_phone_number;
    }).length;

    const twilioNumberCost = (activeTwilioNumbers * 1.5).toFixed(2);

    // 3. OPENAI/ANTHROPIC COSTS (tramite Vapi)
    // Stima basata su chiamate e durata
    // OpenAI GPT-4: ~$0.03-0.06 per 1K tokens input, $0.06-0.12 per 1K tokens output
    // Stima: ~$0.01-0.02 per minuto di conversazione
    const openaiCostPerMinute = 0.015; // $0.015/minuto (stima)
    const openaiCost = (totalMinutes * openaiCostPerMinute).toFixed(2);

    // 4. 11LABS COSTS (tramite Vapi)
    // 11Labs: ~$0.18-0.30 per 1000 caratteri
    // Stima: ~$0.01-0.02 per minuto
    const elevenlabsCostPerMinute = 0.015; // $0.015/minuto (stima)
    const elevenlabsCost = (totalMinutes * elevenlabsCostPerMinute).toFixed(2);

    // 5. FIRESTORE COSTS
    // Firestore: $0.18 per 100K reads, $0.18 per 100K writes, $0.18 per 100K deletes
    // Stima basata su chiamate: ogni chiamata = ~10 reads + 5 writes
    const firestoreReads = totalCalls * 10;
    const firestoreWrites = totalCalls * 5;
    const firestoreReadCost = ((firestoreReads / 100000) * 0.18).toFixed(4);
    const firestoreWriteCost = ((firestoreWrites / 100000) * 0.18).toFixed(4);

    // 6. VERCEL/GCP COSTS (stima)
    // Vercel: ~$20/mese per Hobby, $40+ per Pro
    // GCP Functions: ~$0.40 per milione di invocazioni
    const gcpInvocations = totalCalls * 2; // webhook + notification
    const gcpCost = ((gcpInvocations / 1000000) * 0.40).toFixed(4);

    // Costi totali
    const totalCost = (
      parseFloat(vapiCost) +
      parseFloat(twilioWhatsAppCost) +
      parseFloat(twilioNumberCost) +
      parseFloat(openaiCost) +
      parseFloat(elevenlabsCost) +
      parseFloat(firestoreReadCost) +
      parseFloat(firestoreWriteCost) +
      parseFloat(gcpCost)
    ).toFixed(2);

    // Revenue dal mese (da ordini)
    const ordersThisMonth = await db.collection('orders')
      .where('created_at', '>=', startTimestamp)
      .where('created_at', '<=', endTimestamp)
      .get();

    const revenue = ordersThisMonth.docs.reduce((sum, doc) => {
      const data = doc.data();
      // Assumi pricing standard (da aggiornare con pricing reale)
      const planPrices: Record<string, number> = {
        'starter': 109,
        'professional': 149,
        'enterprise': 199,
      };
      return sum + (planPrices[data.subscription_plan] || 0);
    }, 0);

    // Revenue ricorrente (da ordini attivi)
    const recurringRevenue = ordersSnapshot.docs.reduce((sum, doc) => {
      const data = doc.data();
      const planPrices: Record<string, number> = {
        'starter': 109,
        'professional': 149,
        'enterprise': 199,
      };
      return sum + (planPrices[data.subscription_plan] || 0);
    }, 0);

    return NextResponse.json({
      period: {
        month: targetMonth,
        year: targetYear,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      usage: {
        totalCalls,
        totalMinutes: Math.round(totalMinutes),
        whatsappMessages,
        activeTwilioNumbers,
        firestoreReads,
        firestoreWrites,
        gcpInvocations,
      },
      costs: {
        vapi: {
          amount: parseFloat(vapiCost),
          currency: 'USD',
          description: 'Vapi.ai voice processing',
          perMinute: vapiCostPerMinute,
        },
        twilioWhatsApp: {
          amount: parseFloat(twilioWhatsAppCost),
          currency: 'USD',
          description: 'Twilio WhatsApp messages',
          perMessage: twilioWhatsAppCostPerMessage,
        },
        twilioNumbers: {
          amount: parseFloat(twilioNumberCost),
          currency: 'USD',
          description: 'Twilio phone numbers (monthly)',
          perNumber: 1.5,
        },
        openai: {
          amount: parseFloat(openaiCost),
          currency: 'USD',
          description: 'OpenAI GPT (via Vapi)',
          perMinute: openaiCostPerMinute,
        },
        elevenlabs: {
          amount: parseFloat(elevenlabsCost),
          currency: 'USD',
          description: '11Labs voice synthesis (via Vapi)',
          perMinute: elevenlabsCostPerMinute,
        },
        firestore: {
          amount: parseFloat(firestoreReadCost) + parseFloat(firestoreWriteCost),
          currency: 'USD',
          description: 'Firestore database operations',
          reads: parseFloat(firestoreReadCost),
          writes: parseFloat(firestoreWriteCost),
        },
        gcp: {
          amount: parseFloat(gcpCost),
          currency: 'USD',
          description: 'Google Cloud Functions',
          perMillion: 0.40,
        },
        total: {
          amount: parseFloat(totalCost),
          currency: 'USD',
        },
      },
      revenue: {
        thisMonth: revenue,
        recurring: recurringRevenue,
        profit: recurringRevenue - parseFloat(totalCost),
        margin: recurringRevenue > 0 
          ? (((recurringRevenue - parseFloat(totalCost)) / recurringRevenue) * 100).toFixed(1)
          : '0',
      },
    });

  } catch (error: any) {
    console.error('Error calculating API costs:', error);
    return NextResponse.json(
      { error: 'Errore durante il calcolo dei costi' },
      { status: 500 }
    );
  }
}

