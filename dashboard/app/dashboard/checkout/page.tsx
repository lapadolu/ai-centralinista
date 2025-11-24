'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const planId = searchParams.get('planId') || 'starter';
    createCheckout(planId);
  }, []);

  const createCheckout = async (planId: string) => {
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Errore durante la creazione del checkout');
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('URL checkout non disponibile');
        setLoading(false);
      }
    } catch (err: any) {
      setError('Errore di connessione. Riprova più tardi.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Preparazione checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Errore</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard/onboarding')}
            className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition"
          >
            Torna Indietro
          </button>
        </div>
      </div>
    );
  }

  return null;
}

