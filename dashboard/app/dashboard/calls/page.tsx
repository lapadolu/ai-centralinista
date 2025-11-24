'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Call {
  id: string;
  call_id: string;
  customer_number: string;
  status: string;
  started_at: string;
  ended_at: string;
  duration: number;
  transcript?: string;
  client_info?: {
    nome?: string;
    telefono?: string;
    zona?: string;
    tipo_richiesta?: string;
  };
}

export default function CallsPage() {
  const { data: session } = useSession();
  const [calls, setCalls] = useState<Call[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'in_progress'>('all');
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      const response = await fetch('/api/dashboard/calls');
      if (!response.ok) throw new Error('Failed to fetch calls');
      const data = await response.json();
      setCalls(data.calls || []);
    } catch (error) {
      console.error('Error loading calls:', error);
      setCalls([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCalls = calls.filter(call => {
    if (filter === 'all') return true;
    return call.status === filter;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return <div className="text-center py-12">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Chiamate</h1>
        <p className="text-slate-600 mt-1">Registro completo delle chiamate ricevute</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tutte ({calls.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'completed'
              ? 'bg-green-500 text-white'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          Completate ({calls.filter(c => c.status === 'completed').length})
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'failed'
              ? 'bg-red-500 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          Fallite ({calls.filter(c => c.status === 'failed').length})
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'in_progress'
              ? 'bg-yellow-500 text-white'
              : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
          }`}
        >
          In Corso ({calls.filter(c => c.status === 'in_progress').length})
        </button>
      </div>

      {/* Calls List */}
      <div className="bg-white rounded-lg shadow divide-y divide-slate-100">
        {filteredCalls.map((call) => (
          <div key={call.id} className="p-6 hover:bg-slate-50 transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {call.client_info?.nome || call.customer_number}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    call.status === 'completed' ? 'bg-green-100 text-green-700' :
                    call.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {call.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-sm text-slate-600 space-y-1">
                  <div>
                    <span className="font-medium">Telefono:</span> {call.customer_number}
                  </div>
                  {call.client_info?.zona && (
                    <div>
                      <span className="font-medium">Zona:</span> {call.client_info.zona}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Inizio:</span> {formatDate(call.started_at)}
                  </div>
                  {call.ended_at && (
                    <div>
                      <span className="font-medium">Fine:</span> {formatDate(call.ended_at)}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Durata:</span> {formatDuration(call.duration)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCall(call)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition ml-4"
              >
                Dettagli
              </button>
            </div>
          </div>
        ))}

        {filteredCalls.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            Nessuna chiamata trovata
          </div>
        )}
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Dettagli Chiamata
              </h2>
              <button
                onClick={() => setSelectedCall(null)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600 mb-1">Cliente</div>
                  <div className="text-slate-900 font-medium">
                    {selectedCall.client_info?.nome || 'Non specificato'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Telefono</div>
                  <div className="text-slate-900">{selectedCall.customer_number}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Status</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedCall.status === 'completed' ? 'bg-green-100 text-green-700' :
                    selectedCall.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedCall.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Durata</div>
                  <div className="text-slate-900">{formatDuration(selectedCall.duration)}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 mb-1">Inizio</div>
                  <div className="text-slate-900">{formatDate(selectedCall.started_at)}</div>
                </div>
                {selectedCall.ended_at && (
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Fine</div>
                    <div className="text-slate-900">{formatDate(selectedCall.ended_at)}</div>
                  </div>
                )}
              </div>

              {selectedCall.client_info?.zona && (
                <div>
                  <div className="text-sm text-slate-600 mb-1">Zona</div>
                  <div className="text-slate-900">{selectedCall.client_info.zona}</div>
                </div>
              )}

              {selectedCall.transcript && (
                <div>
                  <div className="text-sm text-slate-600 mb-2">Trascrizione</div>
                  <div className="p-4 bg-slate-50 rounded-lg text-slate-900 max-h-64 overflow-y-auto">
                    {selectedCall.transcript}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-slate-600 mb-1">Call ID</div>
                <div className="text-xs text-slate-500 font-mono">{selectedCall.call_id}</div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <a
                href={`tel:${selectedCall.customer_number}`}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-center transition"
              >
                Richiama
              </a>
              {selectedCall.client_info?.telefono && (
                <a
                  href={`https://wa.me/${selectedCall.client_info.telefono.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center transition"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

