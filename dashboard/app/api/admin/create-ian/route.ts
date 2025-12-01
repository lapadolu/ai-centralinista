import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/admin/create-ian
 * Crea utente Ian e ordine per segreteria telefonica personale
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verifica admin
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    const email = 'ian@example.com'; // TODO: chiedere email reale a Ian
    const password = 'ian2025';
    const name = 'Ian';

    // Check if user already exists
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    let userId = email;
    if (userDoc.exists) {
      // Update password if exists
      const hashedPassword = await bcrypt.hash(password, 12);
      await userRef.update({
        password_hash: hashedPassword,
      });
      userId = userDoc.id || email;
    } else {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Calculate trial end date (40 days from now, come Federico e Gianluca)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 40);

      // Create user
      await userRef.set({
        email,
        name,
        password_hash: hashedPassword,
        role: 'client',
        subscription_status: 'trial',
        subscription_plan: null,
        trial_ends_at: Timestamp.fromDate(trialEndsAt),
        monthly_calls: 0,
        monthly_calls_limit: 0,
        total_calls: 0,
        current_month_start: Timestamp.now(),
        stripe_customer_id: null,
        stripe_subscription_id: null,
        billing_email: email,
        created_at: Timestamp.now(),
        zone_assignments: {},
        agents: [],
      });
      userId = userRef.id || email;
    }

    // Crea ordine per segreteria telefonica personale
    const orderRef = db.collection('orders').doc();
    const orderData = {
      user_id: userId,
      company_name: 'Ian - Segreteria Personale',
      industry: 'personale',
      status: 'pending_setup',
      setup_status: 'pending_setup',
      response_mode: 'immediate',
      voice_id: '21m00Tcm4TlvDq8ikWAM', // male_professional
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      // Configurazione WhatsApp per segreteria personale
      whatsapp_configs: [{
        enabled: true,
        destination_whatsapp: null, // Da configurare
        structured_output_config: {
          fields: [
            {
              name: 'nome',
              label: 'Nome completo',
              type: 'string',
              required: true,
            },
            {
              name: 'telefono',
              label: 'Numero di telefono',
              type: 'string',
              required: true,
            },
            {
              name: 'messaggio',
              label: 'Messaggio/Richiesta',
              type: 'string',
              required: false,
            },
            {
              name: 'urgenza',
              label: 'Urgenza',
              type: 'string',
              required: false,
              options: ['bassa', 'media', 'alta', 'urgente'],
            },
            {
              name: 'callback_preferito',
              label: 'Orario preferito per ricontatto',
              type: 'string',
              required: false,
            },
          ],
        },
      }],
      // Configurazione Vapi (da creare dopo)
      vapi_assistant_id: null,
      vapi_config: null,
      // Numero Twilio (da aggiungere dopo)
      twilio_phone_number: null,
      twilio_sid: null,
    };

    await orderRef.set(orderData);
    const orderId = orderRef.id;

    return NextResponse.json({
      success: true,
      message: 'Utente Ian e ordine creati con successo',
      user: {
        email,
        password,
        name,
        trial_ends_at: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
      },
      order: {
        id: orderId,
        company_name: orderData.company_name,
        industry: orderData.industry,
        status: orderData.status,
      },
      next_steps: [
        `1. Crea assistant Vapi: POST /api/admin/orders/${orderId}/create-assistant`,
        `2. Aggiungi numero Twilio quando disponibile: POST /api/admin/orders/${orderId}/set-twilio-number`,
        `3. Collega numero a Vapi: automatico quando aggiungi numero`,
      ],
    });

  } catch (error: any) {
    console.error('Error creating Ian:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione', details: error.message },
      { status: 500 }
    );
  }
}

