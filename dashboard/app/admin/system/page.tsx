'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Database, Cloud, Server, Activity } from 'lucide-react';

interface SystemHealth {
  firestore: {
    status: 'healthy' | 'degraded' | 'down';
    latency: number;
    lastCheck: string;
  };
  vapi: {
    status: 'healthy' | 'degraded' | 'down';
    apiKeyConfigured: boolean;
    lastCheck: string;
  };
  twilio: {
    status: 'healthy' | 'degraded' | 'down';
    accountSidConfigured: boolean;
    lastCheck: string;
  };
  vercel: {
    status: 'healthy' | 'degraded' | 'down';
    deploymentStatus: string;
    lastCheck: string;
  };
  gcp: {
    status: 'healthy' | 'degraded' | 'down';
    functionsDeployed: boolean;
    lastCheck: string;
  };
}

export default function SystemHealthPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHealth();
    const interval = setInterval(loadHealth, 30000); // Refresh ogni 30 secondi
    return () => clearInterval(interval);
  }, []);

  const loadHealth = async () => {
    try {
      const response = await fetch('/api/admin/system-health');
      const data = await response.json();
      
      if (response.ok) {
        setHealth(data);
      }
    } catch (error) {
      console.error('Error loading health:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'down':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-slate-600">Caricamento...</div>
      </div>
    );
  }

  if (!health) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Torna alla dashboard
          </Link>
          <div className="text-center py-12">
            <p className="text-slate-600">Errore nel caricamento dei dati</p>
          </div>
        </div>
      </div>
    );
  }

  const services = [
    { key: 'firestore', label: 'Firestore Database', icon: Database },
    { key: 'vapi', label: 'Vapi.ai API', icon: Cloud },
    { key: 'twilio', label: 'Twilio', icon: Server },
    { key: 'vercel', label: 'Vercel Deployment', icon: Cloud },
    { key: 'gcp', label: 'GCP Functions', icon: Server },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Torna alla dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            System Health
          </h1>
          <p className="text-slate-600">
            Monitoraggio stato dei servizi e infrastruttura
          </p>
        </div>

        <div className="space-y-4">
          {services.map((service) => {
            const serviceHealth = health[service.key as keyof SystemHealth] as any;
            const Icon = service.icon;
            
            return (
              <div
                key={service.key}
                className={`border-2 p-6 ${getStatusColor(serviceHealth.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(serviceHealth.status)}
                    <Icon className="w-6 h-6" />
                    <div>
                      <div className="font-semibold text-slate-900">{service.label}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {serviceHealth.status === 'healthy' && 'Operativo'}
                        {serviceHealth.status === 'degraded' && 'Degradato'}
                        {serviceHealth.status === 'down' && 'Non disponibile'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      Ultimo check: {new Date(serviceHealth.lastCheck).toLocaleTimeString()}
                    </div>
                    {serviceHealth.latency && (
                      <div className="text-xs text-slate-500 mt-1">
                        Latency: {serviceHealth.latency}ms
                      </div>
                    )}
                  </div>
                </div>
                
                {service.key === 'vapi' && (
                  <div className="mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      {serviceHealth.apiKeyConfigured ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>API Key configurata: {serviceHealth.apiKeyConfigured ? 'Sì' : 'No'}</span>
                    </div>
                  </div>
                )}
                
                {service.key === 'twilio' && (
                  <div className="mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      {serviceHealth.accountSidConfigured ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>Account SID configurato: {serviceHealth.accountSidConfigured ? 'Sì' : 'No'}</span>
                    </div>
                  </div>
                )}
                
                {service.key === 'gcp' && (
                  <div className="mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      {serviceHealth.functionsDeployed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>Functions deployate: {serviceHealth.functionsDeployed ? 'Sì' : 'No'}</span>
                    </div>
                  </div>
                )}
                
                {service.key === 'vercel' && (
                  <div className="mt-4 text-sm">
                    <div className="text-slate-700">
                      Status deployment: <span className="font-medium">{serviceHealth.deploymentStatus}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

