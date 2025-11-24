# FIXER by Helping Hand

Centralini AI intelligenti per PMI - Sistema completo per gestione chiamate, lead e notifiche WhatsApp.

## Stack Tecnologico

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Google Cloud Functions (Python), Firebase Firestore
- **Voice AI**: Vapi.ai
- **Messaging**: Twilio (SMS/WhatsApp)
- **Payments**: Stripe
- **Auth**: NextAuth.js

## Struttura Progetto

```
├── dashboard/          # Next.js application
│   ├── app/           # App Router pages e API routes
│   ├── components/    # React components
│   └── lib/           # Utilities e helpers
├── backend/
│   ├── functions/     # Google Cloud Functions
│   └── firestore.rules # Firestore security rules
└── scripts/           # Utility scripts
```

## Setup Locale

### Dashboard (Next.js)
```bash
cd dashboard
npm install
npm run dev
```

### Cloud Functions (Python)
```bash
cd backend/functions
pip install -r requirements.txt
```

## Deployment

- **Vercel**: Auto-deploy da branch `main` (configurato in `vercel.json`)
- **GCP Functions**: Usa `deploy-vapi-webhook.sh`

## Documentazione

- `STATUS.md` - Stato progetto e credenziali
- `INTEGRAZIONE_TWILIO_WHATSAPP.md` - Guida integrazione Twilio
- `REVISIONE_MESSAGGIO_WHATSAPP.md` - Analisi messaggio WhatsApp

## Environment Variables

Vedi `STATUS.md` per lista completa delle variabili d'ambiente necessarie.

## License

Proprietario - Helping Hand

