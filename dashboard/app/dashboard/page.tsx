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
        <div className="text-cyber-purple animate-pulse">Caricamento...</div>
      </div>
    );
  }

  if (!hasOrder) {
    return (
      <div className="space-y-6">
        <div className="bg-cyber-gray/50 border-2 border-cyber-purple rounded-lg p-8 text-center glow-border-lg backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-white mb-4 cyber-gradient-text glow-text">
            Attiva il tuo Centralino AI
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Scegli un piano per iniziare a ricevere chiamate e gestire i tuoi lead automaticamente.
          </p>
          <Link
            href="/dashboard/onboarding"
            className="inline-flex items-center gap-2 cyber-gradient text-white px-8 py-4 rounded-sm font-bold transition-all hover:shadow-cyber-lg"
          >
            Vedi Piani Disponibili
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="scroll-reveal">
        <h1 className="text-4xl font-black text-white mb-2 cyber-gradient-text glow-text">
          Benvenuto, {session?.user?.name || 'Agente'}
        </h1>
        <p className="text-gray-400 text-lg">
          Dashboard chiamate AI Centralinista
        </p>
      </div>

      {/* Stats Cards - Cyberpunk */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-6 backdrop-blur-sm glow-border-hover scroll-reveal">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Oggi</div>
          <div className="text-4xl font-black text-white mb-1 cyber-gradient-text">{stats.today}</div>
          <div className="text-sm text-gray-500">{stats.todayLeads} lead validi</div>
        </div>

        <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-6 backdrop-blur-sm glow-border-hover scroll-reveal">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Settimana</div>
          <div className="text-4xl font-black text-white mb-1">{stats.week}</div>
          <div className="text-sm text-gray-500">chiamate</div>
        </div>

        <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-6 backdrop-blur-sm glow-border-hover scroll-reveal">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Mese</div>
          <div className="text-4xl font-black text-white mb-1">{stats.month}</div>
          <div className="text-sm text-gray-500">chiamate</div>
        </div>

        <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-6 backdrop-blur-sm glow-border-hover scroll-reveal">
          <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Lead Totali</div>
          <div className="text-4xl font-black text-white mb-1">{stats.month}</div>
          <div className="text-sm text-gray-500">questo mese</div>
        </div>
      </div>

      {/* Quick Actions - Cyberpunk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/leads"
          className="group bg-cyber-gray/50 border border-cyber-purple/30 rounded-lg p-6 backdrop-blur-sm glow-border-hover transition-all hover:border-cyber-purple scroll-reveal"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/30">
              <FileText className="w-5 h-5 text-cyber-purple" />
            </div>
            <div className="text-lg font-bold text-white">Gestisci Lead</div>
          </div>
          <div className="text-gray-400 text-sm">
            CRM completo con pipeline
          </div>
        </Link>

        <Link
          href="/dashboard/zones"
          className="group bg-cyber-gray/50 border border-cyber-purple/30 rounded-lg p-6 backdrop-blur-sm glow-border-hover transition-all hover:border-cyber-purple scroll-reveal"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/30">
              <MapPin className="w-5 h-5 text-cyber-purple" />
            </div>
            <div className="text-lg font-bold text-white">Mappa Zone</div>
          </div>
          <div className="text-gray-400 text-sm">
            Assegna zone ai tuoi agenti
          </div>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="group bg-cyber-gray/50 border border-cyber-purple/30 rounded-lg p-6 backdrop-blur-sm glow-border-hover transition-all hover:border-cyber-purple scroll-reveal"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/30">
              <BarChart3 className="w-5 h-5 text-cyber-purple" />
            </div>
            <div className="text-lg font-bold text-white">Analytics</div>
          </div>
          <div className="text-gray-400 text-sm">
            Insights e statistiche
          </div>
        </Link>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/dashboard/calls"
          className="group bg-cyber-gray/50 border border-cyber-purple/30 rounded-lg p-6 backdrop-blur-sm glow-border-hover transition-all hover:border-cyber-purple scroll-reveal"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-purple/20 flex items-center justify-center border border-cyber-purple/30">
              <Phone className="w-5 h-5 text-cyber-purple" />
            </div>
            <div className="text-lg font-bold text-white">Registro Chiamate</div>
          </div>
          <div className="text-gray-400 text-sm">
            Visualizza tutte le chiamate ricevute
          </div>
        </Link>
      </div>

      {/* Recent Calls - Cyberpunk */}
      <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg backdrop-blur-sm glow-border scroll-reveal">
        <div className="p-6 border-b border-cyber-purple/20">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              Ultime Chiamate
            </h2>
            <Link
              href="/dashboard/leads"
              className="text-sm text-cyber-purple hover:text-cyber-pink font-semibold hover:glow-text transition-all"
            >
              Vedi tutte →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-cyber-purple/10">
          {recentCalls.length > 0 ? (
            recentCalls.map((call) => (
              <div key={call.id} className="p-6 hover:bg-cyber-purple/5 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-white">{call.nome || 'Cliente'}</h3>
                      <span className="text-xs text-gray-500">{call.timestamp || 'Data non disponibile'}</span>
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-2">
                      {call.zona || 'Zona non specificata'}
                    </div>
                    
                    <div className="text-sm text-gray-300 font-medium">
                      {call.telefono || 'Telefono non disponibile'}
                    </div>
                  </div>

                  <Link
                    href="/dashboard/leads"
                    className="px-4 py-2 bg-cyber-purple/20 border border-cyber-purple/50 text-cyber-purple text-sm rounded-sm transition-all hover:bg-cyber-purple/30 hover:glow-border font-semibold"
                  >
                    Dettagli
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p className="mb-4">Nessuna chiamata ancora</p>
              <p className="text-sm text-gray-600">Le chiamate ricevute appariranno qui automaticamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
