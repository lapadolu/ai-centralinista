import os
import functions_framework
from twilio.twiml.voice_response import VoiceResponse, Gather
import logging
import json
from ai_processor import process_conversation_with_ai, extract_client_info

logging.basicConfig(level=logging.INFO)

# Store conversation state (in production, use Redis or database)
conversation_states = {}

@functions_framework.http
def call_handler(request):
    """Handles incoming Twilio voice calls with AI conversation."""
    
    # Parse Twilio request
    call_sid = request.form.get('CallSid')
    from_number = request.form.get('From')
    to_number = request.form.get('To')
    speech_result = request.form.get('SpeechResult', '')
    
    response = VoiceResponse()
    
    # Initialize conversation state for new calls
    if call_sid not in conversation_states:
        conversation_states[call_sid] = {
            'history': [],
            'client_info': {},
            'turn_count': 0,
            'stage': 'greeting'  # greeting, confirmation, questions, closing
        }
    
    conversation_state = conversation_states[call_sid]
    
    # Check if this is a callback from gather
    if speech_result:
        conversation_state['turn_count'] += 1
        
        # Process based on conversation stage
        if conversation_state['stage'] == 'greeting':
            # User confirmed, move to questions
            if any(word in speech_result.lower() for word in ['sì', 'si', 'ok', 'va bene', 'perfetto', 'certo']):
                conversation_state['stage'] = 'questions'
                ai_response = "Perfetto! Allora iniziamo. Qual è il suo nome?"
            else:
                ai_response = "Capisco. Un nostro agente la ricontatterà più tardi. Grazie e arrivederci!"
                response.say(language="it-IT", voice="woman", message=ai_response)
                response.hangup()
                return str(response)
                
        elif conversation_state['stage'] == 'questions':
            # Process user speech with OpenAI for natural conversation
            ai_response, updated_history = process_conversation_with_ai(
                speech_result, 
                conversation_state['history'],
                conversation_state['turn_count']
            )
            conversation_state['history'] = updated_history
            
            # Check if we have enough information
            if conversation_state['turn_count'] >= 3:
                conversation_state['stage'] = 'closing'
                ai_response = "Perfetto! Ho tutte le informazioni necessarie. Un nostro agente la ricontatterà entro 30 minuti. Grazie e arrivederci!"
        
        # Say AI response with natural female voice
        response.say(
            language="it-IT", 
            voice="woman", 
            message=ai_response
        )
        
        # Continue conversation if not closing
        if conversation_state['stage'] != 'closing':
            gather = Gather(
                input='speech',
                language='it-IT',
                speech_timeout=4,
                action='/call-handler',
                method='POST'
            )
            response.append(gather)
            
            # Fallback if no input
            response.say("Non ho ricevuto risposta. Riprovi più tardi.", voice="woman")
            response.hangup()
        else:
            # Send notification and end call
            client_info = extract_client_info(conversation_state['history'])
            send_notification(from_number, client_info)
            response.hangup()
        
    else:
        # Initial greeting - short and interactive
        welcome_msg = """Ciao! Sono l'assistente digitale di IconaCasa Lambrate. 
        Posso chiederti alcune informazioni da passare all'agente che ti richiamerà?"""
        
        response.say(
            language="it-IT", 
            voice="woman", 
            message=welcome_msg
        )
        
        # Gather user confirmation
        gather = Gather(
            input='speech',
            language='it-IT',
            speech_timeout=5,
            action='/call-handler',
            method='POST'
        )
        gather.say("Dimmi pure sì o no.", voice="woman")
        response.append(gather)
        
        # Fallback if no input
        response.say("Non ho ricevuto risposta. Riprovi più tardi.", voice="woman")
        response.hangup()
    
    return str(response)

def send_notification(caller_number, client_info):
    """Send WhatsApp notification with client information."""
    
    # Format message
    message = f"""🏠 *Nuova richiesta Iconacasa Milano*

📞 *Chiamata da:* {caller_number}
👤 *Nome:* {client_info.get('nome', 'Non specificato')}
🏠 *Richiesta:* {client_info.get('tipo_richiesta', 'Non specificato')}
📍 *Zona:* {client_info.get('zona', 'Non specificato')}
🏢 *Tipo immobile:* {client_info.get('tipo_immobile', 'Non specificato')}
💰 *Budget:* {client_info.get('budget', 'Non specificato')}
📝 *Note:* {client_info.get('note', 'Nessuna')}

⏰ *Chiamata ricevuta:* {os.environ.get('CURRENT_TIME', 'Ora')}

Un nostro agente ricontatterà il cliente entro 30 minuti."""
    
    # TODO: Implement WhatsApp sending
    logging.info(f"WhatsApp notification: {message}")
    
    return True
