# ✅ Checklist MVP - FIXER by Helping Hand

**Data creazione:** 2025-01-28  
**Clienti pilota:** Federico (Iconacasa), Gianluca (Tempocasa)  
**Durata test:** 40 giorni gratuiti

---

## 🎯 Obiettivo
Verificare che un nuovo cliente possa iscriversi e avere il sistema funzionante end-to-end senza problemi.

---

## 📋 Pre-Deploy Checklist

### 1. Configurazione Ambiente

#### Vercel (Frontend)
- [ ] **Root Directory** impostato a `dashboard` nelle settings Vercel
- [ ] **Environment Variables** configurate:
  - [ ] `VAPI_API_KEY`
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `TWILIO_WHATSAPP_NUMBER` (formato: `whatsapp:+39...`)
  - [ ] `TWILIO_DESTINATION_WHATSAPP` (formato: `whatsapp:+39...`)
  - [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` (stringa JSON completa)
  - [ ] `NEXTAUTH_SECRET` (generato con `openssl rand -base64 32`)
  - [ ] `NEXTAUTH_URL` (es: `https://www.helping-hand.it`)
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_PUBLISHABLE_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `NEXT_PUBLIC_APP_URL` (es: `https://www.helping-hand.it`)

#### Google Cloud Functions (Backend)
- [ ] **Cloud Function deployata** e attiva
  - URL: `https://europe-west1-ai-centralinista-2025.cloudfunctions.net/vapi-webhook`
- [ ] **Environment Variables** configurate:
  - [ ] `VAPI_API_KEY` (per verifica firma webhook)
  - [ ] `TWILIO_ACCOUNT_SID`
  - [ ] `TWILIO_AUTH_TOKEN`
  - [ ] `TWILIO_WHATSAPP_NUMBER` (formato: `whatsapp:+39...`)
  - [ ] `TWILIO_DESTINATION_WHATSAPP` (formato: `whatsapp:+39...`)

#### Vapi.ai Dashboard
- [ ] **API Key** configurata e funzionante
- [ ] **Webhook URL** configurato: `https://europe-west1-ai-centralinista-2025.cloudfunctions.net/vapi-webhook`
- [ ] **Webhook Signature** abilitato (per sicurezza)

#### Twilio Dashboard
- [ ] **Numero Twilio** configurato e attivo
- [ ] **WhatsApp Business API** abilitato sul numero
- [ ] **Numero aggiunto** come `TWILIO_WHATSAPP_NUMBER` in Vercel e GCP
- [ ] **Numero collegato** all'assistant Vapi

#### Firebase Firestore
- [ ] **Progetto Firebase** configurato
- [ ] **Service Account JSON** generato e configurato in Vercel
- [ ] **Security Rules** deployate (`backend/firestore.rules`)
- [ ] **Indexes** deployati (`firestore.indexes.json`)

#### Stripe Dashboard
- [ ] **Account Stripe** configurato
- [ ] **API Keys** (Secret + Publishable) configurate in Vercel
- [ ] **Webhook** configurato: `https://www.helping-hand.it/api/billing/webhook`
- [ ] **Eventi webhook** selezionati: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 🧪 Test End-to-End

### 2. Test Registrazione Nuovo Cliente

#### 2.1 Signup
- [ ] Accedere a `https://www.helping-hand.it/signup`
- [ ] Compilare form: Nome, Email, Password, Conferma Password
- [ ] Cliccare "Registrati"
- [ ] **Verifica:** Email non già esistente
- [ ] **Verifica:** Password valida (min 8 caratteri)
- [ ] **Verifica:** Redirect a `/dashboard` dopo signup
- [ ] **Verifica:** Utente creato in Firestore (`users` collection)

#### 2.2 Login
- [ ] Logout (se necessario)
- [ ] Accedere a `https://www.helping-hand.it/login`
- [ ] Inserire email e password
- [ ] Cliccare "Accedi"
- [ ] **Verifica:** Login funzionante
- [ ] **Verifica:** Redirect a `/dashboard`

#### 2.3 Dashboard Accesso
- [ ] Dopo login, verificare accesso a `/dashboard`
- [ ] **Verifica:** Se utente nuovo senza ordine → mostra schermata onboarding
- [ ] **Verifica:** Se utente con ordine → mostra dashboard con dati

---

### 3. Test Checkout e Abbonamento

#### 3.1 Creazione Checkout
- [ ] Accedere a `/dashboard/billing`
- [ ] Selezionare un piano (Starter €109, Pro €179, Enterprise €329)
- [ ] Cliccare "Sottoscrivi"
- [ ] **Verifica:** Redirect a Stripe Checkout
- [ ] **Verifica:** URL Stripe contiene `client_reference_id` con user_id

#### 3.2 Completamento Pagamento
- [ ] Inserire dati carta test Stripe: `4242 4242 4242 4242`
- [ ] Inserire data scadenza futura (es: 12/25)
- [ ] Inserire CVC: `123`
- [ ] Inserire nome: qualsiasi
- [ ] Cliccare "Paga"
- [ ] **Verifica:** Redirect a `/dashboard/billing?success=true`
- [ ] **Verifica:** Webhook Stripe ricevuto e processato
- [ ] **Verifica:** Ordine creato in Firestore (`orders` collection)
- [ ] **Verifica:** User aggiornato con `subscription_plan`, `subscription_status`, `stripe_customer_id`

---

### 4. Test Setup Ordine (Admin)

#### 4.1 Accesso Admin
- [ ] Login come admin (utente con `role: 'admin'`)
- [ ] **Verifica:** Link "Admin" visibile nella dashboard
- [ ] Accedere a `/admin`

#### 4.2 Setup Nuovo Ordine
- [ ] Accedere a `/admin/setup`
- [ ] Selezionare cliente (Federico o Gianluca)
- [ ] Cliccare "Crea Ordine"
- [ ] **Verifica:** Ordine creato in Firestore
- [ ] **Verifica:** Redirect a `/admin/setup/[orderId]`

#### 4.3 Creazione Assistant Vapi
- [ ] Nella pagina setup ordine, cliccare "Crea Assistant Vapi"
- [ ] **Verifica:** Assistant creato su Vapi.ai
- [ ] **Verifica:** `vapi_assistant_id` salvato in Firestore ordine
- [ ] **Verifica:** Assistant ID mostrato nella UI

#### 4.4 Configurazione Numero Twilio
- [ ] Opzione A: Cliccare "Acquista Numero Twilio" (se disponibile)
  - [ ] **Verifica:** Numero acquistato automaticamente
  - [ ] **Verifica:** Numero collegato a Vapi assistant
  - [ ] **Verifica:** `twilio_phone_number` e `twilio_sid` salvati in Firestore
- [ ] Opzione B: Inserire manualmente numero esistente
  - [ ] Inserire numero Twilio (formato: `+39...`)
  - [ ] Cliccare "Aggiungi Numero"
  - [ ] **Verifica:** Numero salvato in Firestore
  - [ ] **Verifica:** Numero collegato a Vapi assistant

#### 4.5 Verifica Setup Completo
- [ ] Cliccare "Verifica Setup"
- [ ] **Verifica:** Tutti i check passano:
  - [ ] Assistant Vapi creato
  - [ ] Numero Twilio configurato
  - [ ] Numero collegato a Vapi
- [ ] **Verifica:** Stato ordine aggiornato a `status: 'active'`

---

### 5. Test Chiamata Reale

#### 5.1 Preparazione
- [ ] Verificare numero Twilio attivo e collegato a Vapi
- [ ] Verificare webhook Vapi configurato correttamente
- [ ] Verificare `TWILIO_DESTINATION_WHATSAPP` configurato (numero agente)

#### 5.2 Chiamata Test
- [ ] Chiamare il numero Twilio da un telefono diverso
- [ ] **Verifica:** Chiamata risponde (assistant Vapi risponde)
- [ ] Parlare con l'assistant:
  - [ ] Dire nome: "Mi chiamo Mario Rossi"
  - [ ] Dire tipo richiesta: "Vorrei comprare un appartamento"
  - [ ] Dire zona: "In zona Porta Romana"
  - [ ] Dire tipo immobile: "Un bilocale"
  - [ ] Dire budget: "Circa 300.000 euro"
  - [ ] Aggiungere note: "Vorrei un balcone"
- [ ] Terminare chiamata

#### 5.3 Verifica Dati Chiamata
- [ ] **Verifica:** Chiamata salvata in Firestore (`calls` collection)
  - [ ] `call_id` presente
  - [ ] `customer_number` corretto
  - [ ] `client_info` contiene tutti i dati estratti:
    - [ ] `nome`: "Mario Rossi"
    - [ ] `tipo_richiesta`: "comprare"
    - [ ] `zona`: "Porta Romana"
    - [ ] `tipo_immobile`: "bilocale"
    - [ ] `budget`: "300.000 euro"
    - [ ] `note`: contiene "balcone"
  - [ ] `transcript` presente (trascrizione completa)
  - [ ] `duration` > 0
  - [ ] `status`: "completed"
  - [ ] `user_id` corretto (associato all'ordine)

#### 5.4 Verifica Notifica WhatsApp
- [ ] **Verifica:** Messaggio WhatsApp ricevuto su `TWILIO_DESTINATION_WHATSAPP`
- [ ] **Verifica:** Messaggio contiene:
  - [ ] Header: "📞 *Nuovo Lead - Mario Rossi*"
  - [ ] Riepilogo: "Cerca di comprare un bilocale in zona Porta Romana con budget 300.000 euro"
  - [ ] Contatto: numero telefono chiamante
  - [ ] Dettagli: "balcone"
  - [ ] Raccomandazione: cosa proporgli
- [ ] **Verifica:** Messaggio formattato correttamente (markdown WhatsApp)

#### 5.5 Verifica Dashboard Cliente
- [ ] Login come cliente
- [ ] Accedere a `/dashboard/leads`
- [ ] **Verifica:** Lead "Mario Rossi" presente nella lista
- [ ] **Verifica:** Dati lead corretti (nome, telefono, zona, tipo immobile, budget, note)
- [ ] Accedere a `/dashboard/calls`
- [ ] **Verifica:** Chiamata presente nella lista
- [ ] **Verifica:** Dettagli chiamata corretti (durata, data, status)
- [ ] Accedere a `/dashboard`
- [ ] **Verifica:** Statistiche aggiornate (chiamate totali, lead nuovi)

---

### 6. Test Routing Zone

#### 6.1 Configurazione Zone
- [ ] Login come cliente
- [ ] Accedere a `/dashboard/zones`
- [ ] Aggiungere zona: "Porta Romana"
- [ ] Assegnare agente WhatsApp: `+393394197445` (esempio)
- [ ] Salvare
- [ ] **Verifica:** Zona salvata in Firestore (`users/{user_id}/zone_assignments`)

#### 6.2 Test Routing
- [ ] Chiamare numero Twilio
- [ ] Durante chiamata, menzionare zona: "Porta Romana"
- [ ] Terminare chiamata
- [ ] **Verifica:** Messaggio WhatsApp inviato all'agente assegnato a "Porta Romana"
- [ ] **Verifica:** Se zona non assegnata → usa destinatario default

---

### 7. Test GDPR e Compliance

#### 7.1 Privacy Policy
- [ ] Accedere a `https://www.helping-hand.it/privacy`
- [ ] **Verifica:** Privacy Policy completa con:
  - [ ] Dati aziendali (Ludovico Marioli, P.IVA, indirizzo)
  - [ ] Informazioni su dati raccolti
  - [ ] Link a GDPR rights page

#### 7.2 Cookie Policy
- [ ] Accedere a `https://www.helping-hand.it/cookie-policy`
- [ ] **Verifica:** Cookie Policy presente e completa

#### 7.3 Terms of Service
- [ ] Accedere a `https://www.helping-hand.it/terms`
- [ ] **Verifica:** Terms of Service presenti con dati aziendali

#### 7.4 GDPR Rights
- [ ] Accedere a `https://www.helping-hand.it/gdpr-rights`
- [ ] **Verifica:** Pagina funzionante
- [ ] **Verifica:** Form per richiesta accesso/cancellazione dati presente

---

### 8. Test Sicurezza

#### 8.1 Autenticazione
- [ ] Tentare accesso a `/dashboard` senza login
- [ ] **Verifica:** Redirect a `/login`
- [ ] Tentare accesso a `/admin` senza essere admin
- [ ] **Verifica:** Redirect a `/dashboard` (non autorizzato)

#### 8.2 Rate Limiting
- [ ] Chiamare stesso numero 20+ volte in 1 ora
- [ ] **Verifica:** Chiamata bloccata dopo limite (rate limit attivo)

#### 8.3 Webhook Security
- [ ] Tentare chiamata webhook Vapi senza firma valida
- [ ] **Verifica:** Richiesta rifiutata (401 Unauthorized)

---

### 9. Test Admin Panel

#### 9.1 Dashboard Admin
- [ ] Accedere a `/admin`
- [ ] **Verifica:** Statistiche generali visibili
- [ ] **Verifica:** Link a sezioni: Clients, Setup, API Costs, System Health

#### 9.2 Gestione Clienti
- [ ] Accedere a `/admin/clients`
- [ ] **Verifica:** Lista clienti visibile
- [ ] **Verifica:** Dettagli cliente (email, piano, status) corretti

#### 9.3 API Costs
- [ ] Accedere a `/admin/api-costs`
- [ ] **Verifica:** Costi stimati visibili
- [ ] **Verifica:** Utilizzo API tracciato

#### 9.4 System Health
- [ ] Accedere a `/admin/system`
- [ ] **Verifica:** Status servizi visibile:
  - [ ] Firebase: OK
  - [ ] Vapi: OK
  - [ ] Twilio: OK
  - [ ] Stripe: OK

---

## 🚨 Problemi Comuni e Fix

### Problema: Chiamata non risponde
- **Check:** Numero Twilio collegato a Vapi assistant?
- **Check:** Assistant Vapi attivo?
- **Check:** Numero Twilio attivo in Twilio Dashboard?

### Problema: WhatsApp non arriva
- **Check:** `TWILIO_WHATSAPP_NUMBER` configurato correttamente?
- **Check:** `TWILIO_DESTINATION_WHATSAPP` configurato?
- **Check:** Log Cloud Function per errori
- **Check:** Numero destinatario in formato `whatsapp:+39...`

### Problema: Dati chiamata non salvati
- **Check:** Webhook Vapi configurato correttamente?
- **Check:** Cloud Function deployata e attiva?
- **Check:** Firestore permissions corrette?
- **Check:** Log Cloud Function per errori

### Problema: Checkout non funziona
- **Check:** Stripe API keys configurate?
- **Check:** Webhook Stripe configurato?
- **Check:** `NEXTAUTH_URL` corretto?

### Problema: Login non funziona
- **Check:** `NEXTAUTH_SECRET` configurato?
- **Check:** `NEXTAUTH_URL` corretto?
- **Check:** Firebase service account JSON valido?

---

## 📝 Note per Cliente Pilota

### Federico (Iconacasa)
- [ ] Account creato e verificato
- [ ] Ordine creato e setup completato
- [ ] Numero Twilio configurato
- [ ] Zone configurate (se necessario)
- [ ] Destinatario WhatsApp configurato

### Gianluca (Tempocasa)
- [ ] Account creato e verificato
- [ ] Ordine creato e setup completato
- [ ] Numero Twilio configurato
- [ ] Zone configurate (se necessario)
- [ ] Destinatario WhatsApp configurato

---

## ✅ Checklist Finale Pre-Demo

Prima di presentarsi al cliente, verificare:

- [ ] Tutti i test sopra completati con successo
- [ ] Nessun errore nei log (Vercel + GCP)
- [ ] Sito accessibile da browser esterno
- [ ] Chiamata test funzionante end-to-end
- [ ] WhatsApp test ricevuto correttamente
- [ ] Dashboard mostra dati corretti
- [ ] Admin panel accessibile e funzionante
- [ ] Documentazione GDPR completa e accessibile

---

**Ultimo aggiornamento:** 2025-01-28  
**Prossima revisione:** Dopo test con clienti pilota
