'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  whatsapp: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'trial' | 'suspended';
  vapiAssistantId?: string;
  phoneNumber?: string;
  totalCalls: number;
  totalLeads: number;
  conversionRate: number;
  monthlyCost: number;
  trialEndsAt?: string;
  notes?: string;
  createdAt: string;
}

export default function ClientsManagement() {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Federico',
      email: 'federico@iconacasa.it',
      company: 'IconaCasa Milano',
      whatsapp: '+393394197445',
      plan: 'starter',
      status: 'active',
      vapiAssistantId: 'fec18106-fda6-4b18-a361-f435b6d19d7b',
      phoneNumber: '+1 478 654 1644',
      totalCalls: 342,
      totalLeads: 234,
      conversionRate: 68,
      monthlyCost: 49,
      notes: 'Cliente pilota, agenzia immobiliare Milano',
      createdAt: '2025-11-01'
    }
  ]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddClient, setShowAddClient] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              <Link href="/admin" className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>FIXER Admin</Link>
              <div className="flex gap-4 text-sm">
                <Link href="/admin" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
                <Link href="/admin/setup" className="text-slate-600 hover:text-slate-900">Setup Ordini</Link>
                <Link href="/admin/clients" className="text-red-600 font-medium">Clienti</Link>
                <Link href="/admin/analytics" className="text-slate-600 hover:text-slate-900">Analytics</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestione Clienti</h1>
            <p className="text-slate-600 mt-1">CRM completo per tutti i tuoi clienti</p>
          </div>
          <button
            onClick={() => setShowAddClient(true)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            + Nuovo Cliente
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4">
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm">
              <option>Tutti gli status</option>
              <option>Attivi</option>
              <option>Trial</option>
              <option>Sospesi</option>
            </select>
            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm">
              <option>Tutti i piani</option>
              <option>Starter</option>
              <option>Pro</option>
              <option>Enterprise</option>
            </select>
            <input
              type="text"
              placeholder="Cerca cliente..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Piano/Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Note</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{client.name}</div>
                    <div className="text-sm text-slate-600">{client.company}</div>
                    <div className="text-xs text-slate-400">{client.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="mb-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {client.plan.toUpperCase()}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      client.status === 'active' ? 'bg-green-100 text-green-700' :
                      client.status === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {client.status === 'active' ? 'Attivo' : client.status === 'trial' ? 'Trial' : 'Sospeso'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{client.totalCalls} chiamate</div>
                    <div className="text-sm text-slate-600">{client.totalLeads} lead</div>
                    <div className="text-xs text-green-600 font-medium">{client.conversionRate}% conv.</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-lg font-semibold text-slate-900">€{client.monthlyCost}</div>
                    <div className="text-xs text-slate-500">/mese</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-600 max-w-xs truncate">
                      {client.notes || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setSelectedClient(client)}
                        className="text-sm text-blue-600 hover:text-blue-700 text-left"
                      >
                        Dettagli
                      </button>
                      <button className="text-sm text-slate-600 hover:text-slate-700 text-left">
                        Modifica
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-700 text-left">
                        Sospendi
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{selectedClient.name}</h2>
                  <p className="text-slate-600">{selectedClient.company}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Email</div>
                  <div className="font-medium text-slate-900">{selectedClient.email}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">WhatsApp</div>
                  <div className="font-medium text-slate-900">{selectedClient.whatsapp}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Piano</div>
                  <div className="font-medium text-slate-900">{selectedClient.plan.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Status</div>
                  <div className="font-medium text-slate-900">{selectedClient.status}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Numero Vapi</div>
                  <div className="font-medium text-slate-900">{selectedClient.phoneNumber || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Assistant ID</div>
                  <div className="font-mono text-xs text-slate-900">{selectedClient.vapiAssistantId?.substring(0, 20)}...</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{selectedClient.totalCalls}</div>
                    <div className="text-sm text-slate-600">Chiamate</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900">{selectedClient.totalLeads}</div>
                    <div className="text-sm text-slate-600">Lead</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedClient.conversionRate}%</div>
                    <div className="text-sm text-slate-600">Conversion</div>
                  </div>
                </div>
              </div>

              {selectedClient.notes && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Note</h3>
                  <p className="text-slate-600">{selectedClient.notes}</p>
                </div>
              )}

              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Modifica Cliente
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition">
                  Sospendi Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


