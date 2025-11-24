/**
 * Sentry Server Configuration
 * Error tracking per API routes e server-side
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment
  environment: process.env.NODE_ENV || 'development',
  
  // Filters
  beforeSend(event, hint) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    
    // Filter out known non-critical errors
    if (event.exception) {
      const error = hint.originalException;
      if (error && typeof error === 'object' && 'message' in error) {
        // Ignore specific non-critical errors
        const message = (error as { message?: string }).message;
        if (message && typeof message === 'string' && message.includes('ECONNREFUSED')) {
          return null;
        }
      }
    }
    
    return event;
  },
});

