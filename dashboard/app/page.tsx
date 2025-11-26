'use client';

import Link from 'next/link';
import { Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SupportButton } from '@/components/SupportButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SupportButton variant="floating" position="pre-purchase" />
      
      {/* Header - Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-semibold tracking-tight text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              FIXER
            </div>
            <div className="flex items-center gap-8">
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Accedi
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-slate-900 text-white rounded-sm transition-all hover:bg-slate-800 text-sm font-medium"
              >
                Inizia
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Minimal & Spacious */}
      <section className="pt-32 pb-24 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <div className="inline-block mb-8 text-xs font-medium tracking-widest uppercase text-slate-500">
              Centralini Intelligenti
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-slate-900 mb-8 leading-[1.05] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Il tuo business<br />
              non si ferma mai
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed font-light max-w-2xl">
              Assistenti AI che rispondono alle chiamate 24/7, raccolgono lead qualificati e li smistano automaticamente al tuo team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-medium text-sm transition-all hover:bg-slate-800"
              >
                Prova gratis 30 giorni
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#come-funziona"
                className="inline-flex items-center px-8 py-4 border border-slate-300 text-slate-900 font-medium text-sm transition-all hover:border-slate-900"
              >
                Scopri come funziona
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution - Clean */}
      <section className="py-32 px-8 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-24">
            <div>
              <h2 className="text-4xl font-semibold text-slate-900 mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
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
                    <div className="w-1 h-1 rounded-full bg-slate-400 mt-2 flex-shrink-0" />
                    <div className="text-slate-700 leading-relaxed text-lg">{problem}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-semibold text-slate-900 mb-12" style={{ fontFamily: 'Playfair Display, serif' }}>
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
                    <CheckCircle2 className="w-5 h-5 text-slate-900 flex-shrink-0 mt-0.5" />
                    <div className="text-slate-700 leading-relaxed text-lg font-medium">{solution}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products - Minimal Cards */}
      <section className="py-32 px-8 lg:px-16 border-t border-slate-100" id="prodotti">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              I nostri prodotti
            </h2>
            <p className="text-lg text-slate-600">
              Soluzioni complete per ogni esigenza aziendale
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="border border-slate-200 p-12 hover:border-slate-900 transition-colors">
              <div className="mb-8">
                <Phone className="w-8 h-8 text-slate-900 mb-6" />
                <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  AI Centralinista
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Per agenzie immobiliari, studi professionali e piccole imprese
                </p>
              </div>
              <div className="text-4xl font-semibold text-slate-900 mb-8">
                €109<span className="text-base font-normal text-slate-500">/mese</span>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  '100 chiamate al mese incluse',
                  'Notifiche WhatsApp in tempo reale',
                  'Dashboard CRM completo',
                  'Routing intelligente per zone',
                  'Analytics e statistiche'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 border border-slate-900 text-slate-900 font-medium text-sm transition-all hover:bg-slate-900 hover:text-white"
              >
                Inizia ora
              </Link>
            </div>

            {/* Product 2 - Featured */}
            <div className="border-2 border-slate-900 p-12 relative">
              <div className="absolute -top-3 left-8">
                <span className="bg-slate-900 text-white px-4 py-1 text-xs font-medium tracking-wider uppercase">
                  Disponibile
                </span>
              </div>
              <div className="mb-8">
                <Phone className="w-8 h-8 text-slate-900 mb-6" />
                <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  AI Receptionist
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Per uffici, coworking e spazi condivisi
                </p>
              </div>
              <div className="text-4xl font-semibold text-slate-900 mb-8">
                €149<span className="text-base font-normal text-slate-500">/mese</span>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  'Gestione prenotazioni sale riunioni',
                  'Informazioni per visitatori',
                  'Integrazione con sistemi accesso',
                  'Notifiche per il team'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 bg-slate-900 text-white font-medium text-sm transition-all hover:bg-slate-800"
              >
                Inizia ora
              </Link>
            </div>

            {/* Product 3 */}
            <div className="border border-slate-200 p-12 hover:border-slate-900 transition-colors">
              <div className="mb-8">
                <Phone className="w-8 h-8 text-slate-900 mb-6" />
                <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                  AI Customer Service
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Per e-commerce, retail e supporto clienti
                </p>
              </div>
              <div className="text-4xl font-semibold text-slate-900 mb-8">
                €199<span className="text-base font-normal text-slate-500">/mese</span>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  'Supporto clienti 24/7',
                  'Tracking ordini automatico',
                  'Risposte automatiche a FAQ',
                  'Integrazione con CRM esistenti'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 border border-slate-900 text-slate-900 font-medium text-sm transition-all hover:bg-slate-900 hover:text-white"
              >
                Inizia ora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Minimal */}
      <section className="py-32 px-8 lg:px-16 border-t border-slate-100" id="come-funziona">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Come funziona
            </h2>
            <p className="text-lg text-slate-600">
              Setup in 5 minuti, risultati immediati
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-6">Step 1</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Setup in 5 minuti
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Colleghi il tuo numero, personalizzi l'AI con le tue informazioni e configuri le zone di interesse.
              </p>
            </div>

            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-6">Step 2</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                AI risponde per te
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Voce italiana naturale, conversa con i clienti e raccoglie tutte le informazioni importanti in modo automatico.
              </p>
            </div>

            <div>
              <div className="text-xs font-medium tracking-widest uppercase text-slate-500 mb-6">Step 3</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Notifica WhatsApp
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Ricevi su WhatsApp nome, telefono e richiesta. Richiami quando vuoi, con tutti i dati a disposizione.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Minimal */}
      <section className="py-32 px-8 lg:px-16 border-t border-slate-100 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-semibold text-slate-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Pronto a gestire ogni chiamata?
          </h2>
          <p className="text-xl text-slate-600 mb-12 font-light">
            Setup professionale in 5 minuti. Prova gratuita per 30 giorni.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-medium text-sm transition-all hover:bg-slate-800"
          >
            Inizia subito
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-16 px-8 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              FIXER
            </div>
            <p className="text-sm text-slate-500 mb-8">
              Soluzioni intelligenti per il tuo business
            </p>
            <div className="flex justify-center gap-8 mb-8 text-sm">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-900 transition-colors">
                Termini di Servizio
              </Link>
              <Link href="/cookie-policy" className="text-slate-500 hover:text-slate-900 transition-colors">
                Cookie Policy
              </Link>
            </div>
            <div className="text-xs text-slate-400">
              © 2025 Helping Hand. Tutti i diritti riservati.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
