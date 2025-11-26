import Link from 'next/link';
import { Cookie, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Cookie Policy - FIXER by Helping Hand',
  description: 'Informativa sull\'utilizzo dei cookie.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 lg:px-16 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Cookie className="w-8 h-8 text-slate-900" />
            <h1 className="text-4xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cookie Policy
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            <strong>Ultimo aggiornamento:</strong> Gennaio 2025
          </p>
        </div>

        <div className="space-y-8 text-slate-700">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cosa sono i Cookie
            </h2>
            <p className="leading-relaxed">
              I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web.
              Vengono utilizzati per migliorare la tua esperienza di navigazione e per fornire funzionalità essenziali.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Tipi di Cookie Utilizzati
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-slate-900 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Cookie Essenziali</h3>
                <p className="text-sm leading-relaxed">
                  Questi cookie sono necessari per il funzionamento del sito e non possono essere disattivati.
                  Includono cookie per autenticazione, sicurezza e preferenze di sessione.
                </p>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Cookie di autenticazione (NextAuth.js)</li>
                  <li>Cookie di sessione</li>
                  <li>Cookie di sicurezza</li>
                </ul>
              </div>

              <div className="border-l-4 border-slate-400 pl-4">
                <h3 className="font-semibold text-slate-900 mb-2">Cookie Analitici</h3>
                <p className="text-sm leading-relaxed">
                  Questi cookie ci aiutano a comprendere come i visitatori interagiscono con il sito,
                  raccogliendo informazioni in forma anonima. Richiedono il tuo consenso.
                </p>
                <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                  <li>Cookie di analisi utilizzo (se configurati)</li>
                  <li>Cookie di performance</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Gestione dei Cookie
            </h2>
            <p className="leading-relaxed mb-4">
              Puoi gestire le tue preferenze sui cookie in qualsiasi momento:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Attraverso il banner di consenso che appare alla prima visita</li>
              <li>Modificando le impostazioni del tuo browser</li>
              <li>Contattandoci all'indirizzo privacy@helping-hand.it</li>
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              <strong>Nota:</strong> Disabilitare i cookie essenziali potrebbe compromettere il funzionamento del sito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Cookie di Terze Parti
            </h2>
            <p className="leading-relaxed mb-4">
              Utilizziamo servizi di terze parti che potrebbero impostare cookie:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stripe:</strong> Per processare pagamenti (cookie essenziali)</li>
              <li><strong>Vercel:</strong> Per hosting e analytics (se configurato)</li>
              <li><strong>Firebase:</strong> Per database e autenticazione (cookie essenziali)</li>
            </ul>
            <p className="mt-4 text-sm text-slate-600">
              Questi servizi hanno le proprie policy sui cookie. Ti invitiamo a consultarle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Durata dei Cookie
            </h2>
            <p className="leading-relaxed">
              I cookie possono essere:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li><strong>Cookie di sessione:</strong> Eliminati quando chiudi il browser</li>
              <li><strong>Cookie persistenti:</strong> Rimangono sul dispositivo per un periodo specifico (es. 365 giorni per il consenso)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Contatti
            </h2>
            <p className="leading-relaxed">
              Per domande sui cookie o per modificare le tue preferenze:
            </p>
            <ul className="list-none pl-0 space-y-2 mt-4">
              <li><strong>Email:</strong> privacy@helping-hand.it</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-900 hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
        </div>
      </div>
    </div>
  );
}

