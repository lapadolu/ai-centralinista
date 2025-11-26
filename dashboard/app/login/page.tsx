'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email o password non corretti');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brick-dark flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 brick-divider opacity-40 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="mb-12 text-center">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-4xl font-semibold tracking-tight brick-gradient-text">
              FIXER
            </h1>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sand/70 text-xs font-semibold tracking-[0.3em]">
            <Sparkles className="w-3 h-3" />
            Accedi al tuo account
          </div>
        </div>

        <div className="brick-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-sand/80 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-brick-charcoal border border-white/10 focus:border-brick-accent focus:bg-black/20 outline-none transition-subtle text-sand rounded-md"
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
                className="w-full px-4 py-3 bg-brick-charcoal border border-white/10 focus:border-brick-accent focus:bg-black/20 outline-none transition-subtle text-sand rounded-md"
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
              <span className="relative z-10">{loading ? 'Accesso in corso...' : 'Accedi'}</span>
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-sand/60">
          Prima volta?{' '}
          <Link href="/signup" className="text-white font-semibold hover:text-brick-accentLight transition-subtle">
            Registrati
          </Link>
        </div>
      </div>
    </div>
  );
}
