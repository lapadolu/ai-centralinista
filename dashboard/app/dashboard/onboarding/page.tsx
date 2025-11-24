'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Phone, Zap, TrendingUp, CheckCircle2, ArrowRight, Clock, Users, BarChart3, MessageSquare, Shield } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/pricing';

export default function OnboardingPage() {
  const { data: session } = useSession();
  const [trialInfo, setTrialInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrialInfo();
  }, []);

  const loadTrialInfo = async () => {
    try {
      const response = await fetch('/api/billing/check-trial');
      if (response.ok) {
        const data = await response.json();
        setTrialInfo(data);
      }
    } catch (error) {
      console.error('Error loading trial info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Caricamento...</div>;
  }

  const daysRemaining = trialInfo?.days_remaining || 0;
  const isTrial = trialInfo?.is_trial === true;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-700 via-red-800 to-red-950 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Benvenuto in FIXER, {session?.user?.name || 'Agente'}!
          </h1>
          <p className="text-xl text-red-100 mb-6">
            Il tuo centralino AI intelligente è pronto per trasformare il modo in cui gestisci le chiamate
          </p>
          {isTrial && daysRemaining > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Periodo di prova: {daysRemaining} giorni rimanenti</span>
            </div>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Come Funziona
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-red-700" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">1. Chiamata Arriva</h3>
            <p className="text-sm text-slate-600">
              Il tuo centralino AI risponde in 2 secondi, 24/7, con voce naturale italiana
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-red-700" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">2. Raccolta Dati</h3>
            <p className="text-sm text-slate-600">
              L'AI raccoglie automaticamente nome, telefono, zona, budget e tutte le informazioni importanti
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-red-700" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">3. Notifica WhatsApp</h3>
            <p className="text-sm text-slate-600">
              Ricevi su WhatsApp tutti i dati del lead con suggerimenti intelligenti su cosa proporgli
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Vantaggi per il Tuo Business
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Clock, title: 'Disponibilità 24/7', desc: 'Non perdi mai una chiamata, anche di sera e nei weekend' },
            { icon: Zap, title: 'Risposta Istantanea', desc: 'L\'AI risponde in 2 secondi, i clienti non riattaccano' },
            { icon: BarChart3, title: 'Analytics Completi', desc: 'Dashboard con statistiche, conversioni e performance' },
            { icon: Users, title: 'Routing Intelligente', desc: 'Assegna lead agli agenti in base alla zona di interesse' },
            { icon: Shield, title: 'Zero Perdite', desc: 'Tutti i dati salvati automaticamente, nessun lead perso' },
            { icon: TrendingUp, title: 'Crescita Business', desc: 'Aumenta conversioni e gestisci più clienti senza stress' },
          ].map((benefit, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-slate-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-slate-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
          Cosa Include il Servizio
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Assistente AI con voce italiana naturale',
            'Raccolta automatica dati cliente (nome, telefono, zona, budget)',
            'Notifiche WhatsApp in tempo reale',
            'Dashboard CRM completo per gestione lead',
            'Routing intelligente per zone geografiche',
            'Analytics e statistiche dettagliate',
            'Registro chiamate completo',
            'Supporto tecnico dedicato',
            'Setup professionale incluso',
            'Nessun contratto a lungo termine',
          ].map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
          Scegli il Piano Perfetto
        </h2>
        <p className="text-center text-slate-600 mb-8">
          Tutti i piani includono setup professionale e supporto tecnico
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.values(PRICING_PLANS).map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border-2 p-6 ${
                plan.id === 'pro'
                  ? 'border-red-600 bg-red-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {plan.id === 'pro' && (
                <div className="text-center mb-4">
                  <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    PIÙ POPOLARE
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-slate-900">€{plan.monthlyPrice}</span>
                <span className="text-slate-600">/mese</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/api/billing/create-checkout?planId=${plan.id}`}
                className={`block w-full text-center py-3 px-4 rounded-lg font-semibold transition ${
                  plan.id === 'pro'
                    ? 'bg-red-700 hover:bg-red-800 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Scegli {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-red-800 to-red-950 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          Pronto a Trasformare il Tuo Business?
        </h2>
        <p className="text-red-100 mb-6 max-w-2xl mx-auto">
          Attiva il tuo centralino AI in 5 minuti. Setup professionale incluso, nessun impegno a lungo termine.
        </p>
        <Link
          href="/api/billing/create-checkout?planId=starter"
          className="inline-flex items-center gap-2 bg-white text-red-900 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition"
        >
          Attiva Ora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}

