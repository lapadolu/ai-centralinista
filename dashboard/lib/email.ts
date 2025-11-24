/**
 * Email Notifications - Resend Integration
 * Helper functions per inviare email transazionali
 * Segue pattern simile a vapi.ts e twilio.ts
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'FIXER by Helping Hand <noreply@helping-hand.it>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.helping-hand.it';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Invia email via Resend API
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY non configurato - email non inviata');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Resend API error: ${response.status} - ${error}`);
      return false;
    }

    const data = await response.json();
    console.log(`Email sent successfully to ${options.to}: ${data.id}`);
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Template email: Order Confirmed
 * Inviata dopo checkout Stripe completato
 */
export async function sendOrderConfirmationEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  planName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ordine Confermato - FIXER by Helping Hand</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FIXER</h1>
        <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 14px;">by Helping Hand</p>
      </div>
      
      <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Ordine Confermato</h2>
        
        <p style="color: #4b5563; font-size: 16px;">Ciao ${userName},</p>
        
        <p style="color: #4b5563; font-size: 16px;">
          Grazie per aver scelto FIXER by Helping Hand! Il tuo ordine è stato confermato e il pagamento è stato elaborato con successo.
        </p>
        
        <div style="background: #f9fafb; border-left: 4px solid #7F1D1D; padding: 20px; margin: 30px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1f2937; font-weight: 600;">Dettagli Ordine</p>
          <p style="margin: 8px 0 0 0; color: #4b5563;">
            <strong>Piano:</strong> ${planName}<br>
            <strong>ID Ordine:</strong> ${orderId}
          </p>
        </div>
        
        <p style="color: #4b5563; font-size: 16px;">
          Il nostro team inizierà a configurare il tuo servizio entro 1 settimana lavorativa. 
          Riceverai un'email quando tutto sarà pronto.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${APP_URL}/dashboard" style="display: inline-block; background: #7F1D1D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Vai alla Dashboard
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Se hai domande, rispondi a questa email o contatta il supporto su 
          <a href="${APP_URL}/dashboard" style="color: #7F1D1D; text-decoration: none;">${APP_URL}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Ordine Confermato - ${planName}`,
    html,
  });
}

/**
 * Template email: Agent Ready
 * Inviata quando admin completa setup e agent è pronto
 */
export async function sendAgentReadyEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  phoneNumber: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Agent Pronto - Helping Hand</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FIXER</h1>
        <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 14px;">by Helping Hand</p>
      </div>
      
      <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Il Tuo Agent è Pronto! 🎉</h2>
        
        <p style="color: #4b5563; font-size: 16px;">Ciao ${userName},</p>
        
        <p style="color: #4b5563; font-size: 16px;">
          Ottime notizie! Il tuo AI Centralinista è stato configurato e testato con successo. 
          È pronto per gestire le chiamate in arrivo.
        </p>
        
        <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 20px; margin: 30px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1f2937; font-weight: 600;">Numero Attivo</p>
          <p style="margin: 8px 0 0 0; color: #4b5563; font-size: 18px; font-weight: 600;">
            ${phoneNumber}
          </p>
        </div>
        
        <p style="color: #4b5563; font-size: 16px;">
          Per attivare completamente il servizio, devi configurare l'inoltro chiamate dal tuo provider telefonico 
          al numero sopra indicato. Troverai le istruzioni dettagliate nella dashboard.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${APP_URL}/dashboard" style="display: inline-block; background: #7F1D1D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Configura Inoltro Chiamate
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Hai bisogno di aiuto? Contatta il supporto su 
          <a href="${APP_URL}/dashboard" style="color: #7F1D1D; text-decoration: none;">${APP_URL}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: 'Il Tuo AI Centralinista è Pronto!',
    html,
  });
}

/**
 * Template email: Activated (con istruzioni provider-specific)
 * Inviata quando ordine viene attivato con istruzioni per inoltro chiamate
 */
export async function sendActivationEmail(
  userEmail: string,
  userName: string,
  orderId: string,
  phoneNumber: string,
  phoneProvider: string,
  customerPhone: string
): Promise<boolean> {
  // Istruzioni provider-specific
  const providerInstructions: Record<string, string> = {
    'TIM': `
      <ol style="padding-left: 20px; color: #4b5563;">
        <li>Chiama il 119 (servizio clienti TIM)</li>
        <li>Richiedi l'attivazione dell'inoltro chiamate</li>
        <li>Fornisci il numero di destinazione: <strong>${phoneNumber}</strong></li>
        <li>L'inoltro sarà attivo entro 24 ore</li>
      </ol>
    `,
    'Vodafone': `
      <ol style="padding-left: 20px; color: #4b5563;">
        <li>Accedi all'area clienti Vodafone</li>
        <li>Vai su "Servizi" → "Inoltro Chiamate"</li>
        <li>Inserisci il numero di destinazione: <strong>${phoneNumber}</strong></li>
        <li>Salva le modifiche</li>
      </ol>
    `,
    'Wind Tre': `
      <ol style="padding-left: 20px; color: #4b5563;">
        <li>Chiama il 155 (servizio clienti Wind Tre)</li>
        <li>Richiedi l'attivazione dell'inoltro chiamate</li>
        <li>Fornisci il numero di destinazione: <strong>${phoneNumber}</strong></li>
        <li>L'inoltro sarà attivo entro poche ore</li>
      </ol>
    `,
    'Iliad': `
      <ol style="padding-left: 20px; color: #4b5563;">
        <li>Accedi all'app Iliad o al sito web</li>
        <li>Vai su "Servizi" → "Inoltro Chiamate"</li>
        <li>Inserisci il numero di destinazione: <strong>${phoneNumber}</strong></li>
        <li>Conferma l'attivazione</li>
      </ol>
    `,
  };

  const instructions = providerInstructions[phoneProvider] || `
    <p style="color: #4b5563;">
      Contatta il tuo provider telefonico per attivare l'inoltro chiamate dal numero 
      <strong>${customerPhone}</strong> al numero <strong>${phoneNumber}</strong>.
    </p>
  `;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Attiva il Servizio - Helping Hand</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FIXER</h1>
        <p style="color: #cbd5e1; margin: 4px 0 0 0; font-size: 14px;">by Helping Hand</p>
      </div>
      
      <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0; font-size: 24px; font-weight: 600;">Attiva il Tuo Servizio</h2>
        
        <p style="color: #4b5563; font-size: 16px;">Ciao ${userName},</p>
        
        <p style="color: #4b5563; font-size: 16px;">
          Il tuo AI Centralinista è pronto! Per completare l'attivazione, configura l'inoltro chiamate 
          dal tuo numero esistente al numero FIXER.
        </p>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1f2937; font-weight: 600; margin-bottom: 10px;">Istruzioni per ${phoneProvider}</p>
          ${instructions}
        </div>
        
        <div style="background: #f9fafb; border-left: 4px solid #7F1D1D; padding: 20px; margin: 30px 0; border-radius: 4px;">
          <p style="margin: 0; color: #1f2937; font-weight: 600;">Numeri</p>
          <p style="margin: 8px 0 0 0; color: #4b5563;">
            <strong>Il Tuo Numero:</strong> ${customerPhone}<br>
            <strong>Numero FIXER:</strong> ${phoneNumber}
          </p>
        </div>
        
        <p style="color: #4b5563; font-size: 16px;">
          Una volta configurato l'inoltro, tutte le chiamate al tuo numero verranno gestite automaticamente 
          dal tuo AI Centralinista.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${APP_URL}/dashboard" style="display: inline-block; background: #7F1D1D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
            Vai alla Dashboard
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Hai bisogno di aiuto? Contatta il supporto su 
          <a href="${APP_URL}/dashboard" style="color: #7F1D1D; text-decoration: none;">${APP_URL}</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: 'Attiva il Tuo AI Centralinista - Istruzioni',
    html,
  });
}

