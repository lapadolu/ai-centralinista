'use client';

import { useMemo } from 'react';
import { getIndustryAnalytics } from '@/lib/analytics';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IndustryAnalyticsProps {
  industry: string;
  calls: any[]; // Array of calls with structured_data
}

/**
 * Industry-Specific Analytics Component
 * Mostra statistiche personalizzate per settore
 */
export function IndustryAnalytics({ industry, calls }: IndustryAnalyticsProps) {
  const analyticsConfig = getIndustryAnalytics(industry);

  // Extract data based on industry
  const analyticsData = useMemo(() => {
    if (!calls || calls.length === 0) return null;

    switch (industry) {
      case 'ristorante':
        return extractRestaurantData(calls) as any;
      case 'immobiliare':
        return extractRealEstateData(calls) as any;
      case 'servizi':
        return extractServicesData(calls) as any;
      default:
        return extractGenericData(calls) as any;
    }
  }, [industry, calls]) as any;

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600">Nessun dato disponibile ancora</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Industry-Specific Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyticsConfig.insights.slice(0, 3).map((insight, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">{insight}</div>
            <div className="text-3xl font-bold text-slate-900">
              {getMetricValue(industry, insight, analyticsData)}
            </div>
          </div>
        ))}
      </div>

      {/* Industry-Specific Charts */}
      {industry === 'ristorante' && (analyticsData as any).localiDistribution && (analyticsData as any).localiDistribution.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Pizze più richieste
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(analyticsData as any).localiDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="locali" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {industry === 'immobiliare' && analyticsData.zoneDistribution && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Zone più richieste
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.zoneDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {industry === 'immobiliare' && analyticsData.localiDistribution && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Numero locali più richiesto
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.localiDistribution}
                dataKey="count"
                nameKey="locali"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {analyticsData.localiDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {industry === 'ristorante' && analyticsData.zoneDistribution && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Zone prioritarie dei clienti
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.zoneDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zone" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Helper functions
function extractRestaurantData(calls: any[]) {
  const dishCounts: Record<string, number> = {};
  const zoneCounts: Record<string, number> = {};

  calls.forEach((call) => {
    const data = call.structured_data || call.client_info || {};
    const dish = data.tipo_prenotazione || data.pizza || data.piatto || 'Altro';
    const zone = data.zona || 'Non specificato';

    dishCounts[dish] = (dishCounts[dish] || 0) + 1;
    zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
  });

  return {
    localiDistribution: Object.entries(dishCounts).map(([locali, count]) => ({ locali, count })),
    zoneDistribution: Object.entries(zoneCounts).map(([zone, count]) => ({ zone, count })),
  };
}

function extractRealEstateData(calls: any[]) {
  const zoneCounts: Record<string, number> = {};
  const localiCounts: Record<string, number> = {};

  calls.forEach((call) => {
    const data = call.structured_data || call.client_info || {};
    const zone = data.zona || 'Non specificato';
    const locali = data.numero_locali || data.locali || 'Non specificato';

    zoneCounts[zone] = (zoneCounts[zone] || 0) + 1;
    localiCounts[locali] = (localiCounts[locali] || 0) + 1;
  });

  return {
    zoneDistribution: Object.entries(zoneCounts).map(([zone, count]) => ({ zone, count })),
    localiDistribution: Object.entries(localiCounts).map(([locali, count]) => ({ locali, count })),
  };
}

function extractServicesData(calls: any[]) {
  const serviceCounts: Record<string, number> = {};

  calls.forEach((call) => {
    const data = call.structured_data || call.client_info || {};
    const service = data.tipo_servizio || 'Non specificato';
    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
  });

  return {
    serviceDistribution: Object.entries(serviceCounts).map(([service, count]) => ({ service, count })),
  };
}

function extractGenericData(calls: any[]) {
  return {
    totalCalls: calls.length,
    validLeads: calls.filter((c) => c.client_info?.nome && c.client_info?.telefono).length,
  };
}

function getMetricValue(industry: string, insight: string, data: any): string {
  // Map insights to data values
  if (insight.includes('Pizze più richieste')) {
    const topDish = data.localiDistribution?.[0];
    return topDish ? `${topDish.locali} (${topDish.count})` : '-';
  }
  if (insight.includes('Zone più richieste') || insight.includes('Zone prioritarie')) {
    const topZone = data.zoneDistribution?.[0];
    return topZone ? `${topZone.zone} (${topZone.count})` : '-';
  }
  if (insight.includes('Numero locali')) {
    const topLocali = data.localiDistribution?.[0];
    return topLocali ? `${topLocali.locali} locali (${topLocali.count})` : '-';
  }
  return '-';
}

function getColor(index: number): string {
  const colors = ['#DC2626', '#EA580C', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  return colors[index % colors.length];
}

