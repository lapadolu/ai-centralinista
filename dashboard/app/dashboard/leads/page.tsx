'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Lead {
  id: string;
  nome: string;
  telefono: string;
  tipo_richiesta: string;
  zona: string;
  tipo_immobile: string;
  budget: string;
  note: string;
  status: 'nuovo' | 'contattato' | 'chiuso';
  timestamp: string;
  duration: number;
  priority: 'alta' | 'media' | 'bassa';
  score: number; // Lead score 0-100
}

export default function LeadsPage() {
  const { data: session } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<'all' | 'nuovo' | 'contattato' | 'chiuso'>('all');
  const [searchZone, setSearchZone] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/dashboard/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      // Calcola priority e score per ogni lead
      const leadsWithPriority = (data.leads || []).map((lead: any) => {
        let score = 50; // Base score
        let priority: 'alta' | 'media' | 'bassa' = 'media';
        
        // Aumenta score se ha budget specificato
        if (lead.budget && lead.budget !== 'Non specificato') {
          score += 20;
        }
        
        // Aumenta score se ha note dettagliate
        if (lead.note && lead.note.length > 50) {
          score += 15;
        }
        
        // Aumenta score se tipo_richiesta è "comprare" (più probabile chiusura)
        if (lead.tipo_richiesta?.toLowerCase() === 'comprare') {
          score += 10;
        }
        
        // Aumenta score se zona è specificata
        if (lead.zona && lead.zona !== 'Non specificato') {
          score += 10;
        }
        
        // Aumenta score se durata chiamata > 2 minuti (interesse maggiore)
        if (lead.duration > 120) {
          score += 5;
        }
        
        // Determina priority basata su score
        if (score >= 75) priority = 'alta';
        else if (score >= 50) priority = 'media';
        else priority = 'bassa';
        
        return { ...lead, priority, score: Math.min(100, score) };
      });
      
      // Ordina per priority (alta -> media -> bassa) e poi per score
      leadsWithPriority.sort((a: any, b: any) => {
        const priorityOrder = { alta: 3, media: 2, bassa: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return b.score - a.score;
      });
      
      setLeads(leadsWithPriority);
    } catch (error) {
      console.error('Error loading leads:', error);
      // Nessun fallback - mostra lista vuota se API fallisce
      setLeads([]);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: 'nuovo' | 'contattato' | 'chiuso') => {
    try {
      const response = await fetch('/api/dashboard/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (!response.ok) throw new Error('Failed to update lead');
      
      // Update local state
      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    if (filter !== 'all' && lead.status !== filter) return false;
    if (searchZone && !lead.zona.toLowerCase().includes(searchZone.toLowerCase())) return false;
    return true;
  });

  const statusCounts = {
    nuovo: leads.filter(l => l.status === 'nuovo').length,
    contattato: leads.filter(l => l.status === 'contattato').length,
    chiuso: leads.filter(l => l.status === 'chiuso').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CRM Lead</h1>
        <p className="text-slate-600 mt-1">Gestisci tutti i tuoi contatti</p>
      </div>

      {/* Status Pills */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tutti ({leads.length})
        </button>
        <button
          onClick={() => setFilter('nuovo')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'nuovo'
              ? 'bg-red-500 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          Nuovi ({statusCounts.nuovo})
        </button>
        <button
          onClick={() => setFilter('contattato')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'contattato'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          Contattati ({statusCounts.contattato})
        </button>
        <button
          onClick={() => setFilter('chiuso')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'chiuso'
              ? 'bg-green-500 text-white'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          Chiusi ({statusCounts.chiuso})
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Filtra per zona..."
          value={searchZone}
          onChange={(e) => setSearchZone(e.target.value)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
        />
        <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
          Export CSV
        </button>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-lg shadow divide-y divide-slate-100">
        {filteredLeads.map((lead) => (
          <div 
            key={lead.id} 
            className={`p-6 hover:bg-slate-50 transition border-l-4 ${
              lead.priority === 'alta' ? 'border-red-500' :
              lead.priority === 'media' ? 'border-yellow-500' :
              'border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-slate-900">{lead.nome}</h3>
                  <span className="text-xs text-slate-500">{lead.timestamp}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    lead.status === 'nuovo' ? 'bg-red-100 text-red-700' :
                    lead.status === 'contattato' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    lead.priority === 'alta' ? 'bg-red-500 text-white' :
                    lead.priority === 'media' ? 'bg-yellow-500 text-white' :
                    'bg-slate-400 text-white'
                  }`}>
                    {lead.priority.toUpperCase()} ({lead.score})
                  </span>
                  {lead.duration > 0 && (
                    <span className="text-xs text-slate-500">
                      Durata: {Math.floor(lead.duration / 60)}:{(lead.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Critical Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Telefono</div>
                    <div className="text-sm font-medium text-slate-900">{lead.telefono}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Richiesta</div>
                    <div className="text-sm font-medium text-slate-900">{lead.tipo_richiesta.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Zona</div>
                    <div className="text-sm font-medium text-slate-900">{lead.zona}</div>
                  </div>
                  {lead.budget !== 'Non specificato' && (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Budget</div>
                      <div className="text-sm font-medium text-green-600">{lead.budget}</div>
                    </div>
                  )}
                </div>

                {/* Note Priority */}
                {lead.note && lead.note.trim() && (
                  <div className={`border-l-4 p-3 mb-3 ${
                    lead.priority === 'alta' ? 'bg-red-50 border-red-500' :
                    lead.priority === 'media' ? 'bg-yellow-50 border-yellow-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="text-xs font-semibold text-slate-700 mb-1">Note Cliente:</div>
                    <div className="text-sm text-slate-900">{lead.note}</div>
                  </div>
                )}

                {/* Request Summary */}
                <div className="text-sm text-slate-600">
                  <span className="font-medium">{lead.tipo_immobile}</span>
                  {lead.budget !== 'Non specificato' && (
                    <> · <span className="text-green-600 font-medium">{lead.budget}</span></>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <a
                  href={`tel:${lead.telefono}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition text-center"
                >
                  Chiama
                </a>
                
                {lead.status === 'nuovo' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'contattato')}
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded-lg transition"
                  >
                    ✓ Contattato
                  </button>
                )}
                
                {lead.status === 'contattato' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'chiuso')}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition"
                  >
                    ✓ Chiudi
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm rounded-lg transition"
                >
                  Dettagli
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Nessun lead trovato
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{selectedLead.nome}</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-600 mb-1">Telefono</div>
                <div className="text-lg font-medium text-slate-900">{selectedLead.telefono}</div>
              </div>

              <div>
                <div className="text-sm text-slate-600 mb-1">Richiesta</div>
                <div className="text-slate-900">
                  {selectedLead.tipo_richiesta.toUpperCase()} · {selectedLead.tipo_immobile} · {selectedLead.zona}
                </div>
              </div>

              {selectedLead.budget !== 'Non specificato' && (
                <div>
                  <div className="text-sm text-slate-600 mb-1">Budget</div>
                  <div className="text-slate-900">{selectedLead.budget}</div>
                </div>
              )}

              {selectedLead.note && (
                <div>
                  <div className="text-sm text-slate-600 mb-1">Note Cliente</div>
                  <div className="p-3 bg-blue-50 rounded-lg text-slate-900">
                    {selectedLead.note}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <div className="text-sm text-slate-600">Chiamata Ricevuta</div>
                  <div className="text-slate-900">{selectedLead.timestamp}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600">Durata</div>
                  <div className="text-slate-900">
                    {Math.floor(selectedLead.duration / 60)}:{(selectedLead.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <a
                href={`tel:${selectedLead.telefono}`}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition"
              >
                Chiama Ora
              </a>
              <a
                href={`https://wa.me/${selectedLead.telefono.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

