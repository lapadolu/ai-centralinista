/**
 * Script per creare user admin
 * 
 * Usage:
 * node scripts/create-admin-user.js admin@email.com "Admin Name" "password123"
 */

const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');
const readline = require('readline');

// Initialize Firebase Admin
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  : require('../dashboard/service-account.json'); // Fallback per local

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'ai-centralinista-2025',
  });
}

const db = admin.firestore();

async function createAdminUser(email, name, password) {
  try {
    // Check if user already exists
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      console.log(`❌ User ${email} already exists!`);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin user
    await userRef.set({
      email,
      name,
      password_hash: passwordHash,
      role: 'admin',
      subscription_status: 'active',
      subscription_plan: null,
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

    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name}`);
    console.log(`   Role: admin`);
    console.log(`\n   You can now login at: https://www.helping-hand.it/login`);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// CLI
const args = process.argv.slice(2);
const [email, name, password] = args;

if (!email || !name || !password) {
  console.log('Usage: node scripts/create-admin-user.js <email> <name> <password>');
  console.log('Example: node scripts/create-admin-user.js admin@example.com "Admin Name" "SecurePassword123!"');
  process.exit(1);
}

createAdminUser(email, name, password).then(() => process.exit(0));

