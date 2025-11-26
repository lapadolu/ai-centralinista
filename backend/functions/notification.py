import os
from twilio.rest import Client
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

# Initialize Twilio Client
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')

if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
else:
    twilio_client = None


def generate_recommendation(tipo_richiesta, tipo_immobile, zona, budget, note):
    """
    Analizza i dati del cliente e genera un riassunto intelligente
    di cosa proporgli basandosi su tipo richiesta, immobile, zona, budget, note.
    """
    rec_parts = []
    
    # Determine property type details
    if tipo_immobile and tipo_immobile != 'Non specificato':
        rec_parts.append(f"Immobile ideale: *{tipo_immobile}*")
    
    # Location specifics
    if zona and zona != 'Non specificato':
        rec_parts.append(f"Zona target: *{zona}*")
    
    # Budget analysis
    if budget and budget != 'Non specificato':
        budget_str = budget.lower()
        if 'non specificato' not in budget_str and budget_str != 'n/a':
            rec_parts.append(f"Range prezzo: *{budget}*")
    
    # Extract key requirements from notes
    if note and note != 'Nessuna':
        note_lower = note.lower()
        
        # Key features
        features = []
        if 'balcon' in note_lower:
            features.append('balcone')
        if 'terrazzo' in note_lower or 'terrazza' in note_lower:
            features.append('terrazzo')
        if 'luce' in note_lower or 'luminoso' in note_lower or 'sole' in note_lower:
            features.append('luminoso')
        if 'piano alto' in note_lower or 'ultimo piano' in note_lower:
            features.append('piano alto')
        if 'ascensore' in note_lower:
            features.append('con ascensore')
        if 'garage' in note_lower or 'box' in note_lower or 'posto auto' in note_lower:
            features.append('posto auto')
        if 'cantina' in note_lower:
            features.append('cantina')
        if 'ristrutturato' in note_lower or 'nuovo' in note_lower:
            features.append('ristrutturato')
        if 'arredato' in note_lower:
            features.append('arredato')
        
        if features:
            rec_parts.append(f"Must-have: {', '.join(features)}")
    
    # Build recommendation text
    if tipo_richiesta and tipo_richiesta.lower() == 'comprare':
        action = "Mostragli immobili disponibili che matchano questi criteri"
    elif tipo_richiesta and tipo_richiesta.lower() == 'vendere':
        action = "Fissa appuntamento per valutazione immobile"
    else:
        action = "Contattalo per capire meglio le sue esigenze"
    
    if rec_parts:
        return "\n".join(rec_parts) + f"\n\n→ *{action}*"
    else:
        return f"→ *{action}*"

def send_whatsapp_notification(client_info, caller_number, transcript='', call_id='', duration=0, destination_override=None):
    """Send WhatsApp notification with full summary to real estate agent."""
    
    if not twilio_client:
        logging.error("Twilio client not initialized")
        return False
    
    # Format message
    current_time = datetime.now().strftime("%H:%M del %d %B %Y")
    
    # Extract client info
    nome = client_info.get('nome', '') or 'Non specificato'
    telefono = client_info.get('telefono', '') or caller_number
    tipo_richiesta = client_info.get('tipo_richiesta', '') or 'Non specificato'
    zona = client_info.get('zona', '') or 'Non specificato'
    tipo_immobile = client_info.get('tipo_immobile', '') or 'Non specificato'
    budget = client_info.get('budget', '') or 'Non specificato'
    note = client_info.get('note', '') or 'Nessuna'
    
    # Format duration (handle zero correctly)
    duration_mins = duration // 60 if duration is not None else 0
    duration_secs = duration % 60 if duration is not None else 0
    duration_str = f"{duration_mins}:{duration_secs:02d}" if duration is not None else "N/A"
    
    # Create one-line summary
    summary_parts = []
    if nome != 'Non specificato':
        summary_parts.append(f"{nome}")
    if tipo_richiesta != 'Non specificato':
        summary_parts.append(f"vuole {tipo_richiesta}")
    if zona != 'Non specificato':
        summary_parts.append(f"in zona {zona}")
    if tipo_immobile != 'Non specificato':
        summary_parts.append(f"un {tipo_immobile}")
    
    summary = " ".join(summary_parts) if summary_parts else "Nuovo contatto"
    
    # Check urgency
    urgency_words = ['urgente', 'subito', 'immediato', 'veloce', 'presto', 'asap', 'urgenza']
    urgency_found = any(word in str(note).lower() for word in urgency_words) if note != 'Nessuna' else False
    urgency_symbol = "🚨" if urgency_found else "📞"
    
    # Build intelligent summary message
    
    # Header (include urgency symbol)
    message_parts = [f"{urgency_symbol} *Nuovo Lead - {nome}*", ""]
    
    # Create intelligent search summary
    search_summary = []
    
    if tipo_richiesta != 'Non specificato':
        action = "Cerca di comprare" if tipo_richiesta.lower() == "comprare" else "Vuole vendere"
        search_summary.append(action)
    
    if tipo_immobile != 'Non specificato':
        search_summary.append(f"un {tipo_immobile.lower()}")
    
    if zona != 'Non specificato':
        search_summary.append(f"in zona {zona}")
    
    if budget != 'Non specificato':
        search_summary.append(f"con budget {budget}")
    
    # Add intelligent summary
    if search_summary:
        summary_text = " ".join(search_summary)
        message_parts.append(f"🎯 {summary_text}")
        message_parts.append("")
    
    # Contact info
    message_parts.append(f"📞 *Contatto:* {telefono}")
    
    # Additional context from notes (if important details)
    if note and note != 'Nessuna':
        message_parts.append(f"📝 *Dettagli:* {note}")
    
    # Build final search recommendation
    message_parts.append("")
    message_parts.append("━━━━━━━━━━━━━━━━")
    message_parts.append("💡 *COSA PROPORGLI*")
    message_parts.append("")
    
    # Generate smart recommendation based on collected data
    recommendation = generate_recommendation(tipo_richiesta, tipo_immobile, zona, budget, note)
    message_parts.append(recommendation)
    
    message = "\n".join(message_parts)
    
    # Get destination - priorità: override (zona routing) > env var > default
    destination = destination_override or os.environ.get('TWILIO_DESTINATION_WHATSAPP', 'whatsapp:+393394197445')
    
    try:
        logging.info(f"Sending WhatsApp to {destination}")
        logging.info(f"Message length: {len(message)} chars")
        
        message_response = twilio_client.messages.create(
            body=message,
            from_=TWILIO_WHATSAPP_NUMBER,
            to=destination
        )
        
        logging.info(f"WhatsApp sent successfully! SID: {message_response.sid}")
        return True
    except Exception as e:
        logging.error(f"WhatsApp send failed: {e}")
        # Try SMS fallback if configured
        twilio_phone = os.environ.get('TWILIO_PHONE_NUMBER')
        destination_sms = os.environ.get('TWILIO_DESTINATION_SMS', '+393394197445')
        
        if twilio_phone:
            try:
                twilio_client.messages.create(
                    body=f"[CENTRALINISTA AI]\n\n{message}",
                    from_=twilio_phone,
                    to=destination_sms
                )
                return True
            except:
                pass
        return False
