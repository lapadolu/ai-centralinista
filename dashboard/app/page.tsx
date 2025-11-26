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

      {/* Problem/Solution - Cyberpunk Cards */}
      <section className="relative py-32 px-8 lg:px-16 border-t border-cyber-purple/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="scroll-reveal">
              <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-8 backdrop-blur-sm glow-border-hover">
                <h2 className="text-4xl font-bold text-white mb-8 cyber-gradient-text">
                  Il problema
                </h2>
                <div className="space-y-6">
                  {[
                    'Perdi chiamate quando sei occupato',
                    'Clienti riattaccano se non rispondi',
                    'Segreteria costa €1500+ al mese',
                    'Orari limitati (no sera e weekend)',
                    'Dati clienti dispersi o persi'
                  ].map((problem, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-cyber-pink mt-2 flex-shrink-0 animate-glow-pulse" />
                      <div className="text-gray-300 leading-relaxed text-lg">{problem}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="scroll-reveal">
              <div className="bg-cyber-gray/50 border border-cyber-purple/30 rounded-lg p-8 backdrop-blur-sm glow-border-hover">
                <h2 className="text-4xl font-bold text-white mb-8 cyber-gradient-text">
                  La soluzione
                </h2>
                <div className="space-y-6">
                  {[
                    'AI risponde in 2 secondi, sempre disponibile',
                    'Voce naturale italiana, conversazione fluida',
                    'Raccoglie informazioni cliente automaticamente',
                    'WhatsApp istantaneo con tutti i dati',
                    'Dashboard analytics e CRM integrato'
                  ].map((solution, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5 animate-glow-pulse" />
                      <div className="text-gray-200 leading-relaxed text-lg font-medium">{solution}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products - Cyberpunk Cards */}
      <section className="relative py-32 px-8 lg:px-16 border-t border-cyber-purple/20" id="prodotti">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 scroll-reveal text-center">
            <h2 className="text-5xl font-bold text-white mb-4 cyber-gradient-text glow-text">
              I nostri prodotti
            </h2>
            <p className="text-lg text-gray-400">
              Soluzioni complete per ogni esigenza aziendale
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="scroll-reveal bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-8 backdrop-blur-sm glow-border-hover hover:border-cyber-purple/50 transition-all">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-lg bg-cyber-purple/20 flex items-center justify-center mb-6 border border-cyber-purple/30">
                  <Phone className="w-6 h-6 text-cyber-purple" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Centralinista
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Per agenzie immobiliari, studi professionali e piccole imprese
                </p>
              </div>
              <div className="text-4xl font-bold text-white mb-8">
                €109<span className="text-base font-normal text-gray-400">/mese</span>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  '100 chiamate al mese incluse',
                  'Notifiche WhatsApp in tempo reale',
                  'Dashboard CRM completo',
                  'Routing intelligente per zone',
                  'Analytics e statistiche'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-purple flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 border border-cyber-purple/50 text-white font-medium text-sm transition-all hover:border-cyber-purple hover:bg-cyber-purple/10 rounded-sm glow-border-hover"
              >
                Inizia ora
              </Link>
            </div>

            {/* Product 2 - Featured */}
            <div className="scroll-reveal bg-cyber-gray/50 border-2 border-cyber-purple rounded-lg p-8 backdrop-blur-sm relative glow-border-lg">
              <div className="absolute -top-3 left-8">
                <span className="bg-cyber-purple text-white px-4 py-1 text-xs font-bold tracking-wider uppercase rounded-sm shadow-cyber">
                  Disponibile
                </span>
              </div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-lg bg-cyber-purple/30 flex items-center justify-center mb-6 border border-cyber-purple">
                  <Zap className="w-6 h-6 text-cyber-purple" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Receptionist
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Per uffici, coworking e spazi condivisi
                </p>
              </div>
              <div className="text-4xl font-bold text-white mb-8">
                €149<span className="text-base font-normal text-gray-400">/mese</span>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  'Gestione prenotazioni sale riunioni',
                  'Informazioni per visitatori',
                  'Integrazione con sistemi accesso',
                  'Notifiche per il team'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-purple flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 cyber-gradient text-white font-semibold text-sm transition-all hover:shadow-cyber-lg rounded-sm"
              >
                Inizia ora
              </Link>
            </div>

            {/* Product 3 */}
            <div className="scroll-reveal bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-8 backdrop-blur-sm glow-border-hover hover:border-cyber-purple/50 transition-all">
              <div className="mb-8">
                <div className="w-12 h-12 rounded-lg bg-cyber-purple/20 flex items-center justify-center mb-6 border border-cyber-purple/30">
                  <Phone className="w-6 h-6 text-cyber-purple" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Customer Service
                </h3>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Per e-commerce, retail e supporto clienti
                </p>
              </div>
              <div className="text-4xl font-bold text-white mb-8">
                €199<span className="text-base font-normal text-gray-400">/mese</span>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  'Supporto clienti 24/7',
                  'Tracking ordini automatico',
                  'Risposte automatiche a FAQ',
                  'Integrazione con CRM esistenti'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-cyber-purple flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 border border-cyber-purple/50 text-white font-medium text-sm transition-all hover:border-cyber-purple hover:bg-cyber-purple/10 rounded-sm glow-border-hover"
              >
                Inizia ora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Cyberpunk */}
      <section className="relative py-32 px-8 lg:px-16 border-t border-cyber-purple/20" id="come-funziona">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center scroll-reveal">
            <h2 className="text-5xl font-bold text-white mb-4 cyber-gradient-text glow-text">
              Come funziona
            </h2>
            <p className="text-lg text-gray-400">
              Setup in 5 minuti, risultati immediati
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: 'Step 1',
                title: 'Setup in 5 minuti',
                description: 'Colleghi il tuo numero, personalizzi l\'AI con le tue informazioni e configuri le zone di interesse.',
                icon: Zap,
              },
              {
                step: 'Step 2',
                title: 'AI risponde per te',
                description: 'Voce italiana naturale, conversa con i clienti e raccoglie tutte le informazioni importanti in modo automatico.',
                icon: Phone,
              },
              {
                step: 'Step 3',
                title: 'Notifica WhatsApp',
                description: 'Ricevi su WhatsApp nome, telefono e richiesta. Richiami quando vuoi, con tutti i dati a disposizione.',
                icon: CheckCircle2,
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="scroll-reveal text-center">
                  <div className="w-20 h-20 rounded-xl bg-cyber-purple/20 border border-cyber-purple/30 flex items-center justify-center mx-auto mb-6 glow-border">
                    <Icon className="w-10 h-10 text-cyber-purple" />
                  </div>
                  <div className="text-xs font-bold tracking-widest uppercase text-cyber-purple mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final - Cyberpunk */}
      <section className="relative py-32 px-8 lg:px-16 border-t border-cyber-purple/20">
        <div className="max-w-4xl mx-auto text-center scroll-reveal">
          <h2 className="text-6xl font-black text-white mb-6 cyber-gradient-text glow-text">
            Pronto a gestire ogni chiamata?
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light">
            Setup professionale in 5 minuti. Prova gratuita per 30 giorni.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-5 cyber-gradient text-white font-bold text-base transition-all hover:shadow-cyber-lg rounded-sm relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Inizia subito
              <ArrowRight className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </section>

      {/* Footer - Cyberpunk */}
      <footer className="relative py-16 px-8 lg:px-16 border-t border-cyber-purple/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-4 cyber-gradient-text">
              FIXER
            </div>
            <p className="text-sm text-gray-500 mb-8">
              Soluzioni intelligenti per il tuo business
            </p>
            <div className="flex justify-center gap-8 mb-8 text-sm">
              <Link href="/privacy" className="text-gray-500 hover:text-cyber-purple transition-colors hover:glow-text">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-cyber-purple transition-colors hover:glow-text">
                Termini di Servizio
              </Link>
              <Link href="/cookie-policy" className="text-gray-500 hover:text-cyber-purple transition-colors hover:glow-text">
                Cookie Policy
              </Link>
            </div>
            <div className="text-xs text-gray-600">
              © 2025 Helping Hand. Tutti i diritti riservati.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
