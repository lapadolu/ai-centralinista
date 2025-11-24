# Guida Acquisto Numero Twilio Italiano

## Cosa Serve al Sistema

Il sistema usa Twilio per **due scopi**:

### 1. **Chiamate in Arrivo (Voice)**
- Numero che i clienti chiamano
- Deve supportare **Voice** (ricevere chiamate)
- Viene collegato a Vapi Agent
- Quando qualcuno chiama → Vapi risponde automaticamente

### 2. **Invio WhatsApp (Messaging)**
- **IMPORTANTE:** WhatsApp Business API è diverso da SMS
- Puoi usare **lo stesso numero Voice** per WhatsApp Business API
- Non serve un numero separato per SMS
- Il numero Voice può essere verificato per WhatsApp Business API

---

## Analisi Opzioni Twilio

### Opzione 1: Numero +800 (Numero Verde)
- ✅ **Può ricevere chiamate** (Voice)
- ✅ **Può essere verificato per WhatsApp Business API**
- 💰 Costo: generalmente più economico

**Nota:** Anche i numeri +800 possono essere verificati per WhatsApp Business API.

### Opzione 2: Numero +39 (Mobile Italiano)
- ✅ **Può ricevere chiamate** (Voice)
- ✅ **Può essere verificato per WhatsApp Business API**
- 💰 Costo: generalmente più costoso del +800

**Vantaggio:** Più professionale per clienti italiani (numero mobile italiano).

---

## Soluzione Consigliata

### **Acquista un Numero Voice (può essere +800 o +39)**

**IMPORTANTE:** 
- **SMS è diverso da WhatsApp**
- Per WhatsApp Business API **NON serve un numero SMS separato**
- Puoi usare **lo stesso numero Voice** per WhatsApp Business API
- **Non servono 2 numeri!**

**Cosa fare:**
1. Acquista un numero Voice (+800 o +39)
2. Usalo per le chiamate (collegalo a Vapi)
3. Verificalo per WhatsApp Business API su Twilio (stesso numero!)
4. Configuralo come `TWILIO_WHATSAPP_NUMBER` nelle env vars

---

## 🔧 Configurazione Dopo l'Acquisto

### Step 1: Acquista Numero +39
- Vai su Twilio Console → Phone Numbers → Buy a Number
- Cerca numeri italiani (+39)
- Seleziona un numero che supporta **Voice + SMS**
- Completa l'acquisto

### Step 2: Configura per Chiamate (Vapi)
Il sistema lo farà automaticamente quando:
- Vai su `/admin/setup/[orderId]`
- Clicchi "Acquista Numero Twilio"
- Il sistema acquista e collega automaticamente a Vapi

**Oppure manualmente:**
- Il numero viene collegato a Vapi tramite `linkTwilioNumberToVapi()`
- Vapi gestisce le chiamate in arrivo

### Step 3: Verifica per WhatsApp Business API

**IMPORTANTE:** 
- **SMS è diverso da WhatsApp Business API**
- Per WhatsApp Business API **NON serve un numero SMS separato**
- Puoi verificare **lo stesso numero Voice** per WhatsApp Business API

**Come verificare:**
1. Vai su **Twilio Console → Messaging → Try it out → Send a WhatsApp message**
2. Oppure vai su **Messaging → Senders → WhatsApp**
3. Verifica il tuo numero Voice (stesso numero usato per le chiamate!)
4. Twilio ti guiderà nel processo di verifica

**Nota:** La verifica WhatsApp può richiedere:
- Verifica del numero di telefono
- Approvazione da Twilio (per numeri italiani può richiedere documentazione)
- Setup del profilo WhatsApp Business

### Step 4: Aggiorna Environment Variables

Dopo aver verificato il numero per WhatsApp:

**Cloud Function (GCP):**
```bash
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXXX  # Il tuo numero Voice verificato
```

**Vercel (Dashboard):**
```bash
TWILIO_WHATSAPP_NUMBER=whatsapp:+39XXXXXXXXXX
```

**Redeploy:**
- Cloud Function: `./deploy-vapi-webhook.sh`
- Vercel: automatico al prossimo push

---

## Note Importanti

### SMS vs WhatsApp Business API
- **SMS** e **WhatsApp Business API** sono servizi diversi
- Per WhatsApp Business API **NON serve un numero SMS**
- Puoi usare **lo stesso numero Voice** per WhatsApp Business API
- **Non servono 2 numeri!**

### Verifica WhatsApp Business API
- **Non è automatica** - devi verificare manualmente il numero
- Per numeri italiani può richiedere documentazione aziendale
- Twilio ti guiderà nel processo
- Una volta verificato, puoi usarlo per inviare WhatsApp

### Costi
- Numero Voice (+800 o +39): generalmente €1-2/mese + costi per chiamate
- WhatsApp Business API: costi per messaggio (vedi pricing Twilio)
- **Non serve un numero SMS separato!**

---

## Checklist Post-Acquisto

- [ ] Numero Voice acquistato su Twilio (+800 o +39)
- [ ] Numero collegato a Vapi per chiamate
- [ ] Numero verificato per WhatsApp Business API (stesso numero!)
- [ ] `TWILIO_WHATSAPP_NUMBER` aggiornato nelle env vars
- [ ] Cloud Function redeployata con nuovo numero
- [ ] Test chiamata: chiama il numero e verifica che Vapi risponda
- [ ] Test WhatsApp: verifica che le notifiche arrivino correttamente

---

## Conclusione

**Raccomandazione:** Acquista **un solo numero Voice** (+800 o +39).

**Motivi:**
1. **Un solo numero** per chiamate e WhatsApp
2. **SMS è diverso da WhatsApp** - non serve numero SMS separato
3. Più semplice da gestire
4. Più economico (un solo numero invece di due)

**Dopo l'acquisto:**
1. Collega il numero a Vapi per le chiamate
2. Verifica lo stesso numero per WhatsApp Business API su Twilio
3. Aggiorna `TWILIO_WHATSAPP_NUMBER` nelle env vars
4. Redeploy Cloud Function
5. Testa tutto!

---

*Ultimo aggiornamento: Dicembre 2024*

