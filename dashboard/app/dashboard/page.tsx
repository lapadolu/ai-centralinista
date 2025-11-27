'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Phone, FileText, MapPin, BarChart3, ArrowRight, Zap } from 'lucide-react';

interface Stats {
  today: number;
  week: number;
  month: number;
  todayLeads: number;
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
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
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

  if (checkingOrder || loading) {
    return (
      <div className="text-center py-12">
        <div className="text-brick-accent animate-pulse">Caricamento...</div>
      </div>
    );
  }

  if (!hasOrder) {
    return (
      <div className="space-y-6">
        <div className="brick-card rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-semibold text-white mb-4 brick-gradient-text">
            Attiva il tuo Centralino AI
          </h2>
          <p className="text-sand/70 mb-8 max-w-2xl mx-auto text-lg">
            Scegli un piano per iniziare a ricevere chiamate e gestire i tuoi lead automaticamente.
          </p>
          <Link
            href="/dashboard/onboarding"
            className="inline-flex items-center gap-2 brick-gradient text-white px-8 py-4 rounded-full font-semibold transition-subtle shadow-brick"
          >
            Vedi Piani Disponibili
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white mb-3 brick-gradient-text">
          Benvenuto, {session?.user?.name || 'Agente'}
        </h1>
        <p className="text-sand/60 text-lg">
          Dashboard chiamate AI Centralinista
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="brick-card rounded-xl p-6">
          <div className="text-xs font-semibold text-sand/50 uppercase tracking-wider mb-3">Oggi</div>
          <div className="text-4xl font-semibold text-white mb-2 brick-gradient-text">{stats.today}</div>
          <div className="text-sm text-sand/50">{stats.todayLeads} lead validi</div>
        </div>

        <div className="brick-card rounded-xl p-6">
          <div className="text-xs font-semibold text-sand/50 uppercase tracking-wider mb-3">Settimana</div>
          <div className="text-4xl font-semibold text-white mb-2">{stats.week}</div>
          <div className="text-sm text-sand/50">chiamate</div>
        </div>

        <div className="brick-card rounded-xl p-6">
          <div className="text-xs font-semibold text-sand/50 uppercase tracking-wider mb-3">Mese</div>
          <div className="text-4xl font-semibold text-white mb-2">{stats.month}</div>
          <div className="text-sm text-sand/50">chiamate</div>
        </div>

        <div className="brick-card rounded-xl p-6">
          <div className="text-xs font-semibold text-sand/50 uppercase tracking-wider mb-3">Lead Totali</div>
          <div className="text-4xl font-semibold text-white mb-2">{stats.month}</div>
          <div className="text-sm text-sand/50">questo mese</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/leads"
          className="group brick-card rounded-xl p-6 transition-subtle brick-card-hover"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-brick-accent/20 flex items-center justify-center border border-brick-accent/30">
              <FileText className="w-6 h-6 text-brick-accentLight" />
            </div>
            <div className="text-lg font-semibold text-white">Gestisci Lead</div>
          </div>
          <div className="text-sand/60 text-sm">
            CRM completo con pipeline
          </div>
        </Link>

        <Link
          href="/dashboard/zones"
          className="group brick-card rounded-xl p-6 transition-subtle brick-card-hover"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-brick-accent/20 flex items-center justify-center border border-brick-accent/30">
              <MapPin className="w-6 h-6 text-brick-accentLight" />
            </div>
            <div className="text-lg font-semibold text-white">Mappa Zone</div>
          </div>
          <div className="text-sand/60 text-sm">
            Assegna zone ai tuoi agenti
          </div>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="group brick-card rounded-xl p-6 transition-subtle brick-card-hover"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-brick-accent/20 flex items-center justify-center border border-brick-accent/30">
              <BarChart3 className="w-6 h-6 text-brick-accentLight" />
            </div>
            <div className="text-lg font-semibold text-white">Analytics</div>
          </div>
          <div className="text-sand/60 text-sm">
            Insights e statistiche
          </div>
        </Link>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/calls"
          className="group brick-card rounded-xl p-6 transition-subtle brick-card-hover"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-brick-accent/20 flex items-center justify-center border border-brick-accent/30">
              <Phone className="w-6 h-6 text-brick-accentLight" />
            </div>
            <div className="text-lg font-semibold text-white">Registro Chiamate</div>
          </div>
          <div className="text-sand/60 text-sm">
            Visualizza tutte le chiamate ricevute
          </div>
        </Link>
      </div>

      {/* Recent Calls */}
      <div className="brick-card rounded-xl">
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Ultime Chiamate
            </h2>
            <Link
              href="/dashboard/leads"
              className="text-sm text-brick-accentLight hover:text-brick-accent font-semibold transition-subtle"
            >
              Vedi tutte →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {recentCalls.length > 0 ? (
            recentCalls.map((call) => (
              <div key={call.id} className="p-6 hover:bg-white/5 transition-subtle">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="font-semibold text-white">{call.nome || 'Cliente'}</h3>
                      <span className="text-xs text-sand/40">{call.timestamp || 'Data non disponibile'}</span>
                    </div>
                    
                    <div className="text-sm text-sand/60 mb-2">
                      {call.zona || 'Zona non specificata'}
                    </div>
                    
                    <div className="text-sm text-sand/70 font-medium">
                      {call.telefono || 'Telefono non disponibile'}
                    </div>
                  </div>

                  <Link
                    href="/dashboard/leads"
                    className="px-5 py-2 bg-brick-accent/20 border border-brick-accent/30 text-brick-accentLight text-sm rounded-full transition-subtle hover:bg-brick-accent/30 hover:border-brick-accent/50 font-semibold whitespace-nowrap"
                  >
                    Dettagli
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-sand/50">
              <p className="mb-2 text-lg">Nessuna chiamata ancora</p>
              <p className="text-sm text-sand/40">Le chiamate ricevute appariranno qui automaticamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
