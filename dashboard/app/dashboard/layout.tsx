'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, MapPin, BarChart3, CreditCard, Settings, Phone } from 'lucide-react';
import { SupportButton } from '@/components/SupportButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-600">Caricamento...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Lead CRM', href: '/dashboard/leads', icon: FileText },
    { name: 'Chiamate', href: '/dashboard/calls', icon: Phone },
    { name: 'Mappa Zone', href: '/dashboard/zones', icon: MapPin },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Setup', href: '/dashboard/setup', icon: Settings },
    { name: 'Abbonamenti', href: '/dashboard/billing', icon: CreditCard },
  ];

  // Nascondi sidebar su onboarding
  const isOnboarding = pathname === '/dashboard/onboarding';
  const isAdmin = (session.user as any)?.role === 'admin';

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation - Minimal */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <Link href="/dashboard">
                <h1 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  FIXER
                </h1>
              </Link>
              
              {!isOnboarding && (
                <div className="hidden md:flex gap-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                          pathname === item.href
                            ? 'text-slate-900 border-b-2 border-slate-900'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                        pathname.startsWith('/admin')
                          ? 'text-slate-900 border-b-2 border-slate-900'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-slate-600">
                {session.user?.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - More Spacious */}
      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12">
        {children}
      </main>
      
      <SupportButton variant="floating" position="dashboard" />
    </div>
  );
}

