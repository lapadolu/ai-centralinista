import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/admin/create-federico
 * Crea utente Federico direttamente (bypass validazione password)
 */
export async function POST(request: NextRequest) {
  try {
    const email = 'federico@iconacasa.com';
    const password = 'federico2025';
    const name = 'Federico';

    // Check if user already exists
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update password if exists
      const hashedPassword = await bcrypt.hash(password, 12);
      await userRef.update({
        password_hash: hashedPassword,
      });
      return NextResponse.json({
        success: true,
        message: 'Password aggiornata per utente esistente',
        email,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Calculate trial end date (30 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

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

    return NextResponse.json({
      success: true,
      message: 'Utente Federico creato con successo',
      email,
      password,
      trial_ends_at: trialEndsAt.toISOString(),
    });

  } catch (error: any) {
    console.error('Error creating Federico:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione dell\'utente', details: error.message },
      { status: 500 }
    );
  }
}

