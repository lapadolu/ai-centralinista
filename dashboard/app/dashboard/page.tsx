'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, FileText, MapPin, BarChart3, ArrowRight, Clock, TrendingUp, Users, Calendar, Activity } from 'lucide-react';

interface Stats {
  today: number;
  week: number;
  month: number;
  todayLeads: number;
}

interface Call {
  id: string;
  nome?: string;
  telefono?: string;
  zona?: string;
  timestamp?: string;
  tipo_richiesta?: string;
  tipo_immobile?: string;
  budget?: string;
  duration?: number;
}

export default function DashboardHome() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    today: 0,
    week: 0,
    month: 0,
    todayLeads: 0
  });
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasOrder, setHasOrder] = useState(false);
  const [checkingOrder, setCheckingOrder] = useState(true);

  useEffect(() => {
    checkOrderAndLoadData();
  }, []);

  const checkOrderAndLoadData = async () => {
    try {
      await loadData();
      
      const orderResponse = await fetch('/api/orders/current');
      const orderData = await orderResponse.json();
      
      const trialResponse = await fetch('/api/billing/check-trial');
      const trialData = trialResponse.ok ? await trialResponse.json() : null;
      
      const hasActiveOrder = orderResponse.ok && orderData.order;
      const hasActiveSubscription = trialData && (
        trialData.subscription_status === 'active' || 
        (trialData.is_trial && !trialData.is_expired)
      );
      
      if (hasActiveOrder || hasActiveSubscription || stats.month > 0 || recentCalls.length > 0) {
        setHasOrder(true);
      } else {
        setHasOrder(false);
      }
    } catch (error) {
      console.error('Error checking order:', error);
      setHasOrder(true);
    } finally {
      setCheckingOrder(false);
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats || { today: 0, week: 0, month: 0, todayLeads: 0 });
      setRecentCalls(data.recentCalls || []);
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({ today: 0, week: 0, month: 0, todayLeads: 0 });
      setRecentCalls([]);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data non disponibile';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('it-IT', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  if (checkingOrder || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-brick-accent animate-pulse">Caricamento...</div>
      </div>
    );
  }

  if (!hasOrder) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-cream-dark">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Attiva il tuo Centralino AI
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
              Scegli un piano per iniziare a ricevere chiamate e gestire i tuoi lead automaticamente.
            </p>
            <Link
              href="/dashboard/onboarding"
              className="inline-flex items-center gap-2 bg-brick-accent hover:bg-brick-accentDark text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Vedi Piani Disponibili
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Benvenuto, {session?.user?.name || 'Agente'}
          </h1>
          <p className="text-slate-600 text-lg">
            Panoramica completa del tuo centralino AI
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Oggi</div>
              <Phone className="w-5 h-5 text-brick-accent" />
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">{stats.today}</div>
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-brick-accent">{stats.todayLeads}</span> lead validi
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Settimana</div>
              <Calendar className="w-5 h-5 text-brick-accent" />
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">{stats.week}</div>
            <div className="text-sm text-slate-600">chiamate totali</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Mese</div>
              <TrendingUp className="w-5 h-5 text-brick-accent" />
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">{stats.month}</div>
            <div className="text-sm text-slate-600">chiamate questo mese</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-cream-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Lead Totali</div>
              <Users className="w-5 h-5 text-brick-accent" />
            </div>
            <div className="text-4xl font-bold text-slate-900 mb-2">{stats.month}</div>
            <div className="text-sm text-slate-600">lead generati</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/dashboard/leads"
            className="group bg-white rounded-xl shadow-sm border border-cream-dark p-6 hover:shadow-md hover:border-brick-accent/30 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-brick-accent/10 flex items-center justify-center border border-brick-accent/20">
                <FileText className="w-6 h-6 text-brick-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Gestisci Lead</div>
                <div className="text-sm text-slate-500">CRM completo</div>
              </div>
            </div>
            <div className="text-slate-600 text-sm">
              Visualizza e gestisci tutti i tuoi lead qualificati con pipeline completa
            </div>
          </Link>

          <Link
            href="/dashboard/zones"
            className="group bg-white rounded-xl shadow-sm border border-cream-dark p-6 hover:shadow-md hover:border-brick-accent/30 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-brick-accent/10 flex items-center justify-center border border-brick-accent/20">
                <MapPin className="w-6 h-6 text-brick-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Mappa Zone</div>
                <div className="text-sm text-slate-500">Routing intelligente</div>
              </div>
            </div>
            <div className="text-slate-600 text-sm">
              Assegna zone geografiche ai tuoi agenti per routing automatico
            </div>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="group bg-white rounded-xl shadow-sm border border-cream-dark p-6 hover:shadow-md hover:border-brick-accent/30 transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-brick-accent/10 flex items-center justify-center border border-brick-accent/20">
                <BarChart3 className="w-6 h-6 text-brick-accent" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">Analytics</div>
                <div className="text-sm text-slate-500">Insights dettagliati</div>
              </div>
            </div>
            <div className="text-slate-600 text-sm">
              Analisi approfondite su conversioni, zone, budget e performance
            </div>
          </Link>
        </div>

        {/* Recent Calls - Detailed */}
        <div className="bg-white rounded-xl shadow-sm border border-cream-dark">
          <div className="p-6 border-b border-cream-dark">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Ultime Chiamate
                </h2>
                <p className="text-sm text-slate-500">Chiamate ricevute e processate dal centralino AI</p>
              </div>
              <Link
                href="/dashboard/calls"
                className="text-sm font-semibold text-brick-accent hover:text-brick-accentDark transition-colors"
              >
                Vedi tutte →
              </Link>
            </div>
          </div>

          <div className="divide-y divide-cream-dark">
            {recentCalls.length > 0 ? (
              recentCalls.map((call) => (
                <div key={call.id} className="p-6 hover:bg-cream-warm/50 transition-colors">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {call.nome || 'Cliente non identificato'}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(call.timestamp)}
                            </span>
                            {call.duration && (
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {formatDuration(call.duration)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {call.telefono && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide min-w-[80px]">Telefono:</span>
                            <span className="text-sm text-slate-900 font-medium">{call.telefono}</span>
                          </div>
                        )}
                        {call.zona && call.zona !== 'Non specificato' && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide min-w-[80px]">Zona:</span>
                            <span className="text-sm text-slate-900">{call.zona}</span>
                          </div>
                        )}
                        {call.tipo_richiesta && call.tipo_richiesta !== 'Non specificato' && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide min-w-[80px]">Richiesta:</span>
                            <span className="text-sm text-slate-900 capitalize">{call.tipo_richiesta}</span>
                          </div>
                        )}
                        {call.tipo_immobile && call.tipo_immobile !== 'Non specificato' && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide min-w-[80px]">Immobile:</span>
                            <span className="text-sm text-slate-900">{call.tipo_immobile}</span>
                          </div>
                        )}
                        {call.budget && call.budget !== 'Non specificato' && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide min-w-[80px]">Budget:</span>
                            <span className="text-sm text-slate-900 font-semibold text-brick-accent">{call.budget}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/dashboard/leads"
                      className="px-5 py-2.5 bg-brick-accent/10 border border-brick-accent/20 text-brick-accent text-sm rounded-lg transition-all hover:bg-brick-accent/20 hover:border-brick-accent/30 font-semibold whitespace-nowrap"
                    >
                      Dettagli
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Phone className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-600 mb-2">Nessuna chiamata ancora</p>
                <p className="text-sm text-slate-500">Le chiamate ricevute appariranno qui automaticamente</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Quick Links */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/calls"
            className="group bg-white rounded-xl shadow-sm border border-cream-dark p-6 hover:shadow-md hover:border-brick-accent/30 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brick-accent/10 flex items-center justify-center border border-brick-accent/20">
                <Phone className="w-5 h-5 text-brick-accent" />
              </div>
              <div className="text-lg font-semibold text-slate-900">Registro Chiamate</div>
            </div>
            <div className="text-slate-600 text-sm">
              Visualizza tutte le chiamate ricevute con trascrizioni complete e dettagli
            </div>
          </Link>

          <Link
            href="/dashboard/billing"
            className="group bg-white rounded-xl shadow-sm border border-cream-dark p-6 hover:shadow-md hover:border-brick-accent/30 transition-all"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 rounded-lg bg-brick-accent/10 flex items-center justify-center border border-brick-accent/20">
                <BarChart3 className="w-5 h-5 text-brick-accent" />
              </div>
              <div className="text-lg font-semibold text-slate-900">Abbonamenti</div>
            </div>
            <div className="text-slate-600 text-sm">
              Gestisci il tuo piano di abbonamento e visualizza fatturazione
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
