import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy - FIXER by Helping Hand',
  description: 'Informativa sulla privacy e gestione dei dati personali.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla home
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-red-700" />
            <h1 className="text-4xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Privacy Policy
            </h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <p className="text-sm text-slate-500">
              <strong>Ultimo aggiornamento:</strong> Dicembre 2024
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                1. Titolare del Trattamento
              </h2>
              <p>
                FIXER by Helping Hand ("noi", "nostro") è il titolare del trattamento dei dati personali raccolti attraverso
                questa piattaforma. Per qualsiasi richiesta relativa alla privacy, contattaci all'indirizzo:
                privacy@helping-hand.it
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                2. Dati Raccolti
              </h2>
              <p>Raccogliamo e trattiamo i seguenti dati personali:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Dati account:</strong> Nome, email, password (criptata)</li>
                <li><strong>Dati pagamento:</strong> Informazioni fornite tramite Stripe (non memorizziamo dati carte)</li>
                <li><strong>Dati chiamate:</strong> Registrazioni, trascrizioni, informazioni clienti dalle chiamate</li>
                <li><strong>Dati utilizzo:</strong> Statistiche di utilizzo del servizio</li>
                <li><strong>Dati tecnici:</strong> Indirizzo IP, tipo browser, dispositivi utilizzati</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                3. Finalità del Trattamento
              </h2>
              <p>Utilizziamo i dati per:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornire e migliorare il servizio di centralino AI</li>
                <li>Gestire account e abbonamenti</li>
                <li>Processare pagamenti e fatturazione</li>
                <li>Inviare notifiche importanti sul servizio</li>
                <li>Rispettare obblighi legali</li>
                <li>Prevenire frodi e abusi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                4. Base Giuridica
              </h2>
              <p>
                Il trattamento dei dati si basa su: esecuzione contratto, consenso, interesse legittimo, e
                adempimento obblighi legali.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                5. Conservazione Dati
              </h2>
              <p>
                Conserviamo i dati per il tempo necessario alle finalità indicate e in conformità agli obblighi
                legali. I dati delle chiamate vengono conservati per la durata del contratto e successivamente
                cancellati secondo procedure automatizzate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                6. Cookie
              </h2>
              <p>
                Utilizziamo cookie essenziali per il funzionamento del sito e cookie analitici (con il tuo
                consenso) per migliorare il servizio. Puoi gestire le preferenze cookie tramite il banner di
                consenso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                7. Tuoi Diritti (GDPR)
              </h2>
              <p>Hai diritto a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accesso:</strong> Richiedere copia dei tuoi dati</li>
                <li><strong>Rettifica:</strong> Correggere dati inesatti</li>
                <li><strong>Cancellazione:</strong> Richiedere cancellazione dei dati ("diritto all'oblio")</li>
                <li><strong>Portabilità:</strong> Ricevere i dati in formato strutturato</li>
                <li><strong>Opposizione:</strong> Opporti al trattamento per motivi legittimi</li>
                <li><strong>Revoca consenso:</strong> Revocare consenso in qualsiasi momento</li>
              </ul>
              <p className="mt-4">
                Per esercitare questi diritti, contattaci all'indirizzo: privacy@helping-hand.it
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                8. Sicurezza
              </h2>
              <p>
                Implementiamo misure di sicurezza tecniche e organizzative per proteggere i dati da accesso
                non autorizzato, perdita o distruzione. Utilizziamo crittografia, firewall, e controlli di
                accesso rigorosi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                9. Condivisione Dati
              </h2>
              <p>
                Non vendiamo i tuoi dati. Condividiamo dati solo con fornitori di servizi essenziali (Stripe
                per pagamenti, Firebase per hosting, Vapi per AI, Twilio per WhatsApp) che rispettano gli
                stessi standard di sicurezza.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                10. Modifiche
              </h2>
              <p>
                Possiamo aggiornare questa Privacy Policy. Le modifiche significative saranno comunicate via
                email o notifica sul sito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                11. Contatti
              </h2>
              <p>
                Per domande sulla privacy o per esercitare i tuoi diritti:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-4">
                <li><strong>Email:</strong> privacy@helping-hand.it</li>
                <li><strong>Indirizzo:</strong> [Da completare con indirizzo legale]</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-red-700 hover:text-red-800 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Torna alla home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

