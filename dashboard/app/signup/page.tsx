'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition mb-8">
            <ArrowLeft className="w-4 h-4" />
            Torna alla home
          </Link>
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <h1 className="text-3xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                FIXER
              </h1>
            </Link>
            <p className="text-slate-600">Crea il tuo account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition"
              placeholder="Mario Rossi"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition"
              placeholder="email@esempio.it"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Conferma password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-slate-50 border border-slate-200 text-slate-900 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrazione in corso...' : 'Crea account'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-600">
          Hai già un account?{' '}
          <Link href="/login" className="text-slate-900 hover:underline font-medium">
            Accedi
          </Link>
        </div>
      </div>
    </div>
  );
}
