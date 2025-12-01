import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/admin/create-admin
 * Crea account admin (solo se non esiste già un admin)
 * 
 * Body: { email: string, password: string, name: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password e name sono obbligatori' },
        { status: 400 }
      );
    }

    // Verifica formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    // Verifica password (min 8 caratteri)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password deve essere di almeno 8 caratteri' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user to admin
      const hashedPassword = await bcrypt.hash(password, 12);
      await userRef.update({
        role: 'admin',
        password_hash: hashedPassword,
        name: name,
        updated_at: Timestamp.now(),
      });
      
      return NextResponse.json({
        success: true,
        message: 'Utente esistente aggiornato a admin',
        email,
        role: 'admin',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    await userRef.set({
      email,
      name,
      password_hash: hashedPassword,
      role: 'admin',
      subscription_status: 'active', // Admin non ha limiti
      subscription_plan: null,
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
      message: 'Account admin creato con successo',
      email,
      name,
      role: 'admin',
      next_steps: [
        '1. Vai a https://www.helping-hand.it/login',
        '2. Accedi con email e password',
        '3. Vedrai il link "Admin" nella dashboard',
        '4. Clicca su "Admin" per accedere alla dashboard admin',
      ],
    });

  } catch (error: any) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione dell\'account admin', details: error.message },
      { status: 500 }
    );
  }
}

