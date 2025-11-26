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
      <div className="min-h-screen bg-brick-dark flex items-center justify-center">
        <div className="text-brick-accent animate-pulse">Caricamento...</div>
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
    <div className="min-h-screen bg-brick-dark relative">
      <div className="fixed inset-0 brick-divider opacity-20 pointer-events-none" />
      
      <nav className="bg-brick-dark/85 backdrop-blur-sm border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <Link href="/dashboard">
                <h1 className="text-xl font-semibold brick-gradient-text">FIXER</h1>
              </Link>
              
              {!isOnboarding && (
                <div className="hidden md:flex gap-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-subtle ${
                          isActive
                            ? 'text-white bg-white/5 border border-white/10'
                            : 'text-sand/60 hover:text-white hover:bg-white/5'
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
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-subtle ${
                        pathname.startsWith('/admin')
                          ? 'text-white bg-white/5 border border-white/10'
                          : 'text-sand/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-sand/60">
                {session.user?.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-sand/60 hover:text-white transition-subtle"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12 relative z-10">
        {children}
      </main>
      
      <SupportButton variant="floating" position="dashboard" />
    </div>
  );
}
