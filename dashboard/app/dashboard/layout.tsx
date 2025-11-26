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
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-cyber-purple animate-pulse">Caricamento...</div>
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
    <div className="min-h-screen bg-cyber-dark relative">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-pattern opacity-10 pointer-events-none" />
      
      {/* Top Navigation - Cyberpunk */}
      <nav className="bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-purple/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-12">
              <Link href="/dashboard">
                <h1 className="text-xl font-black tracking-tight cyber-gradient-text glow-text">
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
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-sm ${
                          pathname === item.href
                            ? 'text-cyber-purple bg-cyber-purple/10 border-b-2 border-cyber-purple glow-text'
                            : 'text-gray-400 hover:text-cyber-purple hover:bg-cyber-purple/5'
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
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-sm ${
                        pathname.startsWith('/admin')
                          ? 'text-cyber-purple bg-cyber-purple/10 border-b-2 border-cyber-purple glow-text'
                          : 'text-gray-400 hover:text-cyber-purple hover:bg-cyber-purple/5'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-400">
                {session.user?.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-gray-400 hover:text-cyber-purple transition-all hover:glow-text"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 lg:px-16 py-12 relative z-10">
        {children}
      </main>
      
      <SupportButton variant="floating" position="dashboard" />
    </div>
  );
}
