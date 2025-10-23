import os
import functions_framework
from twilio.rest import Client
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)

# Initialize Twilio Client
TWILIO_ACCOUNT_SID = os.environ.get('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
TWILIO_WHATSAPP_NUMBER = os.environ.get('TWILIO_WHATSAPP_NUMBER', 'whatsapp:+14155238886')  # Sandbox number

if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN:
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
else:
    logging.warning("Twilio credentials not set")
    twilio_client = None

def send_whatsapp_notification(client_info, caller_number):
    """Send WhatsApp notification to real estate agent."""
    
    if not twilio_client:
        logging.error("Twilio client not initialized")
        return False
    
    # Format message
    current_time = datetime.now().strftime("%d/%m/%Y alle %H:%M")
    
    message = f"""🏠 *Nuova richiesta Iconacasa Milano*

📞 *Chiamata da:* {caller_number}
👤 *Nome:* {client_info.get('nome', 'Non specificato')}
🏠 *Richiesta:* {client_info.get('tipo_richiesta', 'Non specificato')}
📍 *Zona:* {client_info.get('zona', 'Non specificato')}
🏢 *Tipo immobile:* {client_info.get('tipo_immobile', 'Non specificato')}
💰 *Budget:* {client_info.get('budget', 'Non specificato')}
📝 *Note:* {client_info.get('note', 'Nessuna')}

⏰ *Chiamata ricevuta:* {current_time}

Un nostro agente ricontatterà il cliente entro 30 minuti."""
    
    try:
        # Send WhatsApp message
        message_response = twilio_client.messages.create(
            body=message,
            from_=TWILIO_WHATSAPP_NUMBER,
            to='whatsapp:+393394197445'  # Test number - replace with real agent number
        )
        
        logging.info(f"WhatsApp message sent: {message_response.sid}")
        return True
        
    except Exception as e:
        logging.error(f"WhatsApp sending failed: {e}")
        return False

def send_email_notification(client_info, caller_number):
    """Send email notification as fallback."""
    
    # TODO: Implement email sending with SendGrid or similar
    logging.info(f"Email notification would be sent for caller: {caller_number}")
    return True

@functions_framework.http
def send_notification(request):
    """HTTP endpoint to send notifications."""
    
    if request.method != 'POST':
        return 'Method not allowed', 405
    
    try:
        data = request.get_json()
        client_info = data.get('client_info', {})
        caller_number = data.get('caller_number', '')
        
        # Try WhatsApp first
        success = send_whatsapp_notification(client_info, caller_number)
        
        if not success:
            # Fallback to email
            send_email_notification(client_info, caller_number)
        
        return {'status': 'success', 'whatsapp_sent': success}
        
    except Exception as e:
        logging.error(f"Notification error: {e}")
        return {'status': 'error', 'message': str(e)}, 500
