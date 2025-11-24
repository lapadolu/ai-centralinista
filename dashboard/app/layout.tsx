import { Providers } from './providers';
import { CookieConsentBanner } from '@/components/CookieConsent';
import './globals.css';

export const metadata = {
  title: 'FIXER by Helping Hand - Centralini Intelligenti per PMI',
  description: 'Assistenti AI che rispondono alle chiamate 24/7, raccolgono lead qualificati e li smistano automaticamente al tuo team.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="antialiased">
        <Providers>
          {children}
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
