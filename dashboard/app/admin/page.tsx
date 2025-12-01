'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ClientOverview {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'trial' | 'suspended';
  totalCalls: number;
  totalLeads: number;
  conversionRate: number;
  monthlyCost: number;
  lastCall?: string;
}

export default function AdminDashboard() {
  const [globalStats, setGlobalStats] = useState({
    totalClients: 0,
    activeClients: 0,
    trialClients: 0,
    totalCalls: 0,
    totalRevenue: 0,
    averageConversion: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setGlobalStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>FIXER Admin</h1>
              <div className="flex gap-4 text-sm">
                <Link href="/admin" className="text-slate-900 font-medium border-b-2 border-slate-900">Dashboard</Link>
                <Link href="/admin/setup" className="text-slate-600 hover:text-slate-900">Setup Ordini</Link>
                <Link href="/admin/clients" className="text-slate-600 hover:text-slate-900">Clienti</Link>
                <Link href="/admin/api-costs" className="text-slate-600 hover:text-slate-900">Costi API</Link>
                <Link href="/admin/system" className="text-slate-600 hover:text-slate-900">System Health</Link>
                <Link href="/admin/analytics" className="text-slate-600 hover:text-slate-900">Analytics</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">Admin</div>
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Esci</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-600">Caricamento...</div>
          </div>
        ) : (
          <>
            {/* Global Stats */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Panoramica Globale</h2>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-slate-600">Clienti Totali</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">{globalStats.totalClients}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-slate-600">Attivi</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">{globalStats.activeClients}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-slate-600">Trial</div>
                  <div className="text-3xl font-bold text-yellow-600 mt-2">{globalStats.trialClients}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-slate-600">Chiamate Totali</div>
                  <div className="text-3xl font-bold text-slate-900 mt-2">{globalStats.totalCalls}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-slate-600">Revenue Mese</div>
                  <div className="text-3xl font-bold text-green-600 mt-2">€{globalStats.totalRevenue}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-sm font-medium text-slate-600">Conversion Avg</div>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{globalStats.averageConversion}%</div>
                </div>
              </div>
            </div>
          </>
        )}


        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/api-costs" className="border border-slate-200 p-6 hover:border-slate-900 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-2">Costi API</h3>
            <p className="text-sm text-slate-600 mb-4">
              Monitora utilizzo e costi dei servizi esterni
            </p>
            <div className="text-sm text-slate-900 font-medium">
              Vedi dettagli →
            </div>
          </Link>

          <Link href="/admin/system" className="border border-slate-200 p-6 hover:border-slate-900 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-2">System Health</h3>
            <p className="text-sm text-slate-600 mb-4">
              Stato dei servizi e infrastruttura
            </p>
            <div className="text-sm text-slate-900 font-medium">
              Verifica stato →
            </div>
          </Link>

          <Link href="/admin/analytics" className="border border-slate-200 p-6 hover:border-slate-900 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-2">Performance Clienti</h3>
            <p className="text-sm text-slate-600 mb-4">
              Vedi quali clienti convertono meglio
            </p>
            <div className="text-sm text-slate-900 font-medium">
              Vedi Report →
            </div>
            </Link>

          <Link href="/admin/clients" className="border border-slate-200 p-6 hover:border-slate-900 transition-colors">
            <h3 className="font-semibold text-slate-900 mb-2">Gestione Clienti</h3>
            <p className="text-sm text-slate-600 mb-4">
              Visualizza e gestisci tutti i clienti
            </p>
            <div className="text-sm text-slate-900 font-medium">
              Vedi clienti →
          </div>
            </Link>
        </div>
      </div>
    </div>
  );
}


