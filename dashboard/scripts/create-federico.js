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

async function createFederico() {
  const email = 'federico@iconacasa.com';
  const password = 'federico2025';
  const name = 'Federico';

  try {
    console.log('Creazione utente Federico...\n');

    const hashedPassword = await bcrypt.hash(password, 12);
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log('⚠️  Utente già esistente, aggiorno password...');
      await userRef.update({ password_hash: hashedPassword });
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
      console.log('✅ Utente creato!');
    }

    console.log('\nCredenziali:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Trial scade:', trialEndsAt.toLocaleDateString('it-IT'));

  } catch (error) {
    console.error('❌ Errore:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createFederico();

