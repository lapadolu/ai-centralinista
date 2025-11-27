'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'La password deve essere di almeno 8 caratteri';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'La password deve contenere almeno una lettera maiuscola';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'La password deve contenere almeno una lettera minuscola';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'La password deve contenere almeno un numero';
    }
    if (!/[^A-Za-z0-9]/.test(pwd)) {
      return 'La password deve contenere almeno un carattere speciale (!@#$%^&*)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Le password non coincidono');
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Errore durante la registrazione');
        setLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch (err) {
      setError('Errore di connessione. Riprova più tardi.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brick-dark flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 brick-divider opacity-40 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-sand/60 hover:text-white transition-subtle mb-8">
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-4xl font-semibold tracking-tight brick-gradient-text">
                FIXER
              </h1>
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sand/70 text-xs font-semibold tracking-[0.3em] uppercase">
              <Sparkles className="w-3 h-3" />
              Crea il tuo account
            </div>
          </div>
        </div>

        <div className="brick-card rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label className="block text-sm font-semibold text-sand/80 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-brick-charcoal border border-white/10 focus:border-brick-accent outline-none transition-subtle text-sand rounded-md"
              placeholder="Mario Rossi"
              required
            />
          </div>

          <div>
              <label className="block text-sm font-semibold text-sand/80 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-brick-charcoal border border-white/10 focus:border-brick-accent outline-none transition-subtle text-sand rounded-md"
              placeholder="email@esempio.it"
              required
            />
          </div>

          <div>
              <label className="block text-sm font-semibold text-sand/80 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-brick-charcoal border border-white/10 focus:border-brick-accent outline-none transition-subtle text-sand rounded-md"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
              <label className="block text-sm font-semibold text-sand/80 mb-2">
              Conferma password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-brick-charcoal border border-white/10 focus:border-brick-accent outline-none transition-subtle text-sand rounded-md"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
              <div className="bg-brick-accent/10 border border-brick-accent/40 text-brick-accent px-4 py-3 text-sm rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
              className="w-full brick-gradient text-white font-semibold py-3 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-subtle shadow-brick"
          >
              <span className="relative z-10">{loading ? 'Registrazione in corso...' : 'Crea account'}</span>
          </button>
        </form>
        </div>

        <div className="mt-8 text-center text-sm text-sand/60">
          Hai già un account?{' '}
          <Link href="/login" className="text-white font-semibold hover:text-brick-accentLight transition-subtle">
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
}
