import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service - FIXER by Helping Hand',
  description: 'Termini e condizioni di utilizzo del servizio.',
};

export default function TermsPage() {
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
            <FileText className="w-8 h-8 text-red-700" />
            <h1 className="text-4xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Terms of Service
            </h1>
          </div>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
            <p className="text-sm text-slate-500">
              <strong>Ultimo aggiornamento:</strong> Dicembre 2024
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                1. Accettazione dei Termini
              </h2>
              <p>
                Utilizzando il servizio FIXER by Helping Hand, accetti questi Termini di Service. Se non accetti,
                non utilizzare il servizio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                2. Descrizione del Servizio
              </h2>
              <p>
                FIXER by Helping Hand fornisce un servizio di centralino AI che risponde alle chiamate telefoniche,
                raccoglie informazioni dai clienti e le smista automaticamente al tuo team tramite WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                3. Account e Registrazione
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Devi avere almeno 18 anni per utilizzare il servizio</li>
                <li>Sei responsabile di mantenere la sicurezza del tuo account</li>
                <li>Devi fornire informazioni accurate e aggiornate</li>
                <li>Non puoi condividere il tuo account con terzi</li>
                <li>Ci riserviamo il diritto di sospendere account violanti questi termini</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                4. Abbonamenti e Pagamenti
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>I prezzi sono in Euro (€) e possono variare</li>
                <li>I pagamenti sono processati tramite Stripe</li>
                <li>Gli abbonamenti si rinnovano automaticamente salvo cancellazione</li>
                <li>Puoi cancellare in qualsiasi momento dalla dashboard</li>
                <li>Non offriamo rimborsi per periodi già utilizzati</li>
                <li>Il periodo di prova gratuito dura 30 giorni</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                5. Limiti di Utilizzo
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Devi rispettare i limiti di chiamate mensili del tuo piano</li>
                <li>Non puoi utilizzare il servizio per attività illegali</li>
                <li>Non puoi utilizzare il servizio per spam o truffe</li>
                <li>Ci riserviamo il diritto di limitare l'utilizzo in caso di abuso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                6. Proprietà Intellettuale
              </h2>
              <p>
                Il servizio, inclusi software, design, logo e contenuti, sono di proprietà di FIXER by Helping Hand
                o dei suoi licenzianti. Non puoi copiare, modificare o distribuire materiale protetto senza
                autorizzazione.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                7. Limitazione di Responsabilità
              </h2>
              <p>
                Il servizio è fornito "così com'è". Non garantiamo disponibilità al 100% o assenza di errori.
                Non siamo responsabili per perdite di dati, interruzioni di servizio o danni indiretti.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                8. Cancellazione Account
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Puoi cancellare il tuo account in qualsiasi momento dalla dashboard</li>
                <li>La cancellazione è immediata e i dati verranno eliminati entro 30 giorni</li>
                <li>Non offriamo rimborsi per abbonamenti già pagati</li>
                <li>Possiamo sospendere o cancellare account violanti questi termini</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                9. Modifiche ai Termini
              </h2>
              <p>
                Possiamo modificare questi termini in qualsiasi momento. Le modifiche significative saranno
                comunicate via email. L'utilizzo continuato del servizio dopo le modifiche costituisce
                accettazione.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                10. Legge Applicabile
              </h2>
              <p>
                Questi termini sono governati dalla legge italiana. Qualsiasi controversia sarà soggetta
                alla giurisdizione esclusiva dei tribunali italiani.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                11. Contatti
              </h2>
              <p>
                Per domande su questi termini:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-4">
                <li><strong>Email:</strong> support@helping-hand.it</li>
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

