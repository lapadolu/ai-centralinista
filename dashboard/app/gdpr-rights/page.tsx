'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function GdprRightsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    requestType: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Qui implementeresti l'invio della richiesta
    // Per ora simuliamo il successo
    setSubmitted(true);
  };

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
            <Shield className="w-8 h-8 text-slate-900" />
            <h1 className="text-4xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Esercita i Tuoi Diritti GDPR
            </h1>
          </div>
          <p className="text-slate-600">
            In conformità con il Regolamento Generale sulla Protezione dei Dati (GDPR), hai diritto a:
          </p>
        </div>

        <div className="space-y-6 mb-12">
          <div className="border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diritto di Accesso
            </h3>
            <p className="text-sm text-slate-600">
              Richiedi una copia di tutti i dati personali che conserviamo su di te.
            </p>
          </div>

          <div className="border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diritto di Rettifica
            </h3>
            <p className="text-sm text-slate-600">
              Correggi dati inesatti o incompleti nel tuo account.
            </p>
          </div>

          <div className="border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diritto alla Cancellazione (Diritto all'Oblio)
            </h3>
            <p className="text-sm text-slate-600">
              Richiedi la cancellazione dei tuoi dati personali quando non sono più necessari.
            </p>
          </div>

          <div className="border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diritto alla Portabilità dei Dati
            </h3>
            <p className="text-sm text-slate-600">
              Ricevi i tuoi dati in un formato strutturato e comunemente utilizzato.
            </p>
          </div>

          <div className="border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diritto di Opposizione
            </h3>
            <p className="text-sm text-slate-600">
              Opporti al trattamento dei tuoi dati per motivi legittimi.
            </p>
          </div>

          <div className="border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Diritto di Revoca del Consenso
            </h3>
            <p className="text-sm text-slate-600">
              Revoca il consenso al trattamento dei dati in qualsiasi momento.
            </p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="border border-slate-200 p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Invia una Richiesta
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Email associata all'account *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Tipo di Richiesta *
              </label>
              <select
                value={formData.requestType}
                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                required
              >
                <option value="">Seleziona...</option>
                <option value="access">Accesso ai dati</option>
                <option value="rectification">Rettifica dati</option>
                <option value="deletion">Cancellazione dati</option>
                <option value="portability">Portabilità dati</option>
                <option value="objection">Opposizione al trattamento</option>
                <option value="consent-withdrawal">Revoca consenso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Messaggio (opzionale)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none"
                placeholder="Aggiungi dettagli sulla tua richiesta..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 transition"
            >
              Invia Richiesta
            </button>

            <p className="text-xs text-slate-500">
              Processeremo la tua richiesta entro 30 giorni come previsto dal GDPR.
              Potremmo richiedere una verifica dell'identità per sicurezza.
            </p>
          </form>
        ) : (
          <div className="border-2 border-green-200 bg-green-50 p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">Richiesta Inviata</h3>
            <p className="text-green-700">
              Abbiamo ricevuto la tua richiesta. Ti risponderemo all'indirizzo email fornito entro 30 giorni.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm text-green-700 hover:underline"
            >
              Invia un'altra richiesta
            </button>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link
            href="/privacy"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Leggi la Privacy Policy completa →
          </Link>
        </div>
      </div>
    </div>
  );
}

