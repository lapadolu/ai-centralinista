'use client';

import Link from 'next/link';
import { Phone, ArrowRight, CheckCircle2, Shield, BarChart3 } from 'lucide-react';
import { SupportButton } from '@/components/SupportButton';

const problems = [
  'Perdi chiamate quando sei occupato',
  'Clienti riattaccano se non rispondi',
  'Segreteria costa €1500+ al mese',
  'Orari limitati (no sera e weekend)',
  'Dati clienti dispersi o persi',
];

const solutions = [
  'AI risponde in 2 secondi, sempre disponibile',
  'Voce naturale italiana, conversazione fluida',
  'Raccoglie informazioni cliente automaticamente',
  'WhatsApp istantaneo con tutti i dati',
  'Dashboard analytics e CRM integrato',
];

const products = [
  {
    title: 'AI Centralinista',
    description: 'Per agenzie immobiliari, studi professionali e piccole imprese',
    price: '€109/mese',
    features: [
      '100 chiamate incluse',
      'Notifiche WhatsApp',
      'Dashboard CRM',
      'Routing zone',
    ],
  },
  {
    title: 'AI Receptionist',
    description: 'Per uffici, coworking e spazi condivisi',
    price: '€149/mese',
    featured: true,
    features: [
      'Prenotazioni sale',
      'Informazioni visitatori',
      'Integrazione accessi',
      'Notifiche team',
    ],
  },
  {
    title: 'AI Customer Service',
    description: 'Per e-commerce, retail e supporto clienti',
    price: '€199/mese',
    features: [
      'Supporto 24/7',
      'Tracking ordini',
      'Risposte automatiche',
      'Integrazione CRM',
    ],
  },
];

const steps = [
  {
    title: 'Setup in 5 minuti',
    description: 'Colleghi il tuo numero, personalizzi l’AI e configuri le zone di interesse.',
  },
  {
    title: 'AI risponde per te',
    description: 'Voce naturale italiana, raccoglie tutte le informazioni importanti.',
  },
  {
    title: 'Notifica WhatsApp',
    description: 'Ricevi nome, telefono e richiesta. Richiami quando vuoi, con tutti i dati.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brick-dark text-sand relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 brick-divider" />
      <SupportButton variant="floating" position="pre-purchase" />
      <nav className="fixed top-0 left-0 right-0 z-40 bg-brick-dark/80 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-semibold tracking-tight brick-gradient-text">
              FIXER
            </div>
            <div className="flex items-center gap-6 text-sm font-medium">
              <Link href="/login" className="text-sand/70 hover:text-sand transition-subtle">
                Accedi
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 brick-gradient text-white rounded-full shadow-brick transition-subtle"
              >
                Inizia ora
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-20 border-b border-white/5">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-sm uppercase tracking-[0.3em] text-sand/60 font-semibold mb-6">
                Centralini Intelligenti per PMI
              </p>
              <h1 className="text-4xl md:text-6xl font-semibold text-white leading-tight brick-gradient-text mb-8">
                Un centralino AI che lavora con la disciplina di un team senior.
            </h1>
              <p className="text-lg text-sand/80 leading-relaxed mb-10 max-w-2xl">
                FIXER risponde alle chiamate 24/7, qualifica i lead e li smista
                automaticamente al tuo team. Professionalità, controllo e reporting in un'unica piattaforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 brick-gradient text-white rounded-full shadow-brick font-semibold transition-subtle"
              >
                Prova gratis 30 giorni
                  <ArrowRight className="w-4 h-4" />
              </Link>
                <Link
                href="#come-funziona"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white/10 rounded-full text-sand/80 hover:text-white hover:border-white/30 transition-subtle"
              >
                Scopri come funziona
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="brick-card brick-card-hover rounded-2xl p-6">
                <h3 className="text-sm uppercase tracking-[0.3em] text-sand/60 mb-4">
                  KPI PRINCIPALI
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Chiamate/giorno', value: '120+' },
                    { label: 'Lead mensili', value: '450+' },
                    { label: 'Tempo risposta', value: '2s' },
                  ].map((kpi) => (
                    <div key={kpi.label}>
                      <div className="text-2xl font-semibold text-white">{kpi.value}</div>
                      <div className="text-xs text-sand/60 mt-1">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="brick-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-brick-accentLight" />
                  <p className="text-sm uppercase tracking-[0.3em] text-sand/60 font-semibold">
                    Integrità e controllo
                  </p>
                </div>
                <p className="text-sand/80 leading-relaxed">
                  Standard enterprise per sicurezza e conformità. Logging, auditing e governance
                  progettati per PMI esigenti.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20 border-b border-white/5">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white brick-gradient-text">
                Il problema
              </h2>
              <div className="space-y-4">
                {problems.map((problem) => (
                  <div key={problem} className="flex gap-4 brick-card rounded-xl p-4">
                    <div className="w-2 h-2 rounded-full bg-brick-accent mt-2" />
                    <p className="text-sand/80 leading-relaxed">{problem}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-white brick-gradient-text">
                La soluzione
              </h2>
              <div className="space-y-4">
                {solutions.map((solution) => (
                  <div key={solution} className="flex gap-4 brick-card rounded-xl p-4">
                    <CheckCircle2 className="w-5 h-5 text-brick-accentLight mt-1" />
                    <p className="text-sand/80 leading-relaxed">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20 border-b border-white/5" id="prodotti">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-sand/60 mb-3">Piani</p>
            <h2 className="text-4xl font-semibold brick-gradient-text">
              Scegli il centralino che cresce con la tua azienda
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.title}
                className={`rounded-2xl p-8 brick-card ${
                  product.featured ? 'border border-brick-accentLight' : ''
                }`}
              >
                <p className="text-sm uppercase tracking-[0.3em] text-sand/60 mb-3">
                  {product.featured ? 'Più scelto' : 'Disponibile'}
                </p>
                <h3 className="text-2xl font-semibold text-white mb-4">{product.title}</h3>
                <p className="text-sand/60 mb-6">{product.description}</p>
                <div className="text-3xl font-semibold text-white mb-6">{product.price}</div>
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sand/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-brick-accentLight" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center px-6 py-3 rounded-full font-semibold transition-subtle ${
                    product.featured
                      ? 'brick-gradient text-white'
                      : 'border border-white/10 text-sand/80 hover:text-white hover:border-white/40'
                  }`}
                >
                  Inizia ora
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20" id="come-funziona">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-[0.3em] text-sand/60 mb-3">Processo</p>
            <h2 className="text-4xl font-semibold brick-gradient-text">Come funziona</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="brick-card rounded-2xl p-6 space-y-3">
                <div className="text-sm uppercase tracking-[0.3em] text-sand/60">Step {index + 1}</div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-sand/70 leading-relaxed">{step.description}</p>
              </div>
            ))}
        </div>
      </section>

        <section className="max-w-6xl mx-auto px-6 lg:px-10 py-20 text-center">
          <div className="brick-card rounded-3xl p-12 space-y-6">
            <h2 className="text-4xl font-semibold brick-gradient-text">
              Pronto a gestire ogni chiamata?
            </h2>
            <p className="text-lg text-sand/70 max-w-2xl mx-auto">
              Setup professionale in 5 minuti, operatori virtuali formati sul tuo business, reporting in tempo reale.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 brick-gradient text-white rounded-full font-semibold transition-subtle"
            >
              Inizia subito
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 text-center text-sm text-sand/60">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/privacy" className="hover:text-sand transition-subtle">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-sand transition-subtle">
              Termini di Servizio
            </Link>
            <Link href="/cookie-policy" className="hover:text-sand transition-subtle">
              Cookie Policy
            </Link>
          </div>
          © 2025 Helping Hand. Tutti i diritti riservati.
        </div>
      </footer>
    </div>
  );
}
