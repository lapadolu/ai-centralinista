'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { PRICING_PLANS, PricingPlan } from '@/lib/pricing';
import { Check, Loader2 } from 'lucide-react';
import { CheckoutConfigForm, CheckoutConfig } from '@/components/CheckoutConfigForm';

export default function BillingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise' | null>(null);
  const [showConfigForm, setShowConfigForm] = useState(false);

  useEffect(() => {
    loadUserPlan();
  }, []);

  const loadUserPlan = async () => {
    try {
      const response = await fetch('/api/orders/current');
      if (response.ok) {
        const data = await response.json();
        if (data.order?.subscription_plan) {
          setUserPlan(data.order.subscription_plan);
        }
      }
    } catch (error) {
      console.error('Error loading user plan:', error);
    }
  };

  const handlePlanSelect = (planId: 'starter' | 'pro' | 'enterprise') => {
    setSelectedPlan(planId);
    setShowConfigForm(true);
  };

  const handleConfigSubmit = async (config: CheckoutConfig) => {
    if (!selectedPlan) return;
    
    setLoading(true);
    setShowConfigForm(false);
    
    try {
      const response = await fetch('/api/billing/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan,
          config: config, // Passa tutta la configurazione
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert(`Errore: ${data.error || 'Impossibile creare checkout'}`);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Errore: ${error.message}`);
      setLoading(false);
    }
  };

  const plans = Object.values(PRICING_PLANS);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Abbonamenti
        </h1>
        <p className="text-slate-600">
          Scegli il piano che fa per te. Puoi cambiare o cancellare in qualsiasi momento.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const isCurrentPlan = userPlan === plan.id;
          const isPopular = plan.id === 'pro';

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 ${
                isPopular
                  ? 'border-red-600 shadow-lg'
                  : isCurrentPlan
                  ? 'border-blue-600'
                  : 'border-slate-200'
              } p-8 flex flex-col`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Più Popolare
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Attivo
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {plan.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-slate-900">
                      €{plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600">/mese</span>
                  </div>
                  {plan.setupFee > 0 && (
                    <p className="text-sm text-slate-500 mt-1">
                      + €{plan.setupFee} setup iniziale
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-grow mb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-200">
                <div className="mb-4 text-sm text-slate-600">
                  <div className="font-semibold text-slate-900 mb-1">
                    Limite chiamate: {plan.monthlyCallLimit.toLocaleString()}/mese
                  </div>
                  {plan.monthlyCallLimit > 0 && (
                    <div>
                      Oltre il limite: €{plan.overagePricePerCall}/chiamata
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loading || isCurrentPlan}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                    isCurrentPlan
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : isPopular
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Caricamento...
                    </span>
                  ) : isCurrentPlan ? (
                    'Piano Attivo'
                  ) : (
                    'Scegli Piano'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-2">
          Come funziona?
        </h3>
        <ul className="space-y-2 text-sm text-slate-600">
          <li>
            • <strong>Setup iniziale:</strong> Pagamento unico per configurare il tuo account
          </li>
          <li>
            • <strong>Abbonamento mensile:</strong> Rinnovo automatico ogni mese
          </li>
          <li>
            • <strong>Oltre il limite:</strong> Chiamate extra addebitate automaticamente
          </li>
          <li>
            • <strong>Modifica o cancella:</strong> In qualsiasi momento dal tuo account
          </li>
        </ul>
      </div>

      {/* Config Form Modal */}
      {showConfigForm && selectedPlan && (
        <CheckoutConfigForm
          planId={selectedPlan}
          onClose={() => {
            setShowConfigForm(false);
            setSelectedPlan(null);
          }}
          onProceed={handleConfigSubmit}
        />
      )}
    </div>
  );
}

