'use client';

import Link from 'next/link';
import { Phone, Zap, TrendingUp, CheckCircle2, XCircle, ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { SupportButton } from '@/components/SupportButton';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SupportButton variant="floating" position="pre-purchase" />
      {/* Header - Elegant */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-semibold tracking-tight text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                FIXER
                <span className="text-lg font-normal ml-2 opacity-90">by Helping Hand</span>
              </div>
              <div className="hidden md:block h-6 w-px bg-slate-700/50"></div>
              <div className="hidden md:block text-xs text-slate-400 font-medium tracking-widest uppercase">
                Enterprise Solutions
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="#prodotti"
                className="hidden md:block text-sm text-slate-300 hover:text-white transition font-medium"
              >
                Prodotti
              </Link>
              <Link
                href="#prezzi"
                className="hidden md:block text-sm text-slate-300 hover:text-white transition font-medium"
              >
                Prezzi
              </Link>
              <Link
                href="/login"
                className="text-sm text-slate-300 hover:text-white transition font-medium"
              >
                Accedi
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg transition font-semibold shadow-lg shadow-red-900/30 text-sm"
              >
                Inizia subito
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero - Professional & Elegant */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Red accent gradient - more subtle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-red-900/15 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/40 border border-red-900/20 rounded-full text-red-200/90 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="w-2 h-2 bg-red-500/80 rounded-full animate-pulse"></span>
              Soluzioni enterprise per piccole e medie imprese
            </div>
            
            <h1 className="text-6xl md:text-7xl font-semibold text-white mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              Il tuo business<br />
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                non si ferma mai
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Assistenti AI che rispondono alle chiamate 24/7, raccolgono lead qualificati<br className="hidden md:block" />
              e li smistano automaticamente al tuo team.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="group relative px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-xl font-semibold text-base transition-all shadow-xl shadow-red-900/40 hover:shadow-2xl hover:shadow-red-900/60 hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Prova gratis 30 giorni
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <a
                href="#come-funziona"
                className="px-8 py-4 bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-sm text-white rounded-xl font-semibold text-base transition-all border border-slate-700/50 hover:border-slate-600"
              >
                Scopri come funziona
              </a>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500/80" />
                <span>Setup in 5 minuti</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500/80" />
                <span>Zero contratti lunghi</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500/80" />
                <span>Cancella quando vuoi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution - Cleaner */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Problems */}
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                Il problema
              </h2>
              <div className="space-y-5">
                {[
                  'Perdi chiamate quando sei occupato',
                  'Clienti riattaccano se non rispondi',
                  'Segreteria costa €1500+ al mese',
                  'Orari limitati (no sera e weekend)',
                  'Dati clienti dispersi o persi'
                ].map((problem, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-slate-700 leading-relaxed">{problem}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-3xl font-semibold text-slate-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                La soluzione
              </h2>
              <div className="space-y-5">
                {[
                  'AI risponde in 2 secondi, sempre disponibile',
                  'Voce naturale italiana, conversazione fluida',
                  'Raccoglie informazioni cliente automaticamente',
                  'WhatsApp istantaneo con tutti i dati',
                  'Dashboard analytics e CRM integrato'
                ].map((solution, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-slate-700 font-medium leading-relaxed">{solution}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products - All Available */}
      <section className="py-20" id="prodotti">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              I nostri prodotti
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Soluzioni complete per ogni esigenza aziendale
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Product 1 - AI Centralinista */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7 text-red-700" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                AI Centralinista
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Per agenzie immobiliari, studi professionali e piccole imprese
              </p>
              <div className="text-3xl font-semibold text-slate-900 mb-6">
                €109<span className="text-base font-normal text-slate-600">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>100 chiamate al mese incluse</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Notifiche WhatsApp in tempo reale</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Dashboard CRM completo</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Routing intelligente per zone</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Analytics e statistiche</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg font-semibold transition shadow-sm"
              >
                Inizia ora
              </Link>
            </div>

            {/* Product 2 - AI Receptionist */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-red-600 p-8 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Disponibile ora
                </span>
              </div>
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-red-700" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                AI Receptionist
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Per uffici, coworking e spazi condivisi
              </p>
              <div className="text-3xl font-semibold text-slate-900 mb-6">
                €149<span className="text-base font-normal text-slate-600">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Gestione prenotazioni sale riunioni</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Informazioni per visitatori</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Integrazione con sistemi accesso</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Notifiche per il team</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg font-semibold transition shadow-sm"
              >
                Inizia ora
              </Link>
            </div>

            {/* Product 3 - AI Customer Service */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-red-700" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                AI Customer Service
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Per e-commerce, retail e supporto clienti
              </p>
              <div className="text-3xl font-semibold text-slate-900 mb-6">
                €199<span className="text-base font-normal text-slate-600">/mese</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Supporto clienti 24/7</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Tracking ordini automatico</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Risposte automatiche a FAQ</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Integrazione con CRM esistenti</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white rounded-lg font-semibold transition shadow-sm"
              >
                Inizia ora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-slate-50" id="come-funziona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-slate-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Come funziona
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Setup in 5 minuti, risultati immediati
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-red-700" />
              </div>
              <div className="text-sm font-semibold text-red-700 mb-3 tracking-wider uppercase">Step 1</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Setup in 5 minuti
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Colleghi il tuo numero, personalizzi l'AI con le tue informazioni e configuri le zone di interesse.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-red-700" />
              </div>
              <div className="text-sm font-semibold text-red-700 mb-3 tracking-wider uppercase">Step 2</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                AI risponde per te
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Voce italiana naturale, conversa con i clienti e raccoglie tutte le informazioni importanti in modo automatico.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-10 h-10 text-red-700" />
              </div>
              <div className="text-sm font-semibold text-red-700 mb-3 tracking-wider uppercase">Step 3</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Notifica WhatsApp
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Ricevi su WhatsApp nome, telefono e richiesta. Richiami quando vuoi, con tutti i dati a disposizione.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-red-800 to-red-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-semibold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Pronto a gestire ogni chiamata?
          </h2>
          <p className="text-xl text-red-100/90 mb-10 font-light">
            Setup professionale in 5 minuti. Prova gratuita per 30 giorni.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-900 rounded-xl font-semibold text-base hover:bg-red-50 transition shadow-xl"
          >
            Inizia subito
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              FIXER by Helping Hand
            </div>
            <p className="text-sm text-slate-500 mb-8">
              Soluzioni intelligenti per il tuo business
            </p>
            <div className="flex justify-center gap-8 mb-8 text-sm">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-300 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-300 transition">
                Termini di Servizio
              </Link>
            </div>
            <div className="text-xs text-slate-600">
              © 2025 Helping Hand. Tutti i diritti riservati.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
