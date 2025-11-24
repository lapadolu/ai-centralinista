#!/usr/bin/env node

/**
 * Script per verificare che tutte le env vars necessarie siano configurate
 * Usa: node scripts/check-env-vars.js
 */

const requiredVars = {
  // NextAuth
  NEXTAUTH_SECRET: 'Genera con: openssl rand -base64 32',
  NEXTAUTH_URL: 'URL del sito (es: https://www.helping-hand.it)',
  
  // Stripe
  STRIPE_SECRET_KEY: 'Da Stripe Dashboard → API Keys',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'Da Stripe Dashboard → API Keys',
  STRIPE_WEBHOOK_SECRET: 'Da Stripe Dashboard → Webhooks (dopo creazione endpoint)',
  STRIPE_PRICE_ID_STARTER: 'Da Stripe Dashboard → Products',
  STRIPE_PRICE_ID_PRO: 'Da Stripe Dashboard → Products',
  STRIPE_PRICE_ID_ENTERPRISE: 'Da Stripe Dashboard → Products',
  
  // Vapi
  VAPI_API_KEY: 'Da Vapi Dashboard → API Keys',
  VAPI_WEBHOOK_URL: 'URL Cloud Function dopo deploy (es: https://region-project.cloudfunctions.net/vapi-webhook)',
  
  // Twilio
  TWILIO_ACCOUNT_SID: 'Da Twilio Console → Account Info',
  TWILIO_AUTH_TOKEN: 'Da Twilio Console → Account Info',
  
  // Resend
  RESEND_API_KEY: 'Da Resend Dashboard → API Keys',
  RESEND_FROM_EMAIL: 'Email mittente (es: Helping Hand <noreply@helping-hand.it>)',
  
  // Firebase
  FIREBASE_PROJECT_ID: 'ai-centralinista-2025',
  FIREBASE_SERVICE_ACCOUNT_JSON: 'Service account JSON da Firebase Console (o GOOGLE_APPLICATION_CREDENTIALS)',
  
  // App
  NEXT_PUBLIC_APP_URL: 'URL pubblico del sito (es: https://www.helping-hand.it)',
};

const optionalVars = {
  // Firebase Client (se usi Firebase Client SDK)
  NEXT_PUBLIC_FIREBASE_API_KEY: 'Da Firebase Console → Project Settings',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'Da Firebase Console → Project Settings',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'Da Firebase Console → Project Settings',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'Da Firebase Console → Project Settings',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'Da Firebase Console → Project Settings',
  
  // Twilio WhatsApp (Backend)
  TWILIO_WHATSAPP_NUMBER: 'Numero WhatsApp Twilio (es: whatsapp:+14155238886)',
  
  // Sentry (opzionale)
  NEXT_PUBLIC_SENTRY_DSN: 'Da Sentry Dashboard',
};

console.log('🔍 Verifica Environment Variables\n');

let missing = [];
let present = [];
let warnings = [];

// Check required vars
for (const [varName, help] of Object.entries(requiredVars)) {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    missing.push({ name: varName, help });
  } else {
    present.push(varName);
    // Check for placeholder values
    if (value.includes('your_') || value.includes('xxx') || value === 'placeholder') {
      warnings.push({ name: varName, issue: 'Valore placeholder rilevato' });
    }
  }
}

// Check optional vars
const optionalPresent = [];
for (const [varName, help] of Object.entries(optionalVars)) {
  const value = process.env[varName];
  if (value && value.trim() !== '') {
    optionalPresent.push(varName);
  }
}

// Output results
if (present.length > 0) {
  console.log('✅ Variabili configurate:');
  present.forEach(name => {
    const value = process.env[name];
    const masked = name.includes('SECRET') || name.includes('KEY') || name.includes('TOKEN')
      ? value.substring(0, 8) + '...' + value.substring(value.length - 4)
      : value;
    console.log(`   ${name}: ${masked}`);
  });
  console.log('');
}

if (warnings.length > 0) {
  console.log('⚠️  Avvisi:');
  warnings.forEach(({ name, issue }) => {
    console.log(`   ${name}: ${issue}`);
  });
  console.log('');
}

if (missing.length > 0) {
  console.log('❌ Variabili mancanti:');
  missing.forEach(({ name, help }) => {
    console.log(`   ${name}`);
    console.log(`      → ${help}`);
  });
  console.log('');
  
  console.log('📝 Per configurare:');
  console.log('   1. Vercel: Dashboard → Project → Settings → Environment Variables');
  console.log('   2. Locale: Crea .env.local nella cartella dashboard/');
  console.log('');
  
  process.exit(1);
} else {
  console.log('✅ Tutte le variabili richieste sono configurate!');
  
  if (optionalPresent.length > 0) {
    console.log(`\n📌 Variabili opzionali configurate: ${optionalPresent.length}`);
  }
  
  console.log('\n🚀 Pronto per il deploy!');
  process.exit(0);
}

