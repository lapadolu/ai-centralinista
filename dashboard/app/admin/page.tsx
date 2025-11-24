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
  const [clients, setClients] = useState<ClientOverview[]>([]);

  const [globalStats, setGlobalStats] = useState({
    totalClients: 2,
    activeClients: 1,
    trialClients: 1,
    totalCalls: 469,
    totalRevenue: 49,
    averageConversion: 69
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>FIXER Admin</h1>
              <div className="flex gap-4 text-sm">
                <Link href="/admin" className="text-red-600 font-medium">Dashboard</Link>
                <Link href="/admin/setup" className="text-slate-600 hover:text-slate-900">Setup Ordini</Link>
                <Link href="/admin/clients" className="text-slate-600 hover:text-slate-900">Clienti</Link>
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

        {/* Clients CRM */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900">Clienti</h2>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition">
                + Nuovo Cliente
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Piano
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Chiamate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Conversion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{client.name}</div>
                      <div className="text-sm text-slate-500">{client.email}</div>
                      <div className="text-xs text-slate-400">{client.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {client.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        client.status === 'active' ? 'bg-green-100 text-green-700' :
                        client.status === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {client.status === 'active' ? 'Attivo' : client.status === 'trial' ? 'Trial' : 'Sospeso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-900">{client.totalCalls}</td>
                    <td className="px-6 py-4 text-slate-900">{client.totalLeads}</td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-medium">{client.conversionRate}%</span>
                    </td>
                    <td className="px-6 py-4 text-slate-900 font-medium">€{client.monthlyCost}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 text-sm">
                          Dettagli
                        </button>
                        <button className="text-slate-600 hover:text-slate-700 text-sm">
                          Modifica
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Performance Clienti</h3>
            <p className="text-sm text-slate-600 mb-4">
              Vedi quali clienti convertono meglio
            </p>
            <Link href="/admin/analytics" className="text-sm text-red-600 hover:text-red-700 font-medium">
              Vedi Report →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Revenue Mensile</h3>
            <p className="text-sm text-slate-600 mb-4">
              €{globalStats.totalRevenue}/mese ricorrente
            </p>
            <Link href="/admin/billing" className="text-sm text-red-600 hover:text-red-700 font-medium">
              Dettagli Fatturazione →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Trial in Scadenza</h3>
            <p className="text-sm text-slate-600 mb-4">
              1 cliente da convertire
            </p>
            <Link href="/admin/clients" className="text-sm text-red-600 hover:text-red-700 font-medium">
              Gestisci Clienti →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


