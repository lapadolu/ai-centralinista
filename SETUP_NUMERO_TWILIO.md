# 📞 Setup Numero Twilio - Guida Completa

**Data:** 2025-01-28  
**Scopo:** Configurare un numero Twilio DEDICATO per ogni cliente

---

## 🎯 Architettura

### ⚠️ IMPORTANTE: Un Numero Twilio = Un Cliente
**NON possono condividere un numero!** Se due clienti condividono lo stesso numero e ricevono chiamate contemporaneamente, Vapi non può sapere quale assistant usare.

### Flusso Chiamata
1. **Cliente** (Federico Iconacasa O Gianluca Tempocasa) ha il **SUO numero Twilio dedicato**
2. Cliente configura **inoltro chiamata** dal suo numero fisso → **SUO Numero Twilio**
3. Quando qualcuno chiama il numero fisso del cliente, la chiamata viene **inoltrata al Numero Twilio del cliente**
4. **Numero Twilio** è collegato a **Vapi Assistant** del cliente (1:1 mapping)
5. **Vapi** analizza la chiamata in tempo reale
6. Alla fine della chiamata, **Vapi** invia dati al **webhook** (`vapi-webhook` Cloud Function)
7. Il **webhook** salva i dati in Firestore e invia **WhatsApp** con il riassunto usando lo **STESSO numero Twilio del cliente**

### Requisiti Numero Twilio (per cliente)
- ✅ **Voice**: Ricevere chiamate (per Vapi)
- ✅ **WhatsApp Business API**: Inviare messaggi WhatsApp
- ⚠️ **SMS**: NON necessario (numero solo voice)
- ✅ **Dedicato**: Un numero per cliente (NON condiviso)

---

## 📋 Setup Step-by-Step

### 1. Acquisire Numero Twilio (PER OGNI CLIENTE)

**Ogni cliente deve avere il SUO numero Twilio dedicato.**

#### Opzione A: Numero già posseduto
- Se hai già un numero Twilio per il cliente, salta al punto 2

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
5. **Ripeti per ogni cliente** (Federico ha il suo, Gianluca ha il suo)

### 2. Configurare WhatsApp Business API

1. Vai su [Twilio Console → Messaging → Try it out → Send a WhatsApp message](https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn)
2. Segui la procedura per abilitare WhatsApp Business API sul numero
3. **Nota**: Potrebbe richiedere verifica business (24-48h)
4. **Ripeti per ogni numero Twilio** (ogni cliente)

### 3. Configurare Numero in Vapi (PER OGNI CLIENTE)

**Ogni cliente deve avere il SUO numero Twilio dedicato.**

#### Via Dashboard Admin
1. Login come admin
2. Vai a `/admin/setup/[orderId]` per il cliente (Federico O Gianluca)
3. Inserisci il numero Twilio DEDICATO del cliente nel formato: `+39XXXXXXXXX` (es: `+393394197445`)
4. Clicca "Aggiungi Numero"
5. Il sistema:
   - Salva il numero in Firestore (`orders/{orderId}/twilio_phone_number`)
   - Collega il numero all'assistant Vapi del cliente tramite API Vapi
   - **Mapping 1:1**: Numero Twilio → Assistant Vapi → Cliente

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
5. **Ripeti per ogni cliente**

### 5. Configurare Environment Variables

**NOTA**: Le env vars `TWILIO_WHATSAPP_NUMBER` e `TWILIO_DESTINATION_WHATSAPP` sono per il sistema generale. Ogni cliente ha il suo numero salvato in Firestore (`orders/{orderId}/twilio_phone_number`).

#### Vercel (Frontend)
```
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXX  # Numero default/fallback (opzionale)
TWILIO_DESTINATION_WHATSAPP=whatsapp:+39YYYYYYYYY  # Destinatario default per WhatsApp
```
- `TWILIO_WHATSAPP_NUMBER`: Numero Twilio default (usato se numero cliente non configurato)
- `TWILIO_DESTINATION_WHATSAPP`: Numero WhatsApp dell'agente che riceve i riassunti (default, può essere sovrascritto da routing zone)

#### Google Cloud Functions (Backend)
```
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXX  # Numero default/fallback (opzionale)
TWILIO_DESTINATION_WHATSAPP=whatsapp:+39YYYYYYYYY  # Destinatario default per WhatsApp
```

**IMPORTANTE**: Il numero Twilio del cliente viene letto da Firestore (`orders/{orderId}/twilio_phone_number`) quando si invia WhatsApp. Non serve configurarlo nelle env vars.

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
   - Verifica che la chiamata venga inoltrata al numero Twilio del cliente
   - Verifica che Vapi risponda e analizzi la chiamata

2. **Test Webhook**:
   - Verifica log Cloud Function per vedere se webhook riceve dati
   - Verifica che chiamata sia salvata in Firestore (`calls` collection)

3. **Test WhatsApp**:
   - Verifica che messaggio WhatsApp arrivi su `TWILIO_DESTINATION_WHATSAPP`
   - Verifica formato messaggio (riassunto, dati cliente, raccomandazione)

4. **Test Chiamate Simultaneee**:
   - Chiama entrambi i clienti contemporaneamente
   - Verifica che ogni chiamata vada al suo assistant corretto
   - Verifica che ogni WhatsApp arrivi con i dati del cliente corretto

---

## 🔄 Setup Cliente Successivo

Quando si chiude il secondo cliente (Gianluca se Federico è il primo, o viceversa):

1. **Acquista NUOVO numero Twilio** per il secondo cliente
2. **Collega numero Twilio al nuovo assistant**:
   - Vai a `/admin/setup/[orderId]` per il nuovo cliente
   - Inserisci il NUOVO numero Twilio (NON lo stesso del primo!)
   - Il sistema collegherà il numero all'assistant del nuovo cliente

3. **Verifica**:
   - Ogni cliente ha il suo numero Twilio dedicato
   - Ogni numero è collegato al suo assistant Vapi
   - Chiamate simultanee funzionano correttamente (ogni numero → suo assistant)

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

### Problema: Chiamate simultanee vanno al cliente sbagliato
- **Check**: Ogni cliente ha il SUO numero Twilio dedicato?
- **Check**: Ogni numero è collegato al SUO assistant Vapi?
- **Check**: Mapping 1:1 rispettato (Numero → Assistant → Cliente)?

---

## 📝 Note Importanti

1. **⚠️ UN NUMERO TWILIO = UN CLIENTE (NON CONDIVIDERE!)**
   - Ogni cliente deve avere il SUO numero Twilio dedicato
   - Se due clienti condividono un numero e ricevono chiamate contemporaneamente, Vapi non può distinguere quale assistant usare
   - **Mapping 1:1**: Numero Twilio → Assistant Vapi → Cliente

2. **Numero Twilio può fare Voice + WhatsApp**
   - Lo stesso numero può ricevere chiamate (Voice) e inviare WhatsApp
   - Non serve SMS capability

3. **Routing Zone**
   - Se il cliente ha zone configurate, il WhatsApp viene inviato all'agente della zona
   - Altrimenti usa `TWILIO_DESTINATION_WHATSAPP` come default

4. **Formato Numeri**
   - Twilio: `+39XXXXXXXXX` (E.164 format)
   - WhatsApp: `whatsapp:+39XXXXXXXXX` (prefisso `whatsapp:` obbligatorio)

5. **Gestione Numeri**
   - Numero Twilio del cliente salvato in Firestore: `orders/{orderId}/twilio_phone_number`
   - Quando si invia WhatsApp, il sistema legge il numero dal record ordine del cliente
   - Non serve configurare ogni numero nelle env vars (solo default/fallback)

---

## ✅ Checklist Setup (PER OGNI CLIENTE)

### Cliente 1 (Federico o Gianluca)
- [ ] Numero Twilio DEDICATO acquistato/configurato
- [ ] WhatsApp Business API abilitato sul numero
- [ ] Numero Twilio collegato a Vapi assistant del cliente
- [ ] Environment variables configurate (Vercel + GCP) - solo default/fallback
- [ ] Webhook Vapi configurato correttamente
- [ ] Cliente ha configurato inoltro chiamata dal suo numero fisso → suo numero Twilio
- [ ] Test chiamata end-to-end funzionante
- [ ] Test WhatsApp ricevuto correttamente
- [ ] Dati chiamata salvati in Firestore
- [ ] Dashboard cliente mostra lead e chiamate

### Cliente 2 (l'altro)
- [ ] **NUOVO** numero Twilio DEDICATO acquistato/configurato (NON lo stesso del primo!)
- [ ] WhatsApp Business API abilitato sul numero
- [ ] Numero Twilio collegato a Vapi assistant del cliente
- [ ] Cliente ha configurato inoltro chiamata dal suo numero fisso → suo numero Twilio
- [ ] Test chiamata end-to-end funzionante
- [ ] Test chiamate simultanee: entrambi i clienti possono ricevere chiamate contemporaneamente

---

**Ultimo aggiornamento:** 2025-01-28

---

## ⚠️ PERCHÉ NON POSSONO CONDIVIDERE UN NUMERO?

### Problema 1: Limite Fisico del Numero
**Un numero Twilio può gestire UNA SOLA chiamata alla volta!**

Se due clienti condividono lo stesso numero:
- ✅ Chiamata 1 arriva → numero occupato → chiamata gestita
- ❌ Chiamata 2 arriva (contemporanea) → **RIMBALZATA/BUSY** perché il numero è già in uso!

**Esempio:**
- Federico e Gianluca condividono `+39XXXXXXXXX`
- Alle 10:00 arriva chiamata per Federico → numero occupato
- Alle 10:00:30 arriva chiamata per Gianluca → **RIMBALZATA** (numero già occupato)

### Problema 2: Routing Assistant
Anche se il numero potesse gestire più chiamate, Vapi non può sapere quale assistant usare quando arriva una chiamata su un numero condiviso.

### Soluzione: Un Numero = Un Cliente
- ✅ Federico ha `+39XXXXXXXXX` → gestisce le sue chiamate
- ✅ Gianluca ha `+39YYYYYYYYY` → gestisce le sue chiamate
- ✅ Chiamate simultanee → ogni numero gestisce la sua → nessun rimbocco

