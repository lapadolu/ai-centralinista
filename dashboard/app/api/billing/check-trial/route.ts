import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/billing/check-trial
 * Verifica se il trial è scaduto e sospende l'account se necessario
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const userRef = db.collection('users').doc(session.user.email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    const subscriptionStatus = userData?.subscription_status;
    const trialEndsAt = userData?.trial_ends_at;

    // Se non è in trial, ritorna info subscription
    if (subscriptionStatus !== 'trial') {
      return NextResponse.json({
        is_trial: false,
        subscription_status: subscriptionStatus,
        subscription_plan: userData?.subscription_plan,
      });
    }

    // Verifica se trial scaduto
    const now = new Date();
    const trialEndDate = trialEndsAt?.toDate ? trialEndsAt.toDate() : new Date(trialEndsAt);
    
    const isTrialExpired = now > trialEndDate;
    const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // Se trial scaduto, sospendi account
    if (isTrialExpired) {
      await userRef.update({
        subscription_status: 'suspended',
        trial_ends_at: trialEndDate,
      });

      return NextResponse.json({
        is_trial: true,
        is_expired: true,
        days_remaining: 0,
        subscription_status: 'suspended',
        message: 'Il periodo di prova è scaduto. Attiva un abbonamento per continuare.',
      });
    }

    return NextResponse.json({
      is_trial: true,
      is_expired: false,
      days_remaining: daysRemaining,
      trial_ends_at: trialEndDate.toISOString(),
      subscription_status: 'trial',
    });

  } catch (error: any) {
    console.error('Error checking trial:', error);
    return NextResponse.json(
      { error: 'Errore durante la verifica del trial' },
      { status: 500 }
    );
  }
}

