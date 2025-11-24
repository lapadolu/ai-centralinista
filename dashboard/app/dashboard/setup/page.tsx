'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle2, Phone, AlertCircle, Clock, MessageCircle, ExternalLink } from 'lucide-react';
import { Order } from '@/lib/firebase';
import { PHONE_PROVIDERS, getPhoneProviderLabel } from '@/lib/config';
import Link from 'next/link';

export default function SetupPage() {
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [callForwardingConfirmed, setCallForwardingConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const response = await fetch('/api/orders/current');
      const data = await response.json();

      if (response.ok && data.order) {
        setOrder(data.order);
        setCallForwardingConfirmed(data.order.call_forwarding_enabled || false);
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmForwarding = async () => {
    if (!order) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/confirm-forwarding`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setCallForwardingConfirmed(true);
        setOrder({ ...order, call_forwarding_enabled: true });
        
        // Trigger test call
        await fetch(`/api/orders/${order.id}/test-call`, { method: 'POST' });
        
        alert('Conferma ricevuta! Eseguiamo un test chiamata...');
      } else {
        alert(`Errore: ${data.error || 'Impossibile confermare'}`);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Errore di connessione. Riprova più tardi.');
    } finally {
      setSaving(false);
    }
  };

  const getProviderInstructions = (provider: string): string[] => {
    const instructions: Record<string, string[]> = {
      tim: [
        'Chiama il numero gratuito 119',
        'Seleziona opzione "Servizi"',
        'Chiedi di attivare "Inoltro chiamate"',
        'Indica il numero destinazione:',
        order?.twilio_phone_number || '[numero Twilio]',
        'L\'operatore ti guiderà nel processo',
      ],
      vodafone: [
        'Vai su MyVodafone.it o app MyVodafone',
        'Accedi al tuo account',
        'Vai su "Servizi" → "Servizi Telefonici"',
        'Seleziona "Inoltro chiamate"',
        'Inserisci il numero destinazione:',
        order?.twilio_phone_number || '[numero Twilio]',
        'Conferma l\'attivazione',
      ],
      wind_tre: [
        'Invia SMS al numero 4040',
        'Testo: INOLTRO [numero Twilio]',
        'Oppure chiama 155',
        'Chiedi di attivare "Inoltro chiamate"',
        'Indica il numero destinazione:',
        order?.twilio_phone_number || '[numero Twilio]',
      ],
      iliad: [
        'Vai su iliad.it e accedi',
        'Vai su "I tuoi servizi" → "Gestione chiamate"',
        'Seleziona "Inoltro chiamate"',
        'Inserisci il numero destinazione:',
        order?.twilio_phone_number || '[numero Twilio]',
        'Conferma l\'attivazione',
      ],
      fastweb: [
        'Chiama il servizio clienti Fastweb',
        'Chiedi di attivare "Inoltro chiamate"',
        'Indica il numero destinazione:',
        order?.twilio_phone_number || '[numero Twilio]',
      ],
      default: [
        'Contatta il servizio clienti del tuo provider',
        'Chiedi di attivare "Inoltro chiamate" o "Call Forwarding"',
        'Indica il numero destinazione:',
        order?.twilio_phone_number || '[numero Twilio]',
        'L\'operatore ti guiderà nel processo',
      ],
    };

    return instructions[provider] || instructions.default;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">Caricamento...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Nessun ordine trovato
          </h2>
          <p className="text-slate-600">
            Completa il processo di acquisto per vedere le istruzioni di setup.
          </p>
        </div>
      </div>
    );
  }

  if (order.setup_status === 'pending_setup' || order.setup_status === 'setup_in_progress') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Clock className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Setup in corso
          </h2>
          <p className="text-slate-600 mb-4">
            Il tuo centralino è in fase di configurazione.
          </p>
          <p className="text-sm text-slate-500">
            Riceverai un'email quando l'agent sarà pronto (entro 1 settimana).
          </p>
        </div>
      </div>
    );
  }

  if (order.setup_status === 'active') {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-12 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-green-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Il tuo centralino è attivo!
          </h2>
          <p className="text-green-700 mb-6">
            Tutto è configurato e funzionante. Il tuo centralino AI risponde alle chiamate.
          </p>
          <div className="space-y-2 text-sm text-green-800">
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Numero Twilio: <strong>{order.twilio_phone_number}</strong></span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp configurati: {order.whatsapp_configs?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (order.setup_status === 'waiting_activation') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Il tuo centralino è pronto!
          </h1>
          <p className="text-slate-600">
            Attiva l'inoltro chiamate per completare il setup
          </p>
        </div>

        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Agent configurato con successo
              </h3>
              <p className="text-sm text-green-700">
                Il tuo assistente AI è pronto. Ora devi solo attivare l'inoltro chiamate sul tuo numero esistente.
              </p>
            </div>
          </div>
        </div>

        {/* Twilio Number */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-700" />
            Numero da Inoltrare
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
            <div className="text-sm text-slate-600 mb-2">Numero Twilio</div>
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {order.twilio_phone_number || 'Non ancora configurato'}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Inoltra le chiamate dal tuo numero <strong>{order.customer_phone}</strong> a questo numero
            </p>
          </div>
        </div>

        {/* Instructions */}
        {order.phone_provider && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Istruzioni per {getPhoneProviderLabel(order.phone_provider)}
            </h2>
            <div className="bg-slate-50 rounded-lg p-6 space-y-3">
              {getProviderInstructions(order.phone_provider).map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-900 flex-1">{instruction}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Link
                href="/guida-call-forwarding"
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-red-700 hover:text-red-800 font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                Vedi guida completa con codici rapidi e istruzioni dettagliate
              </Link>
            </div>
          </div>
        )}

        {/* Confirmation */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Conferma Attivazione
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition"
              style={{
                borderColor: callForwardingConfirmed ? '#DC2626' : '#E2E8F0',
                backgroundColor: callForwardingConfirmed ? '#FEF2F2' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={callForwardingConfirmed}
                onChange={(e) => setCallForwardingConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 text-red-700 rounded focus:ring-red-500"
              />
              <div>
                <div className="font-semibold text-slate-900">
                  Ho attivato l'inoltro chiamate
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  Confermo di aver configurato l'inoltro chiamate dal mio numero {order.customer_phone} al numero Twilio sopra indicato.
                </div>
              </div>
            </label>

            <button
              onClick={handleConfirmForwarding}
              disabled={!callForwardingConfirmed || saving || order.call_forwarding_enabled}
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Conferma in corso...
                </>
              ) : order.call_forwarding_enabled ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Inoltro già attivato
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Conferma e Testa Chiamata
                </>
              )}
            </button>

            {order.call_forwarding_enabled && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">Inoltro confermato</span>
                </div>
                <p className="text-sm text-green-600 mt-2">
                  Stiamo testando il tuo centralino. Riceverai conferma quando sarà attivo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

