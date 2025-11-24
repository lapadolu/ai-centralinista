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
    intentBreakdown: { comprare: 0, vendere: 0 },
    topZones: [],
    propertyTypes: [],
    topFeatures: [],
    averageBudget: 'N/A',
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/dashboard/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();
      
      setData({
        intentBreakdown: analyticsData.intentBreakdown || { comprare: 0, vendere: 0 },
        topZones: analyticsData.topZones || [],
        propertyTypes: analyticsData.propertyTypes || [],
        topFeatures: analyticsData.topFeatures || [],
        averageBudget: analyticsData.averageBudget || 'N/A',
        conversionRate: analyticsData.conversionRate || 0
      });
      
      // Set industry from user profile or default
      setUserIndustry('immobiliare');
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Caricamento analytics...</div>;
  }

  const hasData = data.topZones.length > 0 || data.propertyTypes.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">
          Insights e statistiche basate sulle tue chiamate reali
        </p>
      </div>

      {!hasData && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-slate-600 mb-4">Nessun dato disponibile ancora</p>
          <p className="text-sm text-slate-500">
            Le analytics appariranno qui automaticamente dopo le prime chiamate ricevute
          </p>
        </div>
      )}

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
            {data.topZones[0]?.zona || 'N/A'}
          </div>
          <div className="text-sm text-slate-500">
            {data.topZones[0]?.count || 0} richieste
          </div>
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

      {/* Insights - Solo se ci sono dati */}
      {hasData && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Insights</h2>
          <div className="space-y-2 text-sm text-slate-700">
            {data.topZones[0] && (
              <p>• <strong>Zona più richiesta:</strong> {data.topZones[0].zona} con {data.topZones[0].count} richieste. Considera di aumentare lo stock in questa zona.</p>
            )}
            {data.topFeatures[0] && (
              <p>• <strong>Feature più importante:</strong> {data.topFeatures[0].feature} richiesta dal {data.topFeatures[0].percentage}% dei clienti. Evidenzia questa caratteristica nelle proposte.</p>
            )}
            {data.averageBudget !== 'N/A' && (
              <p>• <strong>Budget medio:</strong> {data.averageBudget}. Target questa fascia di prezzo per ottimizzare le offerte.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

