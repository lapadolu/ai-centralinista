import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { signupApiSchema } from '@/lib/validation';
import { z } from 'zod';

/**
 * POST /api/auth/signup
 * Crea un nuovo account utente con validazione Zod e trial enforcement
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with Zod
    let validatedData;
    try {
      validatedData = signupApiSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return NextResponse.json(
          { error: firstError.message, details: error.issues },
          { status: 400 }
        );
      }
      throw error;
    }

    const { name, email, password } = validatedData;

    // Check if user already exists
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return NextResponse.json(
        { error: 'Un account con questa email esiste già' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12); // Increased rounds for better security

    // Calculate trial end date (30 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    // Create user
    await userRef.set({
      email,
      name,
      password_hash: hashedPassword, // FIX: NextAuth cerca password_hash, non password
      role: 'client',
      subscription_status: 'trial',
      subscription_plan: null,
      trial_ends_at: trialEndsAt, // Trial enforcement
      monthly_calls: 0,
      monthly_calls_limit: 0,
      total_calls: 0,
      current_month_start: new Date(),
      stripe_customer_id: null,
      stripe_subscription_id: null,
      billing_email: email,
      created_at: new Date(),
      zone_assignments: {},
      agents: [],
    });

    return NextResponse.json({
      success: true,
      message: 'Account creato con successo',
      trial_ends_at: trialEndsAt.toISOString(),
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Don't leak internal errors
    const errorMessage = error instanceof z.ZodError
      ? 'Dati non validi'
      : 'Errore durante la creazione dell\'account';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}


