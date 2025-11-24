'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Phone, MessageCircle, Building2, Settings, Sparkles, Save } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/firebase';
import { PHONE_PROVIDERS, getPhoneProviderLabel } from '@/lib/config';

export default function OrderSetupPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Vapi Assistant Config
  const [vapiConfig, setVapiConfig] = useState({
    prompt: '',
    voice: '21m00Tcm4TlvDq8ikWAM', // Default 11labs voice
    first_message: '',
    end_call_function_enabled: true,
    response_mode: 'immediate' as 'immediate' | 'missed_call_only',
  });

  // Setup Verification
  const [verification, setVerification] = useState({
    vapi_agent_created: false,
    vapi_agent_test_passed: false,
    twilio_number_purchased: false,
    twilio_whatsapp_connected: false,
    webhook_configured: false,
  });

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
        
        // Inizializza Vapi config se presente o con default
        if (data.order.vapi_assistant_config) {
          setVapiConfig(data.order.vapi_assistant_config);
        } else {
          // Default config basato su order
          setVapiConfig({
            prompt: generateDefaultPrompt(data.order),
            voice: '21m00Tcm4TlvDq8ikWAM',
            first_message: generateDefaultFirstMessage(data.order),
            end_call_function_enabled: true,
            response_mode: data.order.response_mode || 'immediate',
          });
        }

        // Inizializza verification se presente
        if (data.order.setup_verification) {
          setVerification(data.order.setup_verification);
        }
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDefaultPrompt = (order: Order): string => {
    return `Sei l'assistente virtuale di ${order.company_name}, un'azienda nel settore ${order.industry}.

Il tuo compito è:
- Rispondere in modo professionale e amichevole
- Raccogliere tutte le informazioni necessarie dal cliente
- Trascrivere tutto nel structured output richiesto
- Concludere la chiamata con un follow-up appropriato

Struttura la conversazione per essere efficiente e raccogliere tutte le informazioni necessarie.`;
  };

  const generateDefaultFirstMessage = (order: Order): string => {
    return `Buongiorno, sono l'assistente virtuale di ${order.company_name}. Come posso aiutarla oggi?`;
  };

  const handleCreateVapiAssistant = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/create-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vapi_config: vapiConfig,
          structured_output: order?.whatsapp_configs[0]?.structured_output_config || { fields: [] },
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Aggiorna order e verification
        setOrder({ ...order!, vapi_assistant_id: data.assistant_id, vapi_assistant_config: vapiConfig });
        setVerification({ ...verification, vapi_agent_created: true });
        alert('Agent Vapi creato con successo!');
      } else {
        alert(`Errore: ${data.error || 'Impossibile creare agent'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Errore: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePurchaseTwilioNumber = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/purchase-twilio-number`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setOrder({ ...order!, twilio_phone_number: data.phone_number, twilio_sid: data.sid });
        setVerification({ ...verification, twilio_number_purchased: true });
        alert(`Numero Twilio acquistato: ${data.phone_number}`);
      } else {
        alert(`Errore: ${data.error || 'Impossibile acquistare numero'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Errore: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyAll = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/verify-setup`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setVerification(data.verification);
        alert('Verifica completata! Controlla lo stato di ogni componente.');
      } else {
        alert(`Errore: ${data.error || 'Impossibile verificare setup'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Errore: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async () => {
    if (!window.confirm('Confermi che l\'agent è pronto e vuoi notificare il cliente?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/activate`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setOrder({ ...order!, setup_status: 'waiting_activation' });
        alert('Cliente notificato! L\'ordine è in attesa di attivazione.');
        router.push('/admin/setup');
      } else {
        alert(`Errore: ${data.error || 'Impossibile attivare ordine'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Errore: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Caricamento ordine...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600 mb-4">Ordine non trovato</p>
          <Link href="/admin/setup" className="text-red-700 hover:text-red-800 font-semibold">
            Torna alla lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/setup" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition mb-4">
            <ArrowLeft className="w-4 h-4" />
            Torna alla lista
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Setup Ordine: {order.company_name}
          </h1>
          <p className="text-slate-600">
            Ordine #{order.id} - {order.industry}
          </p>
        </div>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-red-700" />
          Informazioni Ordine
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-slate-600">Cliente</div>
            <div className="font-medium text-slate-900">{order.user_name}</div>
            <div className="text-sm text-slate-500">{order.user_id}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Telefono
            </div>
            <div className="font-medium text-slate-900">{order.customer_phone}</div>
            <div className="text-sm text-slate-500">{getPhoneProviderLabel(order.phone_provider)}</div>
          </div>
          <div>
            <div className="text-sm text-slate-600 flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </div>
            <div className="font-medium text-slate-900">
              {order.whatsapp_configs?.length || 0} {order.whatsapp_configs?.length === 1 ? 'numero' : 'numeri'}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Piano</div>
            <div className="font-medium text-slate-900 capitalize">{order.subscription_plan}</div>
          </div>
        </div>

        {order.order_details && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-1">Note Ordine:</div>
            <div className="text-sm text-slate-900">{order.order_details}</div>
          </div>
        )}

        {/* WhatsApp Configs */}
        {order.whatsapp_configs && order.whatsapp_configs.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium text-slate-700 mb-3">Configurazioni WhatsApp:</div>
            <div className="space-y-3">
              {order.whatsapp_configs.map((config, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-medium text-slate-900">
                    #{index + 1}: {config.whatsapp_number}
                    {config.whatsapp_name && ` (${config.whatsapp_name})`}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {config.structured_output_config.fields.length} campi structured output
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Vapi Assistant Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-700" />
          Configurazione Vapi Assistant
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Prompt Agent *
            </label>
            <textarea
              value={vapiConfig.prompt}
              onChange={(e) => setVapiConfig({ ...vapiConfig, prompt: e.target.value })}
              rows={8}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none font-mono text-sm"
              placeholder="Inserisci il prompt per l'assistente..."
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Questo prompt definisce il comportamento dell'assistente AI
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Message *
              </label>
              <textarea
                value={vapiConfig.first_message}
                onChange={(e) => setVapiConfig({ ...vapiConfig, first_message: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                placeholder="Primo messaggio dell'assistente..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Voice ID (11labs)
              </label>
              <input
                type="text"
                value={vapiConfig.voice}
                onChange={(e) => setVapiConfig({ ...vapiConfig, voice: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                placeholder="21m00Tcm4TlvDq8ikWAM"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Response Mode
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                style={{
                  borderColor: vapiConfig.response_mode === 'immediate' ? '#DC2626' : '#E2E8F0',
                  backgroundColor: vapiConfig.response_mode === 'immediate' ? '#FEF2F2' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="response_mode"
                  value="immediate"
                  checked={vapiConfig.response_mode === 'immediate'}
                  onChange={(e) => setVapiConfig({ ...vapiConfig, response_mode: e.target.value as 'immediate' | 'missed_call_only' })}
                  className="w-4 h-4 text-red-700 focus:ring-red-500"
                />
                <div>
                  <div className="font-semibold text-slate-900">Risposta Immediata</div>
                  <div className="text-sm text-slate-600">Agent risponde subito a tutte le chiamate</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                style={{
                  borderColor: vapiConfig.response_mode === 'missed_call_only' ? '#DC2626' : '#E2E8F0',
                  backgroundColor: vapiConfig.response_mode === 'missed_call_only' ? '#FEF2F2' : 'transparent',
                }}
              >
                <input
                  type="radio"
                  name="response_mode"
                  value="missed_call_only"
                  checked={vapiConfig.response_mode === 'missed_call_only'}
                  onChange={(e) => setVapiConfig({ ...vapiConfig, response_mode: e.target.value as 'immediate' | 'missed_call_only' })}
                  className="w-4 h-4 text-red-700 focus:ring-red-500"
                />
                <div>
                  <div className="font-semibold text-slate-900">Solo Chiamate Perse</div>
                  <div className="text-sm text-slate-600">Agent risponde solo se cliente non risponde</div>
                </div>
              </label>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Scelto dal cliente: <strong>{order.response_mode === 'immediate' ? 'Risposta Immediata' : 'Solo Chiamate Perse'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={vapiConfig.end_call_function_enabled}
              onChange={(e) => setVapiConfig({ ...vapiConfig, end_call_function_enabled: e.target.checked })}
              className="w-4 h-4 text-red-700 rounded focus:ring-red-500"
            />
            <label className="text-sm font-medium text-slate-700">
              End Call Function Abilitato
            </label>
          </div>

          <button
            onClick={handleCreateVapiAssistant}
            disabled={saving || !vapiConfig.prompt || !vapiConfig.first_message}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creazione in corso...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Crea Agent Vapi
              </>
            )}
          </button>
        </div>
      </div>

      {/* Setup Verification */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-red-700" />
          Verifica Setup
        </h2>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {verification.vapi_agent_created ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
              <span className="font-medium text-slate-900">Vapi Agent creato</span>
            </div>
            {order.vapi_assistant_id && (
              <span className="text-xs text-slate-500 font-mono">{order.vapi_assistant_id}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {verification.vapi_agent_test_passed ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
              <span className="font-medium text-slate-900">Vapi Agent test passato</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {verification.twilio_number_purchased ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
              <span className="font-medium text-slate-900">Twilio Number acquistato</span>
            </div>
            {order.twilio_phone_number && (
              <span className="text-xs text-slate-500 font-mono">{order.twilio_phone_number}</span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {verification.twilio_whatsapp_connected ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
              <span className="font-medium text-slate-900">Twilio WhatsApp connesso</span>
            </div>
            <span className="text-xs text-slate-500">
              {order.whatsapp_configs?.filter((wc) => wc.enabled).length || 0} di {order.whatsapp_configs?.length || 0}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {verification.webhook_configured ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-slate-400" />
              )}
              <span className="font-medium text-slate-900">Webhook configurato</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleVerifyAll}
            disabled={saving}
            className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verifica Tutto
          </button>
        </div>
      </div>

      {/* Twilio Number */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-700" />
          Numero Twilio
        </h2>

        {order.twilio_phone_number ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="font-semibold text-green-900 mb-1">Numero acquistato:</div>
            <div className="text-lg font-mono text-green-700">{order.twilio_phone_number}</div>
            <div className="text-sm text-green-600 mt-2">SID: {order.twilio_sid}</div>
          </div>
        ) : (
          <div>
            <p className="text-slate-600 mb-4">
              Acquista un numero Twilio per questo cliente. Il numero verrà collegato all'agent Vapi.
            </p>
            <button
              onClick={handlePurchaseTwilioNumber}
              disabled={saving || !order.vapi_assistant_id}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Acquisto in corso...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  Acquista Numero Twilio
                </>
              )}
            </button>
            {!order.vapi_assistant_id && (
              <p className="text-sm text-red-600 mt-2">
                Crea prima l'agent Vapi per acquistare il numero
              </p>
            )}
          </div>
        )}
      </div>

      {/* Activation */}
      {order.setup_status !== 'active' && order.setup_status !== 'waiting_activation' && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Attivazione</h2>
          
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-slate-700">
              Quando tutti i componenti sono configurati e verificati, puoi attivare l'ordine.
              Il cliente riceverà un'email con le istruzioni per attivare l'inoltro chiamate.
            </p>
          </div>

          <button
            onClick={handleActivate}
            disabled={saving || !order.vapi_assistant_id || !order.twilio_phone_number}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Attivazione in corso...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Agent Pronto - Notifica Cliente
              </>
            )}
          </button>

          {(!order.vapi_assistant_id || !order.twilio_phone_number) && (
            <p className="text-sm text-slate-600 mt-2 text-center">
              Completa la configurazione Vapi Agent e Twilio Number prima di attivare
            </p>
          )}
        </div>
      )}

      {order.setup_status === 'waiting_activation' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Ordine in attesa di attivazione</h3>
          </div>
          <p className="text-sm text-blue-700">
            Il cliente è stato notificato e deve attivare l'inoltro chiamate. 
            Una volta attivato, l'ordine passerà automaticamente a "attivo".
          </p>
        </div>
      )}

      {order.setup_status === 'active' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Ordine Attivo</h3>
          </div>
          <p className="text-sm text-green-700">
            Il centralino è attivo e funzionante. Il cliente può ricevere chiamate.
          </p>
        </div>
      )}
    </div>
  );
}

