'use client';

import { useState, useEffect } from 'react';
import { MILAN_ZONES } from '@/lib/milanZones';

interface Agent {
  id: string;
  name: string;
  whatsapp: string;
}

interface ZoneAssignment {
  [zoneId: string]: string; // zoneId -> agentId
}

export default function ZonesPage() {
  const [agents, setAgents] = useState<Agent[]>([
    { id: '1', name: 'Federico (Tu)', whatsapp: '+393394197445' }
  ]);
  const [zoneAssignments, setZoneAssignments] = useState<ZoneAssignment>({});
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentWhatsapp, setNewAgentWhatsapp] = useState('');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Carica dati da API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch('/api/dashboard/zones');
      if (!response.ok) throw new Error('Failed to fetch zones');
      const data = await response.json();
      if (data.agents && data.agents.length > 0) {
        setAgents(data.agents);
      }
      if (data.zoneAssignments) {
        setZoneAssignments(data.zoneAssignments);
      }
    } catch (error) {
      console.error('Error loading zones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Salva su Firestore
  const saveData = async (agentsToSave?: Agent[], assignmentsToSave?: ZoneAssignment) => {
    try {
      await fetch('/api/dashboard/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          agents: agentsToSave || agents, 
          zoneAssignments: assignmentsToSave || zoneAssignments 
        }),
      });
    } catch (error) {
      console.error('Error saving zones:', error);
    }
  };

  const handleAssignZone = async (zoneId: string, agentId: string) => {
    const newAssignments = {
      ...zoneAssignments,
      [zoneId]: agentId
    };
    setZoneAssignments(newAssignments);
    setSelectedZone(null);
    // Salva su Firestore
    await saveData(undefined, newAssignments);
  };

  const handleAddAgent = async () => {
    if (!newAgentName || !newAgentWhatsapp) return;
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      whatsapp: newAgentWhatsapp
    };
    
    const newAgents = [...agents, newAgent];
    setAgents(newAgents);
    setNewAgentName('');
    setNewAgentWhatsapp('');
    setShowAddAgent(false);
    // Salva su Firestore
    await saveData(newAgents);
  };

  const handleRemoveAgent = async (agentId: string) => {
    // Remove agent
    const newAgents = agents.filter(a => a.id !== agentId);
    setAgents(newAgents);
    
    // Remove all zone assignments for this agent
    const newAssignments = { ...zoneAssignments };
    Object.keys(newAssignments).forEach(zoneId => {
      if (newAssignments[zoneId] === agentId) {
        delete newAssignments[zoneId];
      }
    });
    setZoneAssignments(newAssignments);
    // Salva su Firestore
    await saveData(newAgents, newAssignments);
  };

  const getAgentForZone = (zoneId: string): Agent | null => {
    const agentId = zoneAssignments[zoneId];
    return agents.find(a => a.id === agentId) || null;
  };

  // Group zones by area
  const zonesByArea = {
    'Centro': MILAN_ZONES.filter(z => ['centro', 'duomo', 'brera'].includes(z.id)),
    'Est': MILAN_ZONES.filter(z => ['porta-venezia', 'lambrate', 'citta-studi'].includes(z.id)),
    'Sud': MILAN_ZONES.filter(z => ['porta-romana', 'navigli', 'ticinese'].includes(z.id)),
    'Nord': MILAN_ZONES.filter(z => ['isola', 'garibaldi', 'bicocca'].includes(z.id)),
    'Ovest': MILAN_ZONES.filter(z => ['san-siro', 'fiera', 'portello'].includes(z.id)),
    'Altro': MILAN_ZONES.filter(z => ['loreto', 'buenos-aires', 'stazione-centrale'].includes(z.id)),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mappa Zone Milano</h1>
        <p className="text-slate-600 mt-1">
          Assegna le zone di Milano ai tuoi agenti. Le chiamate verranno inoltrate automaticamente.
        </p>
      </div>

      {/* Map Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Zone di Milano</h2>
        
        <div className="space-y-6">
          {Object.entries(zonesByArea).map(([area, zones]) => (
            <div key={area}>
              <h3 className="text-sm font-medium text-slate-700 mb-3">{area}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {zones.map((zone) => {
                  const assignedAgent = getAgentForZone(zone.id);
                  
                  return (
                    <div
                      key={zone.id}
                      className={`border-2 rounded-lg p-4 transition cursor-pointer ${
                        assignedAgent
                          ? 'border-green-300 bg-green-50 hover:bg-green-100'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                      onClick={() => setSelectedZone(zone.id)}
                    >
                      <div className="font-medium text-slate-900 mb-2">
                        {zone.name}
                      </div>
                      
                      {assignedAgent ? (
                        <div className="text-sm">
                          <div className="text-green-700 font-medium">
                            {assignedAgent.name}
                          </div>
                          <div className="text-green-600 text-xs mt-1">
                            {assignedAgent.whatsapp}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-slate-400">
                          Non assegnata
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agents List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Il Mio Team</h2>
          <button
            onClick={() => setShowAddAgent(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition"
          >
            + Aggiungi Agente
          </button>
        </div>

        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
            >
              <div>
                <div className="font-medium text-slate-900">{agent.name}</div>
                <div className="text-sm text-slate-600">{agent.whatsapp}</div>
              </div>
              
              {agent.id !== '1' && (
                <button
                  onClick={() => handleRemoveAgent(agent.id)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Rimuovi
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Agent Form */}
        {showAddAgent && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-900 mb-3">Nuovo Agente</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nome agente"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="WhatsApp (es: +39 345 678 9012)"
                value={newAgentWhatsapp}
                onChange={(e) => setNewAgentWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddAgent}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg"
                >
                  Aggiungi
                </button>
                <button
                  onClick={() => setShowAddAgent(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm rounded-lg"
                >
                  Annulla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone Assignment Modal */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Assegna {MILAN_ZONES.find(z => z.id === selectedZone)?.name}
            </h3>
            
            <div className="space-y-2 mb-4">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleAssignZone(selectedZone, agent.id)}
                  className="w-full text-left p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  <div className="font-medium text-slate-900">{agent.name}</div>
                  <div className="text-sm text-slate-600">{agent.whatsapp}</div>
                </button>
              ))}
              
              <button
                onClick={async () => {
                  const newAssignments = { ...zoneAssignments };
                  delete newAssignments[selectedZone];
                  setZoneAssignments(newAssignments);
                  setSelectedZone(null);
                  // Salva su Firestore
                  await saveData(undefined, newAssignments);
                }}
                className="w-full text-left p-3 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition text-red-600"
              >
                Rimuovi Assegnazione
              </button>
            </div>

            <button
              onClick={() => setSelectedZone(null)}
              className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

