# Revisione Messaggio WhatsApp

## Messaggio Attuale

Il messaggio viene generato in `backend/functions/notification.py` (linea ~81-200).

### Formato Attuale:
```
🔔 *Nuovo Lead - [Nome]*

🎯 [Riassunto ricerca: "Cerca di comprare un appartamento in zona Porta Romana con budget 300k"]

📞 *Contatto:* [telefono]

📝 *Dettagli:* [note se presenti]

━━━━━━━━━━━━━━━━
💡 *COSA PROPORGLI*

Immobile ideale: *appartamento*
Zona target: *Porta Romana*
Range prezzo: *300k*
Must-have: balcone, luminoso

→ *Mostragli immobili disponibili che matchano questi criteri*
```

## Punti da Valutare

### 1. **Tono e Professionalità**
- ✅ Formale ma amichevole
- ✅ Usa emoji per leggibilità
- ⚠️ Valutare se ridurre emoji per professionalità

### 2. **Struttura**
- ✅ Header chiaro con nome cliente
- ✅ Riassunto immediato della ricerca
- ✅ Contatto prominente
- ✅ Raccomandazione intelligente
- ⚠️ Valutare se aggiungere timestamp chiamata

### 3. **Contenuto**
- ✅ Informazioni essenziali
- ✅ Raccomandazione basata su dati
- ⚠️ Valutare se aggiungere link a CRM/piattaforma
- ⚠️ Valutare se aggiungere priorità (urgente/normale)

### 4. **Call-to-Action**
- ⚠️ Attualmente: "Contatta subito per non perdere questo lead!" (non presente nel codice attuale)
- ✅ Raccomandazione specifica su cosa proporre

## Suggerimenti per Miglioramento

### Opzione 1: Più Professionale (meno emoji)
```
*NUOVO LEAD - [Nome]*

*Ricerca:* [riassunto]

*Contatto:* [telefono]
*Zona:* [zona]
*Budget:* [budget]

*Raccomandazione:*
[consiglio personalizzato]

Contatta entro 15 minuti per massimizzare conversioni.
```

### Opzione 2: Più Dettagliato (con timestamp)
```
🔔 *Nuovo Lead - [Nome]*
📅 [Data e ora chiamata]

🎯 *Ricerca:*
[riassunto dettagliato]

📋 *Dettagli Completi:*
• Telefono: [numero]
• Tipo: [comprare/vendere]
• Immobile: [tipo]
• Zona: [zona]
• Budget: [budget]
• Note: [note]

⏱️ Durata chiamata: [X:XX min]

💡 *Raccomandazione:*
[consiglio personalizzato]

📞 Contatta subito - Lead caldo!
```

### Opzione 3: Con Link CRM (se disponibile)
```
🔔 *Nuovo Lead - [Nome]*

[riassunto + dettagli]

💡 *Raccomandazione:*
[consiglio]

📱 [Link al lead nel CRM]
📞 Contatta: [telefono]
```

## Dove Modificare

**File:** `backend/functions/notification.py`
**Funzione:** `send_whatsapp_notification()` (linea ~81)
**Variabile:** `message_parts` (linea ~126)

Modifica la lista `message_parts` per cambiare formato, tono, contenuto.

## Test Consigliati

1. Invia messaggio di test a te stesso
2. Valuta leggibilità su mobile
3. Verifica che tutte le info importanti siano presenti
4. Testa con diversi tipi di lead (comprare/vendere, con/senza budget, etc.)
5. Chiedi feedback all'amico dopo demo

