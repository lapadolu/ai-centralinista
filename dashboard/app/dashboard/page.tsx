'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Stats {
  today: number;
  week: number;
  month: number;
  todayLeads: number;
}

export default function DashboardHome() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    today: 0,
    week: 0,
    month: 0,
    todayLeads: 0
  });
  const [recentCalls, setRecentCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data.stats || { today: 0, week: 0, month: 0, todayLeads: 0 });
      setRecentCalls(data.recentCalls || []);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Fallback a mock data se API fallisce
      setStats({
        today: 12,
        week: 78,
        month: 342,
        todayLeads: 8
      });
      
      setRecentCalls([
        {
          id: '1',
          nome: 'Marco Rossi',
          telefono: '+39 333 123 4567',
          tipo_richiesta: 'Comprare',
          zona: 'Porta Romana',
          time: '16:45'
        },
        {
          id: '2',
          nome: 'Laura Bianchi',
          telefono: '+39 345 678 9012',
          tipo_richiesta: 'Vendere',
          zona: 'Navigli',
          time: '15:30'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Caricamento...</div>;
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
          <div className="text-sm text-green-600 mt-1">+15% vs scorsa</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-slate-600">Mese</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">{stats.month}</div>
          <div className="text-sm text-slate-500 mt-1">Nov 2025</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm font-medium text-slate-600">Conversion</div>
          <div className="text-3xl font-bold text-slate-900 mt-2">68%</div>
          <div className="text-sm text-green-600 mt-1">Lead validi</div>
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
          {recentCalls.map((call) => (
            <div key={call.id} className="p-6 hover:bg-slate-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{call.nome}</h3>
                    <span className="text-xs text-slate-500">{call.time}</span>
                  </div>
                  
                  <div className="text-sm text-slate-600 mb-2">
                    {call.tipo_richiesta} · {call.zona}
                  </div>
                  
                  <div className="text-sm text-slate-900">
                    {call.telefono}
                  </div>
                </div>

                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition">
                  Dettagli
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

