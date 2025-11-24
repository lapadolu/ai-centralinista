'use client';

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

/**
 * Cookie Consent Banner - GDPR Compliant
 * Richiede consenso per cookie non essenziali
 */
export function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accetto"
      declineButtonText="Rifiuta"
      enableDeclineButton
      cookieName="helping-hand-cookie-consent"
      style={{
        background: '#1e293b',
        borderTop: '1px solid #334155',
        padding: '20px',
        fontSize: '14px',
        zIndex: 9999,
      }}
      buttonStyle={{
        background: '#dc2626',
        color: 'white',
        fontSize: '14px',
        fontWeight: 600,
        padding: '10px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#94a3b8',
        fontSize: '14px',
        fontWeight: 500,
        padding: '10px 24px',
        borderRadius: '8px',
        border: '1px solid #475569',
        cursor: 'pointer',
      }}
      expires={365}
    >
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-white mb-1">
          Utilizziamo i cookie per migliorare la tua esperienza
        </span>
        <span className="text-slate-300 text-sm">
          Utilizziamo cookie essenziali per il funzionamento del sito e cookie analitici per
          comprendere come interagisci con noi. Puoi accettare tutti i cookie o scegliere di
          rifiutare quelli non essenziali.{' '}
          <Link href="/privacy" className="text-red-400 hover:text-red-300 underline">
            Privacy Policy
          </Link>
        </span>
      </div>
    </CookieConsent>
  );
}

