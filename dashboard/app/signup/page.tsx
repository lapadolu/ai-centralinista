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
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyber-pink/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyber-purple transition mb-8 hover:glow-text">
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-4xl font-black tracking-tight cyber-gradient-text glow-text">
                FIXER
              </h1>
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-gray/50 border border-cyber-purple/30 rounded-full text-cyber-purple text-xs font-medium tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              Crea il tuo account
            </div>
          </div>
        </div>

        <div className="bg-cyber-gray/50 border border-cyber-purple/20 rounded-lg p-8 backdrop-blur-sm glow-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-purple/30 focus:border-cyber-purple focus:glow-border outline-none transition-all text-white placeholder-gray-500 rounded-sm"
                placeholder="Mario Rossi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-purple/30 focus:border-cyber-purple focus:glow-border outline-none transition-all text-white placeholder-gray-500 rounded-sm"
                placeholder="email@esempio.it"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-purple/30 focus:border-cyber-purple focus:glow-border outline-none transition-all text-white placeholder-gray-500 rounded-sm"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Conferma password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-purple/30 focus:border-cyber-purple focus:glow-border outline-none transition-all text-white placeholder-gray-500 rounded-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink px-4 py-3 text-sm rounded-sm glow-border">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full cyber-gradient text-white font-bold py-3 px-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyber-lg rounded-sm relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? 'Registrazione in corso...' : 'Crea account'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-pink to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Hai già un account?{' '}
          <Link href="/login" className="text-cyber-purple hover:text-cyber-pink font-semibold hover:glow-text transition-all">
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
}
