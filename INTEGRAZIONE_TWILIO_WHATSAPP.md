# Guida Integrazione Numero Twilio Italiano + WhatsApp

## Quando ricevi il numero Twilio italiano

### 1. Configurazione Numero in Twilio Dashboard
1. Vai su [Twilio Console](https://console.twilio.com/)
2. Vai su **Phone Numbers** → **Manage** → **Active numbers**
3. Trova il tuo numero italiano
4. Clicca sul numero per configurarlo

### 2. Configurazione Voice (per Vapi)
Nel numero Twilio, configura:
- **Voice Configuration**:
  - **A CALL COMES IN**: Webhook URL di Vapi (ti verrà dato da Vapi quando colleghi il numero)
  - **HTTP Method**: POST

### 3. Configurazione WhatsApp Business API
1. Vai su **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Verifica il numero per WhatsApp Business API:
   - Twilio ti darà un numero temporaneo tipo `whatsapp:+14155238886`
   - Dopo verifica, potrai usare il tuo numero italiano
3. Configura il webhook WhatsApp (se necessario)

### 4. Aggiorna Environment Variables

#### In Vercel (Dashboard):
Aggiungi/aggiorna:
```
TWILIO_PHONE_NUMBER=+39XXXXXXXXX (il tuo numero italiano)
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXX (stesso numero con prefisso whatsapp:)
```

#### In Google Cloud Function (vapi-webhook):
Aggiorna le env vars:
```bash
gcloud functions deploy vapi-webhook \
  --update-env-vars "TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXX" \
  --region europe-west1
```

### 5. Collega Numero a Vapi Assistant
1. Vai su [Vapi Dashboard](https://dashboard.vapi.ai/)
2. Vai su **Phone Numbers**
3. Clicca **Add Phone Number**
4. Inserisci il numero Twilio italiano
5. Vapi lo collegherà automaticamente al tuo assistant

### 6. Test
1. Fai una chiamata di test al numero italiano
2. Verifica che Vapi risponda correttamente
3. Verifica che il WhatsApp arrivi dopo la chiamata

---

## Messaggio WhatsApp Attuale

Il messaggio viene generato in `backend/functions/notification.py` nella funzione `send_whatsapp_notification()`.

**Formato attuale:**
```
🔔 *Nuovo Lead - [Nome]*

🎯 [Riassunto ricerca]

📋 *Dettagli:*
• Telefono: [numero]
• Tipo richiesta: [comprare/vendere]
• Zona: [zona]
• Tipo immobile: [tipo]
• Budget: [budget]
• Note: [note]

⏱️ Durata chiamata: [X:XX]

💡 *Raccomandazione:*
[Consiglio personalizzato basato sui dati]

📞 Contatta subito per non perdere questo lead!
```

**Dove modificarlo:**
- File: `backend/functions/notification.py`
- Funzione: `send_whatsapp_notification()` (linea ~81)
- Variabile: `message_parts` (linea ~126)

---

## Prossimi Passi per Demo

1. ✅ Numero Twilio italiano ricevuto
2. ⏳ Configurazione numero in Twilio Dashboard
3. ⏳ Collega numero a Vapi
4. ⏳ Test chiamata + WhatsApp
5. ⏳ Revisione messaggio WhatsApp (se necessario)
6. ⏳ Demo all'amico
7. ⏳ Test 2 settimane
8. ⏳ Deploy per altre agenzie

