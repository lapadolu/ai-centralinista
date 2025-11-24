'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      // Prima controlla se ha un ordine
      const orderResponse = await fetch('/api/orders/current');
      const orderData = await orderResponse.json();
      
      if (orderResponse.ok && orderData.order) {
        setHasOrder(true);
        // Se ha ordine, carica i dati della dashboard
        await loadData();
      } else {
        // Se non ha ordine, mostra onboarding
        setHasOrder(false);
        router.push('/dashboard/onboarding');
        return;
      }
    } catch (error) {
      console.error('Error checking order:', error);
      // In caso di errore, prova comunque a caricare dati
      await loadData();
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
      setStats({
        today: 0,
        week: 0,
        month: 0,
        todayLeads: 0
      });
      setRecentCalls([]);
    }
  };

  if (checkingOrder || loading) {
    return <div className="text-center py-12">Caricamento...</div>;
  }

  // Se non ha ordine, non mostrare nulla (redirect in corso)
  if (!hasOrder) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Benvenuto, {session?.user?.name || 'Agente'}
        </h1>
        <p className="text-slate-600 mt-1">
          Dashboard chiamate AI Centralinista
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-slate-600">Oggi</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.today}</div>
          <div className="text-sm text-slate-500 mt-1">{stats.todayLeads} lead validi</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-slate-600">Settimana</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.week}</div>
          <div className="text-sm text-slate-500 mt-1">chiamate</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-slate-600">Mese</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.month}</div>
          <div className="text-sm text-slate-500 mt-1">chiamate</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-slate-600">Lead Totali</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.month}</div>
          <div className="text-sm text-slate-500 mt-1">questo mese</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/leads"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 transition group"
        >
          <div className="text-lg font-semibold">Gestisci Lead</div>
          <div className="text-blue-100 mt-1 text-sm">
            CRM completo con pipeline
          </div>
        </Link>

        <Link
          href="/dashboard/zones"
          className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 transition group"
        >
          <div className="text-lg font-semibold">Mappa Zone</div>
          <div className="text-green-100 mt-1 text-sm">
            Assegna zone ai tuoi agenti
          </div>
        </Link>

        <Link
          href="/dashboard/analytics"
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 transition group"
        >
          <div className="text-lg font-semibold">Analytics</div>
          <div className="text-purple-100 mt-1 text-sm">
            Insights e statistiche
          </div>
        </Link>
      </div>

      {/* Additional Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/calls"
          className="bg-slate-600 hover:bg-slate-700 text-white rounded-lg p-6 transition group"
        >
          <div className="text-lg font-semibold">Registro Chiamate</div>
          <div className="text-slate-100 mt-1 text-sm">
            Visualizza tutte le chiamate ricevute
          </div>
        </Link>
      </div>

      {/* Recent Calls */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">
              Ultime Chiamate
            </h2>
            <Link
              href="/dashboard/leads"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Vedi tutte →
            </Link>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {recentCalls.length > 0 ? (
            recentCalls.map((call) => (
              <div key={call.id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{call.nome || 'Cliente'}</h3>
                      <span className="text-xs text-slate-500">{call.timestamp || 'Data non disponibile'}</span>
                    </div>
                    
                    <div className="text-sm text-slate-600 mb-2">
                      {call.zona || 'Zona non specificata'}
                    </div>
                    
                    <div className="text-sm text-slate-900">
                      {call.telefono || 'Telefono non disponibile'}
                    </div>
                  </div>

                  <Link
                    href="/dashboard/leads"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
                  >
                    Dettagli
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500">
              <p className="mb-4">Nessuna chiamata ancora</p>
              <p className="text-sm">Le chiamate ricevute appariranno qui automaticamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

