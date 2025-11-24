#!/usr/bin/env node

/**
 * Script per generare hash password per admin user
 * Usa: node scripts/generate-password-hash.js "tua-password"
 */

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Errore: Fornisci una password come argomento');
  console.log('Uso: node scripts/generate-password-hash.js "tua-password"');
  process.exit(1);
}

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, 12);
    console.log('\n✅ Password hash generato:');
    console.log(hash);
    console.log('\n📝 Copia questo hash nel campo password_hash del documento user in Firestore');
    console.log('   Collection: users');
    console.log('   Document ID: tua-email@admin.com');
    console.log('   Fields: email, name, password_hash, role: "admin"');
    console.log('');
  } catch (error) {
    console.error('❌ Errore durante la generazione hash:', error);
    process.exit(1);
  }
}

generateHash();
