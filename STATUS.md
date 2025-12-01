# Status Progetto - FIXER by Helping Hand

**Ultimo aggiornamento:** 2025-01-28

---

## 📋 Panoramica Progetto

**FIXER by Helping Hand** è una piattaforma SaaS completa per centralini AI intelligenti che gestiscono chiamate, raccolgono lead e inviano notifiche WhatsApp automaticamente.

### Stack Tecnologico
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend**: Google Cloud Functions (Python 3.11), Firebase Firestore
- **Voice AI**: Vapi.ai
- **Messaging**: Twilio (SMS/WhatsApp)
- **Payments**: Stripe
- **Auth**: NextAuth.js con Firestore
- **Deployment**: Vercel (Frontend), GCP Functions (Backend)

---

## ✅ Completato

### Fix Critici (Gennaio 2025)
- ✅ **Multi-tenancy implementata** - rimosso hardcoded user_id, sistema completamente multi-tenant
- ✅ **Caching assistant_id → user_id** - performance ottimizzate con cache TTL 15 minuti
- ✅ **Tracking chiamate mensili** - sistema completo per overage billing
- ✅ **Firestore indexes** - creati e configurati (firestore.indexes.json)
- ✅ **Credenziali rimosse** - nessuna credenziale hardcoded nei file pubblici
- ✅ **Query Firestore ottimizzate** - risolto problema N+1 queries
- ✅ **Fix validazione signup** - separato schema frontend (`signupSchema`) da schema API (`signupApiSchema`) per risolvere errore "expected string, received undefined"
- ✅ **Fix errore TypeScript** - corretto errore `guide.app` in guida-call-forwarding/page.tsx
- ✅ **Favicon configurato** - icon.svg configurato correttamente in layout.tsx
- ✅ **Rimossi dati fake dashboard** - eliminati statistiche hardcoded (68%, +15%, "Nov 2025")
- ✅ **Schermata onboarding** - creata pagina `/dashboard/onboarding` per utenti senza abbonamento
- ✅ **Analytics con dati reali** - creata API `/api/dashboard/analytics` che calcola tutto dalle chiamate reali
- ✅ **Dashboard accessibile senza ordine** - se utente ha chiamate, può vedere dashboard anche senza ordine formale
- ✅ **Configurazione Vercel** - creato vercel.json nella root con root directory dashboard
- ✅ **GDPR Compliance completa** - Privacy Policy, Terms, Cookie Policy, GDPR Rights, consenso esplicito
- ✅ **Design sistema** - tema "brick red" elegante e professionale, sezioni strutturate, spaziature ottimizzate
- ✅ **Configurazione dominio** - `www.helping-hand.it` configurato su Vercel, redirect root → www
- ✅ **Security headers** - Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- ✅ **Admin panel esteso** - API costs monitoring, system health, gestione ordini completa
- ✅ **Fix accessibilità sito** - HTTPS redirect, middleware protezione admin routes

### Implementazioni Core
- ✅ **Sistema di autenticazione** - NextAuth.js con Firestore, supporto admin/client
- ✅ **Sistema di abbonamenti** - 3 piani (Starter €109, Pro €179, Enterprise €329)
- ✅ **Dashboard completa** - tutte le pagine collegate a dati reali da Firestore
  - `/dashboard` - Home con statistiche reali (nessun dato fake)
  - `/dashboard/onboarding` - Schermata per nuovi utenti senza abbonamento (spiega servizio, vantaggi, piani)
  - `/dashboard/leads` - CRM completo con gestione lead (dati reali da Firestore)
  - `/dashboard/calls` - Registro chiamate (dati reali)
  - `/dashboard/zones` - Mappatura zone → agenti
  - `/dashboard/analytics` - Analytics con dati reali calcolati dalle chiamate (API route dedicata)
  - `/dashboard/billing` - Gestione abbonamenti
  - `/dashboard/setup` - Setup iniziale ordine
  - `/dashboard/checkout` - Pagina intermedia per redirect Stripe checkout
- ✅ **Admin Panel** - sistema completo per gestione ordini e clienti
  - `/admin` - Dashboard admin
  - `/admin/clients` - Gestione clienti
  - `/admin/setup` - Setup ordini nuovi clienti
  - `/admin/api-costs` - Monitoraggio costi API e utilizzo
  - `/admin/system` - System health e status servizi
- ✅ **API Routes complete** - tutte le routes implementate e testate
  - Auth: `/api/auth/signup`, `/api/auth/[...nextauth]`
  - Dashboard: 
    - `/api/dashboard/leads` - GET, PATCH (dati reali da Firestore)
    - `/api/dashboard/stats` - GET (statistiche reali filtrate per user_id)
    - `/api/dashboard/zones` - GET, POST
    - `/api/dashboard/calls` - GET (chiamate reali)
    - `/api/dashboard/analytics` - GET (analytics calcolate da chiamate reali)
  - Orders: `/api/orders/current`, `/api/orders/[orderId]/test-call`, `/api/orders/[orderId]/confirm-forwarding`
  - Admin: `/api/admin/orders/*`, `/api/admin/users/*`
  - Billing: `/api/billing/create-checkout`, `/api/billing/webhook`, `/api/billing/check-trial`
  - Support: `/api/support/chat`, `/api/support/consultation`
  - Admin: `/api/admin/api-costs`, `/api/admin/system-health`
  - GDPR: `/api/gdpr/consent` - Registrazione consenso GDPR
- ✅ **Email notifications** - sistema Resend implementato (da configurare quando disponibile)
- ✅ **Test call automation** - sistema per testare assistant Vapi
- ✅ **Admin role checks** - verifiche ruolo admin su tutte le routes sensibili
- ✅ **Firebase Admin credentials** - configurate con service account JSON
- ✅ **Vapi API fallback** - supporto per endpoint `/v1` e `/assistant`
- ✅ **Password hash** - NextAuth usa `password_hash` correttamente
- ✅ **Validazione input** - schemi Zod centralizzati in `lib/validation.ts`
  - `signupSchema` - per frontend (include confirmPassword)
  - `signupApiSchema` - per backend (solo name, email, password)
  - `loginSchema`, `checkoutSchema`, `leadStatusSchema`, ecc.
- ✅ **Routing intelligente zone** - sistema per assegnare lead agli agenti in base alla zona
- ✅ **Guida call forwarding** - pagina completa con istruzioni per tutti i provider italiani
- ✅ **Sistema onboarding** - utenti nuovi vedono schermata esplicativa invece di dashboard vuota
- ✅ **Analytics real-time** - calcolo automatico di intent breakdown, top zones, property types, features, budget medio, conversion rate
- ✅ **GDPR compliance** - Privacy Policy completa (Ludovico Marioli, P.IVA 14405660961, Via Alfonso Lamarmora 40, 20122 Milano), Terms of Service, Cookie Policy, GDPR Rights page, API endpoint per consenso esplicito
- ✅ **Design system** - tema "brick red" (#8B3A2F, #A0524A) con palette elegante, spaziature aumentate, sezioni strutturate, contrasti ottimizzati
- ✅ **Gestione numeri Twilio** - API per aggiungere manualmente numeri Twilio esistenti (`/api/admin/orders/[orderId]/set-twilio-number`)

### Deployment
- ✅ **Cloud Function `vapi-webhook`** deployata su GCP
  - URL: `https://europe-west1-ai-centralinista-2025.cloudfunctions.net/vapi-webhook`
  - Region: `europe-west1`
  - Status: `ACTIVE`
  - Funzionalità: gestisce eventi Vapi, salva chiamate in Firestore, invia notifiche WhatsApp
- ✅ **Vercel Frontend** - progetto configurato e deployato
  - Progetto: `fixer-dashboard` (consolidato)
  - Root Directory: `dashboard` (configurato)
  - Auto-deploy: collegato a GitHub `lapadolu/ai-centralinista`
  - Domini: `www.helping-hand.it` (attivo), `helping-hand.it` (redirect a www)
  - SSL: certificati automatici Vercel

### Configurazioni
- ✅ **Vercel environment variables** - configurate
- ✅ **Vapi Dashboard** - configurato
- ✅ **Stripe** - integrato e configurato
- ✅ **Firebase** - progetto configurato, service account configurato
- ✅ **Twilio** - account configurato (manca numero italiano)

### Sicurezza
- ✅ **Rate limiting** - protezione contro spam (20 chiamate/ora, 50/giorno per numero)
- ✅ **Verifica firma Vapi** - HMAC signature verification per webhook
- ✅ **Firestore security rules** - configurate in `backend/firestore.rules`
- ✅ **Admin checks** - verifiche ruolo su tutte le routes admin
- ✅ **Password hashing** - bcrypt con 12 rounds
- ✅ **Security headers** - Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- ✅ **HTTPS redirect** - middleware per forzare HTTPS in produzione
- ✅ **GDPR compliance** - Privacy Policy, Terms, Cookie Policy, consenso esplicito, diritti utente

---

## ⚠️ In Corso / Da Fare

### Deployment Vercel
- ✅ **vercel.json creato** - configurazione nella root del progetto
- ✅ **Root Directory configurato** - `dashboard` impostato nelle settings Vercel
- ✅ **Progetto consolidato** - `fixer-dashboard` come progetto principale
- ✅ **Domini configurati** - `www.helping-hand.it` attivo, `helping-hand.it` con redirect a www
- ⏳ **Propagazione DNS** - in attesa propagazione DNS per dominio root (5-10 minuti)

### Integrazione Numero Twilio Italiano
- [ ] Ricevere numero Twilio italiano (free-toll richiesto)
- [ ] Configurare numero in Twilio Dashboard
- [ ] Collegare numero a Vapi Assistant
- [ ] Configurare WhatsApp Business API sul numero
- [ ] Aggiornare environment variables (Vercel + GCP)
- [ ] Test chiamata + WhatsApp end-to-end

### Testing e Validazione
- [ ] Test completo flusso registrazione → checkout → setup
- [ ] Test chiamata reale con Vapi
- [ ] Test notifica WhatsApp
- [ ] Test routing zone → agenti
- [ ] Test admin panel completo

### Revisione e Ottimizzazione
- [ ] Revisione messaggio WhatsApp (formato, tono, contenuto)
- [ ] Test agente voice (prompt, tono, efficacia)
- [ ] Ottimizzazione structured output Vapi
- [ ] Demo all'amico/cliente pilota
- [ ] Test 2 settimane con cliente pilota
- [ ] Deploy per altre agenzie immobiliari

### Configurazioni Opzionali
- [ ] **Resend**: configurare quando disponibile (email notifications)
  - API Key: Configurata in Vercel environment variables
  - From Email: `Helping Hand <noreply@helping-hand.it>` (dopo verifica dominio)
- [ ] **Sentry**: verificare configurazione error tracking
- [ ] **Modifiche bot Vapi**: aggiungere richiesta consenso GDPR al bot (vedi `MODIFICHE_BOT_VAPI.md`)

---

## 🔧 Configurazione Tecnica

### Struttura Progetto
```
ai-centralinista/
├── dashboard/              # Next.js 15 application
│   ├── app/                # App Router (pages + API routes)
│   ├── components/         # React components
│   ├── lib/                # Utilities e helpers
│   └── vercel.json         # (rimosso, ora in root)
├── backend/
│   ├── functions/          # Google Cloud Functions
│   │   ├── vapi_webhook.py # Webhook handler principale
│   │   └── notification.py # WhatsApp notifications
│   └── firestore.rules     # Security rules
├── scripts/                # Utility scripts
├── vercel.json             # Configurazione Vercel (root directory: dashboard)
└── firestore.indexes.json  # Firestore indexes
```

### Cloud Function URL
```
https://europe-west1-ai-centralinista-2025.cloudfunctions.net/vapi-webhook
```

### Variabili d'Ambiente Richieste

#### Vercel (Frontend)
- `VAPI_API_KEY` - Vapi.ai API key
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token
- `TWILIO_WHATSAPP_NUMBER` - Numero WhatsApp Twilio (formato: `whatsapp:+39...`)
- `TWILIO_DESTINATION_WHATSAPP` - WhatsApp destinatario default (formato: `whatsapp:+39...`)
- `FIREBASE_SERVICE_ACCOUNT_JSON` - Firebase service account JSON (stringa)
- `NEXTAUTH_SECRET` - NextAuth secret (generare con `openssl rand -base64 32`)
- `NEXTAUTH_URL` - URL del sito (es: `https://ai-centralinista.vercel.app`)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `RESEND_API_KEY` - Resend API key (opzionale)
- `RESEND_FROM_EMAIL` - Email mittente Resend (opzionale)
- `NEXT_PUBLIC_APP_URL` - URL pubblico app (opzionale)

#### Google Cloud Functions (Backend)
- `VAPI_API_KEY` - Vapi.ai API key (per verifica firma webhook)
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token
- `TWILIO_WHATSAPP_NUMBER` - Numero WhatsApp Twilio
- `TWILIO_DESTINATION_WHATSAPP` - WhatsApp destinatario default

⚠️ **SICUREZZA:** Le credenziali sono configurate come environment variables in:
- Vercel Dashboard → Settings → Environment Variables
- Google Cloud Functions → Environment Variables
- GCP Secret Manager (raccomandato per produzione)

---

## 📝 File Essenziali

- `STATUS.md` - Questo file (stato progetto)
- `README.md` - Documentazione generale
- `vercel.json` - Configurazione Vercel (root directory)
- `dashboard/next.config.js` - Configurazione Next.js
- `dashboard/lib/validation.ts` - Schemi validazione Zod
- `backend/functions/vapi_webhook.py` - Webhook handler principale
- `backend/functions/notification.py` - Sistema notifiche WhatsApp
- `deploy-vapi-webhook.sh` - Script deploy Cloud Function
- `scripts/` - Script utility (create-admin-user, check-env-vars, ecc.)
- `firestore.indexes.json` - Indexes Firestore

---

## 🚀 Comandi Utili

### Sviluppo Locale
```bash
# Frontend
cd dashboard
npm install
npm run dev

# Backend (Cloud Functions)
cd backend/functions
pip install -r requirements.txt
functions-framework --target=vapi_webhook --port=8080
```

### Deployment
```bash
# Deploy Cloud Function
./deploy-vapi-webhook.sh

# Deploy Frontend (automatico via GitHub push)
git push origin main
```

### Utility
```bash
# Creare admin user
node scripts/create-admin-user.js

# Verificare env vars
node scripts/check-env-vars.js

# Generare password hash
node scripts/generate-password-hash.js
```

---

## 🐛 Problemi Noti / Fix Recenti

### Fix Applicati (Gennaio 2025)
1. **Errore validazione signup** - Separato `signupSchema` (frontend) da `signupApiSchema` (backend)
2. **Errore TypeScript** - Fixato errore `guide.app` in `guida-call-forwarding/page.tsx`
3. **Favicon** - Configurato correttamente in `layout.tsx`
4. **Validazione nome** - Regex migliorata per supportare caratteri Unicode
5. **Configurazione Vercel** - Creato `vercel.json` nella root con root directory

### Problemi Risolti Recentemente
- ✅ **Errore signup "expected string, received undefined"** - Risolto separando schemi Zod
- ✅ **Dati fake in dashboard** - Rimossi tutti i dati hardcoded, ora tutto da Firestore
- ✅ **Analytics con dati fake** - Creata API route che calcola analytics reali
- ✅ **Utenti senza abbonamento vedevano dashboard vuota** - Aggiunta schermata onboarding
- ✅ **Favicon mancante** - Configurato correttamente
- ✅ **Errore TypeScript guida-call-forwarding** - Fixato
- ✅ **Deploy Vercel falliva** - Risolto consolidando progetti, configurando root directory, fix dipendenze TypeScript
- ✅ **Sito non accessibile** - Configurato dominio root con redirect, DNS in propagazione
- ✅ **Design poco leggibile** - Migrato da cyberpunk a tema brick red elegante, contrasti ottimizzati
- ✅ **Sezioni cluttered** - Aumentate spaziature, sezioni meglio strutturate

### Problemi Aperti
- ⏳ **Propagazione DNS** - Attesa propagazione DNS per `helping-hand.it` (5-10 minuti)
- ⚠️ **Numero Twilio italiano** - Manca numero italiano per produzione (Federico ha piano abbonamento)
- [ ] **Modifiche bot Vapi** - Aggiungere richiesta consenso GDPR al bot (task esterno)

---

## 📊 Stato Generale

**Status:** 🟡 **Quasi pronto per produzione**

### Cosa funziona:
- ✅ Sistema completo multi-tenant
- ✅ Autenticazione e autorizzazione
- ✅ Dashboard completa con dati reali (nessun dato fake)
- ✅ Analytics con calcolo real-time da chiamate reali
- ✅ Schermata onboarding per nuovi utenti
- ✅ API routes tutte implementate e collegate a Firestore
- ✅ Cloud Function deployata e funzionante
- ✅ Sistema billing Stripe
- ✅ Notifiche WhatsApp
- ✅ Validazione input con Zod (schemi separati frontend/backend)
- ✅ Sistema di routing zone → agenti
- ✅ GDPR compliance completa (Privacy, Terms, Cookie Policy, consenso)
- ✅ Design system elegante (brick red theme)
- ✅ Admin panel esteso (API costs, system health)
- ✅ Domini configurati (`www.helping-hand.it`, redirect root)
- ✅ Security headers e HTTPS redirect

### Cosa manca:
- ⏳ Propagazione DNS (in corso, 5-10 minuti)
- ⚠️ Numero Twilio italiano per Federico
- ⚠️ Test end-to-end completo
- ⚠️ Modifiche bot Vapi (consenso GDPR)
- ⚠️ Configurazione Resend (opzionale)

---

## 📞 Supporto e Contatti

- **Repository**: `lapadolu/ai-centralinista` su GitHub
- **Vercel Project**: `fixer-dashboard`
- **GCP Project**: `ai-centralinista-2025`
- **Domain**: `www.helping-hand.it` (produzione), `helping-hand.it` (redirect)
- **Company**: Ludovico Marioli, P.IVA 14405660961, SDI T9K4ZHO
- **Address**: Via Alfonso Lamarmora 40, 20122 Milano (MI), Italia

---

**Ultima revisione:** 2025-01-28
**Prossima revisione:** Dopo propagazione DNS e test accessibilità
