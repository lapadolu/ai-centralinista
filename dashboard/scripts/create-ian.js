const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Carica service account da env var o file
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
} else {
  const serviceAccountPath = path.join(__dirname, '../../backend/functions/service-account.json');
  if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ Service account non trovato. Usa FIREBASE_SERVICE_ACCOUNT_JSON env var o metti il file in backend/functions/');
    process.exit(1);
  }
  serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ai-centralinista-2025',
});

const db = admin.firestore();

async function createIan() {
  const email = 'ian@example.com'; // TODO: chiedere email reale
  const password = 'ian2025';
  const name = 'Ian';

  try {
    console.log('Creazione utente Ian...\n');

    const hashedPassword = await bcrypt.hash(password, 12);
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 40); // 40 giorni come Federico e Gianluca

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    let userId;
    if (userDoc.exists) {
      console.log('⚠️  Utente già esistente, aggiorno password...');
      await userRef.update({ password_hash: hashedPassword });
      userId = userRef.id;
      console.log('✅ Password aggiornata!');
    } else {
      await userRef.set({
        email,
        name,
        password_hash: hashedPassword,
        role: 'client',
        subscription_status: 'trial',
        subscription_plan: null,
        trial_ends_at: admin.firestore.Timestamp.fromDate(trialEndsAt),
        monthly_calls: 0,
        monthly_calls_limit: 0,
        total_calls: 0,
        current_month_start: admin.firestore.Timestamp.now(),
        stripe_customer_id: null,
        stripe_subscription_id: null,
        billing_email: email,
        created_at: admin.firestore.Timestamp.now(),
        zone_assignments: {},
        agents: [],
      });
      userId = userRef.id;
      console.log('✅ Utente creato!');
    }

    // Crea ordine per segreteria telefonica personale
    console.log('\nCreazione ordine per Ian...');
    const orderRef = db.collection('orders').doc();
    const orderData = {
      user_id: userId,
      company_name: 'Ian - Segreteria Personale',
      industry: 'personale',
      status: 'pending_setup',
      setup_status: 'pending_setup',
      response_mode: 'immediate',
      voice_id: '21m00Tcm4TlvDq8ikWAM', // male_professional
      created_at: admin.firestore.Timestamp.now(),
      updated_at: admin.firestore.Timestamp.now(),
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
    console.log('✅ Ordine creato!');
    console.log(`   Order ID: ${orderId}`);

    console.log('\n✅ Setup completato!');
    console.log('\nCredenziali:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Trial scade:', trialEndsAt.toLocaleDateString('it-IT'));
    console.log('\nProssimi passi:');
    console.log('1. Crea assistant Vapi tramite /admin/setup/' + orderId);
    console.log('2. Aggiungi numero Twilio quando disponibile');
    console.log('3. Collega numero a Vapi assistant');

  } catch (error) {
    console.error('❌ Errore:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createIan();

