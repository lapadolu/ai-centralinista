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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white brick-gradient-text">CRM Lead</h1>
        <p className="text-sand/60 mt-2">Gestisci tutti i tuoi contatti</p>
      </div>

      {/* Status Pills */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-subtle ${
            filter === 'all'
              ? 'brick-gradient text-white shadow-brick'
              : 'brick-card text-sand/70 hover:text-white hover:border-white/20'
          }`}
        >
          Tutti ({leads.length})
        </button>
        <button
          onClick={() => setFilter('nuovo')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-subtle ${
            filter === 'nuovo'
              ? 'bg-brick-accent/40 border border-brick-accentLight text-white'
              : 'brick-card text-sand/70 hover:text-brick-accentLight hover:border-brick-accent/30'
          }`}
        >
          Nuovi ({statusCounts.nuovo})
        </button>
        <button
          onClick={() => setFilter('contattato')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-subtle ${
            filter === 'contattato'
              ? 'bg-brick-accentLight/30 border border-brick-accentLight/50 text-white'
              : 'brick-card text-sand/70 hover:text-brick-accentLight hover:border-brick-accent/30'
          }`}
        >
          Contattati ({statusCounts.contattato})
        </button>
        <button
          onClick={() => setFilter('chiuso')}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-subtle ${
            filter === 'chiuso'
              ? 'bg-brick-accentLight/30 border border-brick-accentLight/50 text-white'
              : 'brick-card text-sand/70 hover:text-brick-accentLight hover:border-brick-accent/30'
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
          className="flex-1 px-4 py-2.5 brick-card rounded-xl text-sand/80 placeholder-sand/40 bg-white/5 border border-white/10 focus:border-brick-accent/50 focus:outline-none transition-subtle"
        />
        <button className="px-6 py-2.5 bg-brick-accent/30 border border-brick-accentLight/50 text-white rounded-xl font-semibold transition-subtle hover:bg-brick-accent/40">
          Export CSV
        </button>
      </div>

      {/* Leads List */}
      <div className="brick-card rounded-xl divide-y divide-white/5">
        {filteredLeads.map((lead) => (
          <div 
            key={lead.id} 
            className={`p-6 hover:bg-white/5 transition-subtle border-l-4 ${
              lead.priority === 'alta' ? 'border-brick-accent' :
              lead.priority === 'media' ? 'border-brick-accentLight' :
              'border-white/10'
            }`}
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <h3 className="text-lg font-semibold text-white">{lead.nome}</h3>
                  <span className="text-xs text-sand/40">{lead.timestamp}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    lead.status === 'nuovo' ? 'bg-brick-accent/30 text-brick-accentLight border border-brick-accent/50' :
                    lead.status === 'contattato' ? 'bg-brick-accentLight/20 text-brick-accentLight border border-brick-accentLight/30' :
                    'bg-brick-accentLight/20 text-brick-accentLight border border-brick-accentLight/30'
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    lead.priority === 'alta' ? 'bg-brick-accent/40 text-white' :
                    lead.priority === 'media' ? 'bg-brick-accentLight/30 text-white' :
                    'bg-white/10 text-sand/60'
                  }`}>
                    {lead.priority.toUpperCase()} ({lead.score})
                  </span>
                  {lead.duration > 0 && (
                    <span className="text-xs text-sand/40">
                      Durata: {Math.floor(lead.duration / 60)}:{(lead.duration % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Critical Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-sand/50 mb-1">Telefono</div>
                    <div className="text-sm font-medium text-sand/80">{lead.telefono}</div>
                  </div>
                  <div>
                    <div className="text-xs text-sand/50 mb-1">Richiesta</div>
                    <div className="text-sm font-medium text-white">{lead.tipo_richiesta.toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-sand/50 mb-1">Zona</div>
                    <div className="text-sm font-medium text-sand/80">{lead.zona}</div>
                  </div>
                  {lead.budget !== 'Non specificato' && (
                    <div>
                      <div className="text-xs text-sand/50 mb-1">Budget</div>
                      <div className="text-sm font-medium text-brick-accentLight">{lead.budget}</div>
                    </div>
                  )}
                </div>

                {/* Note Priority */}
                {lead.note && lead.note.trim() && (
                  <div className={`border-l-4 p-4 mb-4 rounded-r-xl ${
                    lead.priority === 'alta' ? 'bg-brick-accent/10 border-brick-accent' :
                    lead.priority === 'media' ? 'bg-brick-accentLight/10 border-brick-accentLight' :
                    'bg-white/5 border-white/20'
                  }`}>
                    <div className="text-xs font-semibold text-sand/60 mb-2">Note Cliente:</div>
                    <div className="text-sm text-sand/80">{lead.note}</div>
                  </div>
                )}

                {/* Request Summary */}
                <div className="text-sm text-sand/60">
                  <span className="font-medium text-sand/80">{lead.tipo_immobile}</span>
                  {lead.budget !== 'Non specificato' && (
                    <> · <span className="text-brick-accentLight font-medium">{lead.budget}</span></>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${lead.telefono}`}
                  className="px-4 py-2 bg-brick-accent/30 border border-brick-accentLight/50 text-white text-sm rounded-full transition-subtle hover:bg-brick-accent/40 text-center font-semibold"
                >
                  Chiama
                </a>
                
                {lead.status === 'nuovo' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'contattato')}
                    className="px-4 py-2 bg-brick-accentLight/30 border border-brick-accentLight/50 text-white text-sm rounded-full transition-subtle hover:bg-brick-accentLight/40 font-semibold"
                  >
                    ✓ Contattato
                  </button>
                )}
                
                {lead.status === 'contattato' && (
                  <button
                    onClick={() => updateLeadStatus(lead.id, 'chiuso')}
                    className="px-4 py-2 bg-brick-accentLight/30 border border-brick-accentLight/50 text-white text-sm rounded-full transition-subtle hover:bg-brick-accentLight/40 font-semibold"
                  >
                    ✓ Chiudi
                  </button>
                )}
                
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="px-4 py-2 brick-card text-sand/70 hover:text-white text-sm rounded-full transition-subtle font-semibold"
                >
                  Dettagli
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="p-12 text-center text-sand/50">
            <p className="text-lg mb-2">Nessun lead trovato</p>
            <p className="text-sm text-sand/40">Le chiamate ricevute appariranno qui automaticamente</p>
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="brick-card rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-white brick-gradient-text">{selectedLead.nome}</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-sand/40 hover:text-white transition-subtle"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="text-sm text-sand/50 mb-2">Telefono</div>
                <div className="text-lg font-medium text-white">{selectedLead.telefono}</div>
              </div>

              <div>
                <div className="text-sm text-sand/50 mb-2">Richiesta</div>
                <div className="text-sand/80">
                  {selectedLead.tipo_richiesta.toUpperCase()} · {selectedLead.tipo_immobile} · {selectedLead.zona}
                </div>
              </div>

              {selectedLead.budget !== 'Non specificato' && (
                <div>
                  <div className="text-sm text-sand/50 mb-2">Budget</div>
                  <div className="text-brick-accentLight font-medium">{selectedLead.budget}</div>
                </div>
              )}

              {selectedLead.note && (
                <div>
                  <div className="text-sm text-sand/50 mb-2">Note Cliente</div>
                  <div className="p-4 bg-white/5 rounded-xl text-sand/80 border border-white/10">
                    {selectedLead.note}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <div className="text-sm text-sand/50 mb-1">Chiamata Ricevuta</div>
                  <div className="text-sand/70">{selectedLead.timestamp}</div>
                </div>
                <div>
                  <div className="text-sm text-sand/50 mb-1">Durata</div>
                  <div className="text-sand/70">
                    {Math.floor(selectedLead.duration / 60)}:{(selectedLead.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <a
                href={`tel:${selectedLead.telefono}`}
                className="flex-1 px-5 py-3 bg-brick-accent/30 border border-brick-accentLight/50 text-white rounded-full font-semibold text-center transition-subtle hover:bg-brick-accent/40"
              >
                Chiama Ora
              </a>
              <a
                href={`https://wa.me/${selectedLead.telefono.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-5 py-3 bg-brick-accentLight/30 border border-brick-accentLight/50 text-white rounded-full font-semibold text-center transition-subtle hover:bg-brick-accentLight/40"
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

