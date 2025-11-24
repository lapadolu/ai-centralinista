'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Building2, Phone, MessageCircle } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/firebase';

export default function AdminSetupPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      const statusParam = filter === 'all' ? '' : `?status=${filter}`;
      const response = await fetch(`/api/admin/orders${statusParam}`);
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      pending_setup: { label: 'In Attesa Setup', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      setup_in_progress: { label: 'Setup in Corso', color: 'bg-blue-100 text-blue-800', icon: Clock },
      waiting_activation: { label: 'Attesa Attivazione', color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
      active: { label: 'Attivo', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
      suspended: { label: 'Sospeso', color: 'bg-red-100 text-red-800', icon: AlertCircle },
    };

    const badge = badges[status];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  const statusCounts = {
    all: orders.length,
    pending_setup: orders.filter((o) => o.setup_status === 'pending_setup').length,
    setup_in_progress: orders.filter((o) => o.setup_status === 'setup_in_progress').length,
    waiting_activation: orders.filter((o) => o.setup_status === 'waiting_activation').length,
    active: orders.filter((o) => o.setup_status === 'active').length,
    suspended: orders.filter((o) => o.setup_status === 'suspended').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Caricamento ordini...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
          Setup Ordini
        </h1>
        <p className="text-slate-600">
          Gestisci la configurazione degli agent per i clienti
        </p>
      </div>

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Tutti' },
            { value: 'pending_setup', label: 'In Attesa' },
            { value: 'setup_in_progress', label: 'In Corso' },
            { value: 'waiting_activation', label: 'Attesa Attivazione' },
            { value: 'active', label: 'Attivi' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as OrderStatus | 'all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === tab.value
                  ? 'bg-red-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label} ({statusCounts[tab.value as keyof typeof statusCounts]})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <p className="text-slate-600">Nessun ordine trovato</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/setup/${order.id}`}
              className="block bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusBadge(order.setup_status)}
                    <span className="text-sm text-slate-500">
                      {new Date(order.created_at?.toDate?.() || order.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-red-700" />
                    {order.company_name}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <div className="text-slate-600">Cliente</div>
                      <div className="font-medium text-slate-900">{order.user_name}</div>
                    </div>
                    <div>
                      <div className="text-slate-600">Piano</div>
                      <div className="font-medium text-slate-900 capitalize">{order.subscription_plan}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        Telefono
                      </div>
                      <div className="font-medium text-slate-900">{order.customer_phone}</div>
                    </div>
                    <div>
                      <div className="text-slate-600 flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </div>
                      <div className="font-medium text-slate-900">
                        {order.whatsapp_configs?.length || 0} {order.whatsapp_configs?.length === 1 ? 'numero' : 'numeri'}
                      </div>
                    </div>
                  </div>

                  {order.order_details && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                      <div className="text-xs text-slate-600 mb-1">Note ordine:</div>
                      <div className="text-sm text-slate-900">{order.order_details}</div>
                    </div>
                  )}
                </div>

                <ArrowRight className="w-5 h-5 text-slate-400 ml-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

