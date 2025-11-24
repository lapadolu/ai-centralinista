'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IndustryAnalytics } from '@/components/IndustryAnalytics';

interface AnalyticsData {
  intentBreakdown: { comprare: number; vendere: number };
  topZones: Array<{ zona: string; count: number }>;
  propertyTypes: Array<{ tipo: string; percentage: number }>;
  topFeatures: Array<{ feature: string; percentage: number }>;
  averageBudget: string;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const [userIndustry, setUserIndustry] = useState<string>('');
  const [calls, setCalls] = useState<any[]>([]);
  const [data, setData] = useState<AnalyticsData>({
    intentBreakdown: { comprare: 68, vendere: 32 },
    topZones: [
      { zona: 'Porta Romana', count: 89 },
      { zona: 'Navigli', count: 67 },
      { zona: 'Lambrate', count: 45 },
      { zona: 'Centro', count: 38 },
      { zona: 'Isola', count: 28 }
    ],
    propertyTypes: [
      { tipo: 'Bilocale', percentage: 45 },
      { tipo: 'Trilocale', percentage: 30 },
      { tipo: 'Monolocale', percentage: 15 },
      { tipo: 'Villa', percentage: 10 }
    ],
    topFeatures: [
      { feature: 'Balcone', percentage: 78 },
      { feature: 'Luminoso', percentage: 65 },
      { feature: 'Posto auto', percentage: 52 },
      { feature: 'Ristrutturato', percentage: 41 },
      { feature: 'Piano alto', percentage: 33 }
    ],
    averageBudget: '€285.000',
    conversionRate: 68
  });

  useEffect(() => {
    loadUserData();
    loadCalls();
  }, []);

  const loadUserData = async () => {
    try {
      // TODO: Fetch user industry from profile
      // Per ora default a immobiliare
      setUserIndustry('immobiliare');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadCalls = async () => {
    try {
      // TODO: Fetch calls from API
      // const response = await fetch('/api/calls');
      // const data = await response.json();
      // setCalls(data.calls || []);
    } catch (error) {
      console.error('Error loading calls:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">
          Insights e statistiche personalizzate per il tuo settore
        </p>
      </div>

      {/* Industry-Specific Analytics */}
      {userIndustry && (
        <div className="mb-8">
          <IndustryAnalytics industry={userIndustry} calls={calls} />
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-slate-600 mb-2">Conversion Rate</div>
          <div className="text-4xl font-bold text-green-600 mb-1">
            {data.conversionRate}%
          </div>
          <div className="text-sm text-slate-500">Lead validi da chiamate</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-slate-600 mb-2">Budget Medio</div>
          <div className="text-4xl font-bold text-blue-600 mb-1">
            {data.averageBudget}
          </div>
          <div className="text-sm text-slate-500">Clienti compratori</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-slate-600 mb-2">Zona Top</div>
          <div className="text-4xl font-bold text-purple-600 mb-1">
            {data.topZones[0]?.zona}
          </div>
          <div className="text-sm text-slate-500">{data.topZones[0]?.count} richieste</div>
        </div>
      </div>

      {/* Intent Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Comprare vs Vendere
        </h2>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-700">Comprare</span>
              <span className="font-semibold text-slate-900">{data.intentBreakdown.comprare}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${data.intentBreakdown.comprare}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-700">Vendere</span>
              <span className="font-semibold text-slate-900">{data.intentBreakdown.vendere}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${data.intentBreakdown.vendere}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Top Zones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Top 5 Zone Richieste
        </h2>
        <div className="space-y-3">
          {data.topZones.map((zone, index) => (
            <div key={zone.zona} className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">{zone.zona}</div>
                <div className="text-sm text-slate-500">{zone.count} richieste</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Property Types */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Tipo Immobile
          </h2>
          <div className="space-y-3">
            {data.propertyTypes.map((type) => (
              <div key={type.tipo}>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-700">{type.tipo}</span>
                  <span className="font-semibold text-slate-900">{type.percentage}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${type.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Features */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Features Più Richieste
          </h2>
          <div className="space-y-3">
            {data.topFeatures.map((feature, index) => (
              <div key={feature.feature} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{feature.feature}</div>
                  <div className="text-sm text-slate-500">{feature.percentage}% clienti</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Insights</h2>
        <div className="space-y-2 text-sm text-slate-700">
          <p>• <strong>Focus su bilocali:</strong> 45% delle richieste. Aumenta stock in Porta Romana.</p>
          <p>• <strong>Balcone è chiave:</strong> 78% lo richiede. Evidenzia nelle proposte.</p>
          <p>• <strong>Budget medio €285k:</strong> Target fascia media. Ottimizza offerte in questo range.</p>
        </div>
      </div>
    </div>
  );
}

