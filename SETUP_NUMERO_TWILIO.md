# 📞 Setup Numero Twilio - Guida Completa

**Data:** 2025-01-28  
**Scopo:** Configurare un numero Twilio condiviso per ricevere chiamate e inviare WhatsApp

---

## 🎯 Architettura

### Flusso Chiamata
1. **Cliente** (Federico Iconacasa O Gianluca Tempocasa) configura **inoltro chiamata** dal suo numero fisso → **Numero Twilio**
2. Quando qualcuno chiama il numero fisso del cliente, la chiamata viene **inoltrata al Numero Twilio**
3. **Numero Twilio** è collegato a **Vapi Assistant** del cliente
4. **Vapi** analizza la chiamata in tempo reale
5. Alla fine della chiamata, **Vapi** invia dati al **webhook** (`vapi-webhook` Cloud Function)
6. Il **webhook** salva i dati in Firestore e invia **WhatsApp** con il riassunto usando lo **STESSO numero Twilio**

### Requisiti Numero Twilio
- ✅ **Voice**: Ricevere chiamate (per Vapi)
- ✅ **WhatsApp Business API**: Inviare messaggi WhatsApp
- ⚠️ **SMS**: NON necessario (numero solo voice)

---

## 📋 Setup Step-by-Step

### 1. Acquisire Numero Twilio

#### Opzione A: Numero già posseduto
- Se hai già un numero Twilio, salta al punto 2

#### Opzione B: Acquistare nuovo numero
1. Vai su [Twilio Console](https://console.twilio.com/)
2. Phone Numbers → Buy a number
3. Seleziona:
   - **Country**: Italy
   - **Capabilities**: 
     - ✅ Voice
     - ✅ WhatsApp (se disponibile)
   - **Type**: Local o Mobile
4. Acquista il numero

### 2. Configurare WhatsApp Business API

1. Vai su [Twilio Console → Messaging → Try it out → Send a WhatsApp message](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. Segui la procedura per abilitare WhatsApp Business API sul numero
3. **Nota**: Potrebbe richiedere verifica business (24-48h)

### 3. Configurare Numero in Vapi

Il numero Twilio deve essere collegato all'assistant Vapi del cliente.

#### Via Dashboard Admin
1. Login come admin
2. Vai a `/admin/setup/[orderId]` per il cliente (Federico o Gianluca)
3. Inserisci il numero Twilio nel formato: `+39XXXXXXXXX` (es: `+393394197445`)
4. Clicca "Aggiungi Numero"
5. Il sistema:
   - Salva il numero in Firestore (`orders/{orderId}/twilio_phone_number`)
   - Collega il numero all'assistant Vapi tramite API Vapi

#### Via API Diretta
```bash
POST /api/admin/orders/[orderId]/set-twilio-number
{
  "phone_number": "+39XXXXXXXXX",
  "sid": "PNxxxxx" // opzionale, se disponibile
}
```

### 4. Verificare Collegamento

1. Vai su [Vapi Dashboard](https://dashboard.vapi.ai/)
2. Seleziona l'assistant del cliente
3. Verifica che il numero Twilio sia collegato
4. Verifica che il webhook sia configurato: `https://europe-west1-ai-centralinista-2025.cloudfunctions.net/vapi-webhook`

### 5. Configurare Environment Variables

#### Vercel (Frontend)
```
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXX
TWILIO_DESTINATION_WHATSAPP=whatsapp:+39YYYYYYYYY
```
- `TWILIO_WHATSAPP_NUMBER`: Il numero Twilio che invia WhatsApp (formato `whatsapp:+39...`)
- `TWILIO_DESTINATION_WHATSAPP`: Numero WhatsApp dell'agente che riceve i riassunti (formato `whatsapp:+39...`)

#### Google Cloud Functions (Backend)
```
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXX
TWILIO_DESTINATION_WHATSAPP=whatsapp:+39YYYYYYYYY
```

### 6. Configurare Inoltro Chiamata (Cliente)

Il cliente deve configurare l'inoltro di chiamata dal suo numero fisso al numero Twilio.

**Guida per cliente**: Vedi `/guida-call-forwarding` nel dashboard

#### Esempio Provider Italiani:
- **TIM**: *21*+39XXXXXXXXX#
- **Vodafone**: *21*+39XXXXXXXXX#
- **Wind**: *21*+39XXXXXXXXX#
- **Iliad**: Impostazioni → Inoltro chiamate → Numero Twilio

### 7. Test End-to-End

1. **Test Chiamata**:
   - Chiama il numero fisso del cliente
   - Verifica che la chiamata venga inoltrata al numero Twilio
   - Verifica che Vapi risponda e analizzi la chiamata

2. **Test Webhook**:
   - Verifica log Cloud Function per vedere se webhook riceve dati
   - Verifica che chiamata sia salvata in Firestore (`calls` collection)

3. **Test WhatsApp**:
   - Verifica che messaggio WhatsApp arrivi su `TWILIO_DESTINATION_WHATSAPP`
   - Verifica formato messaggio (riassunto, dati cliente, raccomandazione)

---

## 🔄 Cambio Cliente (Quando si chiude il secondo)

Quando si chiude il secondo cliente (Gianluca se Federico è il primo, o viceversa):

1. **Collega numero Twilio al nuovo assistant**:
   - Vai a `/admin/setup/[orderId]` per il nuovo cliente
   - Inserisci lo stesso numero Twilio
   - Il sistema sovrascriverà il collegamento precedente

2. **Verifica**:
   - Numero Twilio ora collegato al nuovo assistant
   - Vecchio cliente non riceve più chiamate su quel numero
   - Nuovo cliente riceve chiamate inoltrate

---

## 🚨 Problemi Comuni

### Problema: Chiamata non arriva su Twilio
- **Check**: Inoltro chiamata configurato correttamente dal cliente?
- **Check**: Numero Twilio attivo in Twilio Console?
- **Check**: Numero Twilio collegato a Vapi assistant?

### Problema: Vapi non risponde
- **Check**: Assistant Vapi attivo?
- **Check**: Numero Twilio collegato correttamente in Vapi Dashboard?
- **Check**: Webhook configurato in Vapi?

### Problema: WhatsApp non arriva
- **Check**: `TWILIO_WHATSAPP_NUMBER` configurato correttamente (formato `whatsapp:+39...`)?
- **Check**: `TWILIO_DESTINATION_WHATSAPP` configurato correttamente?
- **Check**: WhatsApp Business API abilitato sul numero?
- **Check**: Log Cloud Function per errori

### Problema: Numero Twilio non può inviare WhatsApp
- **Check**: WhatsApp Business API abilitato sul numero?
- **Check**: Numero verificato in Twilio Console?
- **Check**: Formato corretto: `whatsapp:+39XXXXXXXXX` (non solo `+39...`)

---

## 📝 Note Importanti

1. **Un numero Twilio = Un assistant alla volta**
   - Se colleghi il numero a un nuovo assistant, il vecchio collegamento viene sovrascritto
   - Per avere più clienti simultanei, servono più numeri Twilio

2. **Numero Twilio può fare Voice + WhatsApp**
   - Lo stesso numero può ricevere chiamate (Voice) e inviare WhatsApp
   - Non serve SMS capability

3. **Routing Zone**
   - Se il cliente ha zone configurate, il WhatsApp viene inviato all'agente della zona
   - Altrimenti usa `TWILIO_DESTINATION_WHATSAPP` come default

4. **Formato Numeri**
   - Twilio: `+39XXXXXXXXX` (E.164 format)
   - WhatsApp: `whatsapp:+39XXXXXXXXX` (prefisso `whatsapp:` obbligatorio)

---

## ✅ Checklist Setup

- [ ] Numero Twilio acquistato/configurato
- [ ] WhatsApp Business API abilitato sul numero
- [ ] Numero Twilio collegato a Vapi assistant (primo cliente)
- [ ] Environment variables configurate (Vercel + GCP)
- [ ] Webhook Vapi configurato correttamente
- [ ] Cliente ha configurato inoltro chiamata
- [ ] Test chiamata end-to-end funzionante
- [ ] Test WhatsApp ricevuto correttamente
- [ ] Dati chiamata salvati in Firestore
- [ ] Dashboard cliente mostra lead e chiamate

---

**Ultimo aggiornamento:** 2025-01-28
