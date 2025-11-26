'use client';

import Link from 'next/link';
import { Phone, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react';
import { SupportButton } from '@/components/SupportButton';
import { useEffect, useRef } from 'react';

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-dark pointer-events-none" />
      
      {/* Glow Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyber-purple/20 rounded-full blur-3xl pointer-events-none animate-float" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-cyber-pink/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '1s' }} />

      <SupportButton variant="floating" position="pre-purchase" />
      
      {/* Header - Cyberpunk */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-purple/20">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold tracking-tight cyber-gradient-text glow-text">
              FIXER
            </div>
            <div className="flex items-center gap-8">
              <Link
                href="/login"
                className="text-sm text-gray-300 hover:text-white transition-all font-medium hover:glow-text"
              >
                Accedi
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 cyber-gradient text-white rounded-sm transition-all hover:shadow-cyber-pink font-semibold text-sm relative overflow-hidden group"
              >
                <span className="relative z-10">Inizia</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Cyberpunk */}
      <section className="relative pt-32 pb-24 px-8 lg:px-16 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="mb-16 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-gray border border-cyber-purple/30 rounded-full mb-8 text-xs font-medium tracking-widest uppercase text-cyber-purple glow-border">
              <Sparkles className="w-3 h-3" />
              Centralini Intelligenti
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight cyber-gradient-text glow-text">
              Il tuo business<br />
              <span className="text-white">non si ferma mai</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed font-light max-w-3xl">
              Assistenti AI che rispondono alle chiamate 24/7, raccolgono lead qualificati e li smistano automaticamente al tuo team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 cyber-gradient text-white rounded-sm transition-all hover:shadow-cyber-lg font-semibold text-sm relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Prova gratis 30 giorni
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <a
                href="#come-funziona"
                className="inline-flex items-center px-8 py-4 border border-cyber-purple/50 text-white font-medium text-sm transition-all hover:border-cyber-purple hover:glow-border rounded-sm bg-cyber-gray/50 backdrop-blur-sm"
              >
                Scopri come funziona
              </a>
            </div>
          </div>
        </div>
      </section>

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
