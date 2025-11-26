import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = (token as any)?.role === 'admin';
    const pathname = req.nextUrl.pathname;

    // Proteggi /admin/* - solo admin possono accedere
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Force HTTPS in production
    if (process.env.NODE_ENV === 'production' && 
        req.headers.get('x-forwarded-proto') !== 'https' &&
        !req.nextUrl.hostname.includes('localhost')) {
      return NextResponse.redirect(
        `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
        301
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Se è /admin, verifica che sia admin
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return (token as any)?.role === 'admin';
        }
        // Per /dashboard, qualsiasi utente autenticato va bene
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};

