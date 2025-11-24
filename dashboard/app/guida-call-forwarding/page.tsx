'use client';

import { useState } from 'react';
import { Phone, Smartphone, Home, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface ProviderGuide {
  name: string;
  mobile: {
    steps: string[];
    codes?: string[];
    app?: string;
    website?: string;
  };
  landline?: {
    steps: string[];
    codes?: string[];
    website?: string;
  };
}

const PROVIDER_GUIDES: Record<string, ProviderGuide> = {
  tim: {
    name: 'TIM',
    mobile: {
      steps: [
        'Chiama il numero gratuito 40916 dal tuo cellulare TIM',
        'Segui le istruzioni vocali o premi 1 per "Servizi"',
        'Premi 2 per "Inoltro chiamate"',
        'Inserisci il numero Twilio che ti abbiamo fornito (formato: +39 XXX XXX XXXX)',
        'Conferma l\'attivazione',
        'Riceverai un SMS di conferma'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      app: 'TIM App',
      website: 'https://www.tim.it'
    },
    landline: {
      steps: [
        'Accedi al tuo account TIM su tim.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio di destinazione',
        'Salva le impostazioni',
        'L\'inoltro sarà attivo entro pochi minuti'
      ],
      website: 'https://www.tim.it'
    }
  },
  vodafone: {
    name: 'Vodafone',
    mobile: {
      steps: [
        'Chiama il numero gratuito 190 dal tuo cellulare Vodafone',
        'Segui le istruzioni vocali',
        'Seleziona "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio (formato: +39 XXX XXX XXXX)',
        'Conferma l\'attivazione',
        'Riceverai un SMS di conferma'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      app: 'MyVodafone App',
      website: 'https://www.vodafone.it'
    },
    landline: {
      steps: [
        'Accedi al tuo account Vodafone su vodafone.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio di destinazione',
        'Salva le impostazioni'
      ],
      website: 'https://www.vodafone.it'
    }
  },
  wind_tre: {
    name: 'Wind Tre',
    mobile: {
      steps: [
        'Chiama il numero gratuito 155 dal tuo cellulare Wind Tre',
        'Segui le istruzioni vocali',
        'Seleziona "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio (formato: +39 XXX XXX XXXX)',
        'Conferma l\'attivazione',
        'Riceverai un SMS di conferma'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      app: 'Wind Tre App',
      website: 'https://www.windtre.it'
    },
    landline: {
      steps: [
        'Accedi al tuo account Wind Tre su windtre.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio di destinazione',
        'Salva le impostazioni'
      ],
      website: 'https://www.windtre.it'
    }
  },
  iliad: {
    name: 'Iliad',
    mobile: {
      steps: [
        'Accedi alla tua area clienti Iliad su iliad.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio (formato: +39 XXX XXX XXXX)',
        'Salva le impostazioni',
        'L\'inoltro sarà attivo entro pochi minuti'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      website: 'https://www.iliad.it'
    }
  },
  fastweb: {
    name: 'Fastweb',
    mobile: {
      steps: [
        'Chiama il numero gratuito 192193 dal tuo cellulare Fastweb',
        'Segui le istruzioni vocali',
        'Seleziona "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio (formato: +39 XXX XXX XXXX)',
        'Conferma l\'attivazione'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      website: 'https://www.fastweb.it'
    },
    landline: {
      steps: [
        'Accedi al tuo account Fastweb su fastweb.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio di destinazione',
        'Salva le impostazioni'
      ],
      website: 'https://www.fastweb.it'
    }
  },
  ho: {
    name: 'Ho Mobile',
    mobile: {
      steps: [
        'Accedi alla tua area clienti Ho Mobile su ho-mobile.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio (formato: +39 XXX XXX XXXX)',
        'Salva le impostazioni'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      website: 'https://www.ho-mobile.it'
    }
  },
  very: {
    name: 'Very Mobile',
    mobile: {
      steps: [
        'Accedi alla tua area clienti Very Mobile su verymobile.it',
        'Vai su "Servizi" → "Inoltro chiamate"',
        'Inserisci il numero Twilio (formato: +39 XXX XXX XXXX)',
        'Salva le impostazioni'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#'],
      website: 'https://www.verymobile.it'
    }
  },
  altro: {
    name: 'Altro Provider',
    mobile: {
      steps: [
        'Contatta il servizio clienti del tuo provider',
        'Chiedi di attivare l\'inoltro chiamate incondizionato',
        'Fornisci il numero Twilio che ti abbiamo dato',
        'Conferma l\'attivazione'
      ],
      codes: ['*21*+39XXXXXXXXX#', 'Per disattivare: #21#']
    },
    landline: {
      steps: [
        'Contatta il servizio clienti del tuo provider',
        'Chiedi di attivare l\'inoltro chiamate',
        'Fornisci il numero Twilio di destinazione',
        'Conferma l\'attivazione'
      ]
    }
  }
};

export default function CallForwardingGuide() {
  const [selectedProvider, setSelectedProvider] = useState<string>('tim');
  const [phoneType, setPhoneType] = useState<'mobile' | 'landline'>('mobile');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const provider = PROVIDER_GUIDES[selectedProvider] || PROVIDER_GUIDES.altro;
  const guide = phoneType === 'mobile' ? provider.mobile : provider.landline || provider.mobile;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Guida all'Attivazione Call Forwarding
          </h1>
          <p className="text-lg text-slate-600">
            Segui questi semplici passaggi per attivare l'inoltro chiamate sul tuo provider
          </p>
        </div>

        {/* Provider Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Seleziona il tuo Provider</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(PROVIDER_GUIDES).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedProvider(key)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedProvider === key
                    ? 'border-red-700 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold">{PROVIDER_GUIDES[key].name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Phone Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Tipo di Linea</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setPhoneType('mobile')}
              className={`flex-1 p-4 rounded-lg border-2 transition flex items-center justify-center gap-3 ${
                phoneType === 'mobile'
                  ? 'border-red-700 bg-red-50 text-red-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              <span className="font-semibold">Mobile</span>
            </button>
            {provider.landline && (
              <button
                onClick={() => setPhoneType('landline')}
                className={`flex-1 p-4 rounded-lg border-2 transition flex items-center justify-center gap-3 ${
                  phoneType === 'landline'
                    ? 'border-red-700 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-semibold">Fisso</span>
              </button>
            )}
          </div>
        </div>

        {/* Steps Guide */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Istruzioni Passo-Passo</h2>
          <div className="space-y-4">
            {guide.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1 text-slate-700">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Codes */}
        {guide.codes && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Codici Rapidi (Mobile)</h2>
            <div className="space-y-3">
              {guide.codes.map((code, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <code className="flex-1 font-mono text-sm text-slate-900">{code}</code>
                  <button
                    onClick={() => copyCode(code)}
                    className="p-2 hover:bg-slate-200 rounded transition"
                    title="Copia"
                  >
                    {copiedCode === code ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Copy className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-3">
              💡 Sostituisci <code className="bg-slate-100 px-1 rounded">+39XXXXXXXXX</code> con il numero Twilio che ti abbiamo fornito
            </p>
          </div>
        )}

        {/* Links */}
        {((guide as any).app || guide.website) && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Link Utili</h2>
            <div className="flex flex-wrap gap-3">
              {(guide as any).app && (
                <a
                  href={guide.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  {(guide as any).app}
                </a>
              )}
              {guide.website && (
                <a
                  href={guide.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  Sito Web
                </a>
              )}
            </div>
          </div>
        )}

        {/* Help */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
          <h3 className="font-semibold text-slate-900 mb-2">Hai bisogno di aiuto?</h3>
          <p className="text-sm text-slate-700 mb-4">
            Se hai difficoltà ad attivare l'inoltro chiamate, contattaci tramite il supporto nel tuo dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition"
          >
            Vai al Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

