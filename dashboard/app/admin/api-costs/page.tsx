'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Phone, MessageCircle, Database, Cloud } from 'lucide-react';

interface ApiCosts {
  period: {
    month: number;
    year: number;
    start: string;
    end: string;
  };
  usage: {
    totalCalls: number;
    totalMinutes: number;
    whatsappMessages: number;
    activeTwilioNumbers: number;
    firestoreReads: number;
    firestoreWrites: number;
    gcpInvocations: number;
  };
  costs: {
    vapi: { amount: number; currency: string; description: string; perMinute: number };
    twilioWhatsApp: { amount: number; currency: string; description: string; perMessage: number };
    twilioNumbers: { amount: number; currency: string; description: string; perNumber: number };
    openai: { amount: number; currency: string; description: string; perMinute: number };
    elevenlabs: { amount: number; currency: string; description: string; perMinute: number };
    firestore: { amount: number; currency: string; description: string; reads: number; writes: number };
    gcp: { amount: number; currency: string; description: string; perMillion: number };
    total: { amount: number; currency: string };
  };
  revenue: {
    thisMonth: number;
    recurring: number;
    profit: number;
    margin: string;
  };
}

export default function ApiCostsPage() {
  const [costs, setCosts] = useState<ApiCosts | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    loadCosts();
  }, [selectedMonth, selectedYear]);

  const loadCosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.append('month', selectedMonth);
      if (selectedYear) params.append('year', selectedYear);
      
      const response = await fetch(`/api/admin/api-costs?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setCosts(data);
      }
    } catch (error) {
      console.error('Error loading costs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 
                    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Caricamento...</div>
      </div>
    );
  }

  if (!costs) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Torna alla dashboard
          </Link>
          <div className="text-center py-12">
            <p className="text-slate-600">Errore nel caricamento dei dati</p>
          </div>
        </div>
      </div>
    );
  }

  const costItems = [
    { key: 'vapi', icon: Phone, label: 'Vapi.ai', color: 'text-blue-600' },
    { key: 'twilioWhatsApp', icon: MessageCircle, label: 'Twilio WhatsApp', color: 'text-green-600' },
    { key: 'twilioNumbers', icon: Phone, label: 'Twilio Numbers', color: 'text-green-600' },
    { key: 'openai', icon: Database, label: 'OpenAI', color: 'text-purple-600' },
    { key: 'elevenlabs', icon: Cloud, label: '11Labs', color: 'text-orange-600' },
    { key: 'firestore', icon: Database, label: 'Firestore', color: 'text-yellow-600' },
    { key: 'gcp', icon: Cloud, label: 'GCP Functions', color: 'text-red-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Torna alla dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Costi API e Utilizzo
          </h1>
          <p className="text-slate-600">
            Monitoraggio costi e utilizzo dei servizi esterni per {getMonthName(costs.period.month)} {costs.period.year}
          </p>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-2">Revenue Ricorrente</div>
            <div className="text-3xl font-semibold text-slate-900">€{costs.revenue.recurring}</div>
            <div className="text-xs text-slate-500 mt-1">/mese</div>
          </div>
          <div className="border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-2">Costi Totali API</div>
            <div className="text-3xl font-semibold text-red-600">${costs.costs.total.amount}</div>
            <div className="text-xs text-slate-500 mt-1">USD/mese</div>
          </div>
          <div className="border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-2">Profitto</div>
            <div className={`text-3xl font-semibold ${costs.revenue.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{costs.revenue.profit.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">/mese</div>
          </div>
          <div className="border border-slate-200 p-6">
            <div className="text-sm text-slate-600 mb-2">Margine</div>
            <div className={`text-3xl font-semibold ${parseFloat(costs.revenue.margin) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {costs.revenue.margin}%
            </div>
            <div className="text-xs text-slate-500 mt-1">di margine</div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Utilizzo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-slate-200 p-4">
              <div className="text-sm text-slate-600">Chiamate Totali</div>
              <div className="text-2xl font-semibold text-slate-900 mt-1">{costs.usage.totalCalls}</div>
            </div>
            <div className="border border-slate-200 p-4">
              <div className="text-sm text-slate-600">Minuti Totali</div>
              <div className="text-2xl font-semibold text-slate-900 mt-1">{costs.usage.totalMinutes}</div>
            </div>
            <div className="border border-slate-200 p-4">
              <div className="text-sm text-slate-600">Messaggi WhatsApp</div>
              <div className="text-2xl font-semibold text-slate-900 mt-1">{costs.usage.whatsappMessages}</div>
            </div>
            <div className="border border-slate-200 p-4">
              <div className="text-sm text-slate-600">Numeri Twilio Attivi</div>
              <div className="text-2xl font-semibold text-slate-900 mt-1">{costs.usage.activeTwilioNumbers}</div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Dettaglio Costi
          </h2>
          <div className="space-y-4">
            {costItems.map((item) => {
              const cost = costs.costs[item.key as keyof typeof costs.costs] as any;
              const Icon = item.icon;
              const percentage = (cost.amount / costs.costs.total.amount) * 100;
              
              return (
                <div key={item.key} className="border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                      <div>
                        <div className="font-semibold text-slate-900">{item.label}</div>
                        <div className="text-sm text-slate-600">{cost.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-slate-900">${cost.amount.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{percentage.toFixed(1)}% del totale</div>
                    </div>
                  </div>
                  {cost.perMinute && (
                    <div className="text-xs text-slate-500">
                      ${cost.perMinute.toFixed(4)} per minuto
                    </div>
                  )}
                  {cost.perMessage && (
                    <div className="text-xs text-slate-500">
                      ${cost.perMessage.toFixed(4)} per messaggio
                    </div>
                  )}
                  {cost.perNumber && (
                    <div className="text-xs text-slate-500">
                      ${cost.perNumber.toFixed(2)} per numero/mese
                    </div>
                  )}
                  {cost.reads !== undefined && (
                    <div className="text-xs text-slate-500">
                      Reads: ${cost.reads.toFixed(4)} | Writes: ${cost.writes.toFixed(4)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Cost */}
        <div className="border-2 border-slate-900 p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 mb-2">Costo Totale Mensile</div>
              <div className="text-4xl font-semibold text-slate-900">${costs.costs.total.amount.toFixed(2)}</div>
              <div className="text-sm text-slate-500 mt-2">USD</div>
            </div>
            <DollarSign className="w-12 h-12 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

