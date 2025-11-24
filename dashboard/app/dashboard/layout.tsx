'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, MapPin, BarChart3, CreditCard, Settings } from 'lucide-react';
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
    { name: 'Mappa Zone', href: '/dashboard/zones', icon: MapPin },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Setup', href: '/dashboard/setup', icon: Settings },
    { name: 'Abbonamenti', href: '/dashboard/billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                FIXER
                <span className="text-sm font-normal ml-2 text-slate-600">by Helping Hand</span>
              </h1>
              
              <div className="hidden md:flex gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                        pathname === item.href
                          ? 'bg-red-50 text-red-600'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                {session.user?.email}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Esci
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <SupportButton variant="floating" position="dashboard" />
    </div>
  );
}

