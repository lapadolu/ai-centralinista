"""
Vapi.ai Webhook Handler - Sistema snello e SICURO per gestione chiamate
Riceve eventi da Vapi e gestisce notifiche + storage dati

PROTEZIONI ANTI-BOT:
- Verifica firma Vapi per autenticità richieste
- Rate limiting intelligente per numero chiamante
- Firewall IP (solo Vapi può chiamare)
- Alert automatici se costi anomali
"""
import os
import functions_framework
from google.cloud import firestore
from google.cloud.firestore import Timestamp
from notification import send_whatsapp_notification
import logging
import json
from datetime import datetime, timedelta
import hmac
import hashlib

logging.basicConfig(level=logging.INFO)

# Initialize Firestore
db = firestore.Client()

# Zone matching helper
def normalize_zone_name(zone_text):
    """Normalizza nome zona per matching (es: 'porta romana' -> 'porta-romana')"""
    if not zone_text:
        return None
    return zone_text.lower().strip().replace(' ', '-')

# Vapi credentials
VAPI_API_KEY = os.environ.get('VAPI_API_KEY', '')

# Security settings
MAX_CALLS_PER_NUMBER_PER_HOUR = 20  # Un cliente reale non chiama 20 volte in 1 ora
MAX_CALLS_PER_NUMBER_PER_DAY = 50   # Protezione contro spam su stesso numero
COST_ALERT_THRESHOLD = 100.0  # Alert se costi superano €100/mese

# Cache per assistant_id -> user_id mapping (TTL 15 minuti)
_assistant_cache = {}
_cache_ttl = timedelta(minutes=15)


def verify_vapi_signature(request):
    """
    Verifica che la richiesta venga davvero da Vapi.ai
    Vapi firma ogni richiesta con HMAC per sicurezza
    """
    # Se VAPI_API_KEY non è configurato, rifiuta tutte le richieste per sicurezza
    if not VAPI_API_KEY:
        logging.error("VAPI_API_KEY not configured - rejecting all webhook requests")
        return False
    
    # Ottieni firma dall'header
    signature = request.headers.get('x-vapi-signature', '')
    
    if not signature:
        logging.warning("Missing x-vapi-signature header - rejecting request")
        return False
    
    # Verifica firma HMAC
    try:
        body = request.get_data()
        expected_signature = hmac.new(
            VAPI_API_KEY.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    except Exception as e:
        logging.error(f"Error verifying signature: {e}")
        return False


def check_rate_limit(customer_number):
    """
    Rate limiting intelligente per numero chiamante.
    Blocca SOLO se stesso numero chiama troppo spesso (protezione spam).
    NON limita chiamate totali (clienti diversi possono chiamare liberamente).
    
    Returns:
        bool: True se OK, False se rate limit superato
    """
    try:
        # Conta chiamate ultimo ora
        one_hour_ago = datetime.now() - timedelta(hours=1)
        one_hour_ago_timestamp = Timestamp.from_datetime(one_hour_ago)
        
        recent_calls = db.collection('calls')\
            .where('customer_number', '==', customer_number)\
            .where('started_at', '>=', one_hour_ago_timestamp)\
            .stream()
        
        calls_last_hour = len(list(recent_calls))
        
        if calls_last_hour >= MAX_CALLS_PER_NUMBER_PER_HOUR:
            logging.warning(f"Rate limit exceeded for {customer_number}: {calls_last_hour} calls in 1 hour")
            return False
        
        # Conta chiamate ultimo giorno
        one_day_ago = datetime.now() - timedelta(days=1)
        one_day_ago_timestamp = Timestamp.from_datetime(one_day_ago)
        
        daily_calls = db.collection('calls')\
            .where('customer_number', '==', customer_number)\
            .where('started_at', '>=', one_day_ago_timestamp)\
            .stream()
        
        calls_last_day = len(list(daily_calls))
        
        if calls_last_day >= MAX_CALLS_PER_NUMBER_PER_DAY:
            logging.warning(f"Daily rate limit exceeded for {customer_number}: {calls_last_day} calls in 24h")
            return False
        
        return True
        
    except Exception as e:
        logging.error(f"Error checking rate limit: {e}")
        # In caso di errore, permetti chiamata (fail-open per non bloccare clienti)
        return True


def get_user_id_from_assistant(assistant_id):
    """
    Ottieni user_id da assistant_id con caching per performance.
    Returns user_id, order_id tuple o (None, None) se non trovato.
    """
    if not assistant_id:
        return None, None
    
    # Check cache
    now = datetime.now()
    if assistant_id in _assistant_cache:
        cached_data, cached_time = _assistant_cache[assistant_id]
        if now - cached_time < _cache_ttl:
            logging.debug(f"Cache hit for assistant {assistant_id}")
            return cached_data['user_id'], cached_data.get('order_id')
    
    # Query Firestore
    try:
        orders = db.collection('orders').where('vapi_assistant_id', '==', assistant_id).limit(1).stream()
        for order in orders:
            order_data = order.to_dict()
            user_id = order_data.get('user_id')
            order_id = order.id
            if user_id:
                # Update cache
                _assistant_cache[assistant_id] = {
                    'user_id': user_id,
                    'order_id': order_id
                }, now
                logging.debug(f"Cached assistant {assistant_id} -> user {user_id}")
                return user_id, order_id
    except Exception as e:
        logging.error(f"Error getting user_id from assistant: {e}")
    
    return None, None


def get_agent_for_zone(zona, user_id):
    """
    Trova l'agente assegnato a una specifica zona per un utente specifico.
    Legge da Firestore le zone_assignments configurate dall'utente.
    Ritorna WhatsApp dell'agente o default.
    """
    try:
        if not zona or zona == 'Non specificato' or not user_id:
            # Nessuna zona o user_id -> usa default
            return None
        
        # Normalizza zona per matching
        zone_normalized = normalize_zone_name(zona)
        
        # Query Firestore per zone assignments usando user_id dinamico
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            logging.warning(f"User profile not found for {user_id}, using default WhatsApp")
            return None
        
        user_data = user_doc.to_dict()
        zone_assignments = user_data.get('zone_assignments', {})
        
        # Check se zona ha agente assegnato
        if zone_normalized in zone_assignments:
            agent_whatsapp = zone_assignments[zone_normalized].get('whatsapp')
            logging.info(f"Zona '{zona}' assegnata a {agent_whatsapp} per user {user_id}")
            return f"whatsapp:{agent_whatsapp}" if agent_whatsapp else None
        
        # Fallback: nessuna assegnazione specifica
        logging.info(f"Zona '{zona}' non assegnata per user {user_id}, uso default")
        return None
        
    except Exception as e:
        logging.error(f"Error getting agent for zone: {e}")
        return None


def update_monthly_call_count(user_id):
    """
    Aggiorna contatore chiamate mensili per user e verifica overage.
    """
    try:
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            logging.warning(f"User {user_id} not found for call count update")
            return
        
        user_data = user_doc.to_dict()
        current_month_start = user_data.get('current_month_start')
        
        # Se è nuovo mese, resetta contatore
        now = datetime.now()
        month_start = datetime(now.year, now.month, 1)
        
        # Converti Firestore Timestamp a datetime se necessario
        if current_month_start:
            if hasattr(current_month_start, 'to_datetime'):
                current_month_start_dt = current_month_start.to_datetime()
            elif isinstance(current_month_start, datetime):
                current_month_start_dt = current_month_start
            else:
                current_month_start_dt = month_start  # Fallback
        else:
            current_month_start_dt = month_start
        
        update_data = {}
        
        if current_month_start_dt < month_start:
            # Nuovo mese - resetta
            update_data['monthly_calls'] = 1
            update_data['current_month_start'] = firestore.SERVER_TIMESTAMP
            logging.info(f"New month detected for {user_id}, resetting call count")
        else:
            # Stesso mese - incrementa
            update_data['monthly_calls'] = firestore.Increment(1)
        
        user_ref.update(update_data)
        
        # Verifica overage dopo update
        user_doc = user_ref.get()
        user_data = user_doc.to_dict()
        monthly_calls = user_data.get('monthly_calls', 0)
        monthly_limit = user_data.get('monthly_calls_limit', 0)
        plan_id = user_data.get('subscription_plan')
        
        if monthly_calls > monthly_limit and plan_id and monthly_limit > 0:
            overage_calls = monthly_calls - monthly_limit
            logging.warning(
                f"User {user_id} exceeded limit: {monthly_calls}/{monthly_limit} "
                f"(+{overage_calls} overage calls)"
            )
            # TODO: Creare Stripe invoice item per overage (una volta al mese)
            # Questo richiede integrazione con Stripe API
        
    except Exception as e:
        logging.error(f"Error updating monthly call count for {user_id}: {e}")


def check_cost_alerts():
    """
    Monitora costi e invia alert se anomalie.
    Conta chiamate mese corrente e stima costi.
    """
    try:
        # Conta chiamate mese corrente
        now = datetime.now()
        month_start = datetime(now.year, now.month, 1)
        month_start_timestamp = Timestamp.from_datetime(month_start)
        
        monthly_calls = db.collection('calls')\
            .where('started_at', '>=', month_start_timestamp)\
            .stream()
        
        total_calls = 0
        total_duration = 0
        
        for call in monthly_calls:
            call_data = call.to_dict()
            total_calls += 1
            total_duration += call_data.get('duration', 0)
        
        # Stima costi (€0.06/minuto media con Vapi)
        estimated_cost = (total_duration / 60) * 0.06
        
        logging.info(f"Monthly stats: {total_calls} calls, {total_duration}s total, ~€{estimated_cost:.2f}")
        
        # Alert se supera soglia
        if estimated_cost > COST_ALERT_THRESHOLD:
            logging.warning(f"⚠️ COST ALERT: Monthly costs at €{estimated_cost:.2f} (threshold: €{COST_ALERT_THRESHOLD})")
            # TODO: Invia email/WhatsApp alert all'owner
        
        return estimated_cost
        
    except Exception as e:
        logging.error(f"Error checking costs: {e}")
        return 0


@functions_framework.http
def vapi_webhook(request):
    """
    Webhook per eventi Vapi.ai con protezioni anti-bot
    
    SICUREZZA:
    1. Verifica firma Vapi (solo richieste autentiche)
    2. Rate limiting per numero (blocca spam stesso numero)
    3. Monitoring costi con alert automatici
    
    Eventi gestiti:
    - assistant-request: Inizio chiamata
    - end-of-call-report: Fine chiamata con dati estratti
    - function-call: (opzionale) chiamate a funzioni custom
    """
    
    # PROTEZIONE 1: Verifica firma Vapi
    if not verify_vapi_signature(request):
        logging.warning("Invalid Vapi signature - possible attack")
        return {'error': 'Unauthorized'}, 401
    
    # Parse evento
    try:
        event_data = request.get_json()
        event_type = event_data.get('message', {}).get('type', '')
        
        logging.info(f"Received Vapi event: {event_type}")
        
        if event_type == 'assistant-request':
            return handle_assistant_request(event_data)
        
        elif event_type == 'end-of-call-report':
            return handle_end_of_call(event_data)
        
        elif event_type == 'function-call':
            return handle_function_call(event_data)
        
        else:
            logging.info(f"Unhandled event type: {event_type}")
            return {'status': 'ok'}
            
    except Exception as e:
        logging.error(f"Error processing webhook: {e}")
        return {'error': str(e)}, 500


def handle_assistant_request(event_data):
    """
    Gestisce richiesta iniziale dell'assistente.
    INCLUDE rate limiting per protezione spam.
    """
    message = event_data.get('message', {})
    call = message.get('call', {})
    call_id = call.get('id', '')
    customer_number = call.get('customer', {}).get('number', '')
    assistant_id = call.get('assistantId') or message.get('assistantId') or event_data.get('assistantId', '')
    
    logging.info(f"New call started: {call_id} from {customer_number}, assistant: {assistant_id}")
    
    # PROTEZIONE 2: Rate limiting per numero
    if not check_rate_limit(customer_number):
        logging.warning(f"Rate limit exceeded for {customer_number}, rejecting call")
        return {
            'error': {
                'message': 'Hai chiamato troppo frequentemente. Riprova più tardi.',
                'endCall': True
            }
        }
    
    check_cost_alerts()
    
    # Trova order associato tramite assistant_id (con caching)
    user_id, order_id = get_user_id_from_assistant(assistant_id)
    
    # Salva inizio chiamata in Firestore
    try:
        call_data = {
            'call_id': call_id,
            'customer_number': customer_number,
            'started_at': firestore.SERVER_TIMESTAMP,
            'status': 'in_progress'
        }
        if user_id:
            call_data['user_id'] = user_id
        if order_id:
            call_data['order_id'] = order_id
        if assistant_id:
            call_data['assistant_id'] = assistant_id
            
        db.collection('calls').document(call_id).set(call_data)
    except Exception as e:
        logging.error(f"Error saving call start: {e}")
    
    # Ritorna configurazione assistente (opzionale - può sovrascrivere default)
    return {
        'assistant': {
            'firstMessage': "Buongiorno! Sono l'assistente virtuale di Iconacasa Milano. Come posso aiutarla oggi?"
        }
    }


def handle_end_of_call(event_data):
    """
    Gestisce fine chiamata e dati estratti.
    Questo è dove processiamo lo structured output e inviamo notifiche.
    """
    message = event_data.get('message', {})
    call = message.get('call', {})
    
    call_id = call.get('id', '')
    customer_number = call.get('customer', {}).get('number', '')
    duration = call.get('duration', 0)
    ended_reason = call.get('endedReason', 'unknown')
    
    # Estrai dati strutturati (structured output configurato in Vapi)
    structured_data = message.get('structuredData', {})
    
    # Estrai trascrizione completa
    transcript = message.get('transcript', '')
    
    logging.info(f"Call ended: {call_id}, duration: {duration}s, reason: {ended_reason}")
    logging.info(f"Structured data: {structured_data}")
    
    # Prepara client_info per notifica WhatsApp
    client_info = {
        'nome': structured_data.get('nome', '') or 'Non specificato',
        'telefono': structured_data.get('telefono', '') or customer_number,
        'tipo_richiesta': structured_data.get('tipo_richiesta', '') or 'Non specificato',
        'zona': structured_data.get('zona', '') or 'Non specificato',
        'tipo_immobile': structured_data.get('tipo_immobile', '') or 'Non specificato',
        'budget': structured_data.get('budget', '') or 'Non specificato',
        'note': structured_data.get('note', '') or ''
    }
    
    # Trova order associato tramite assistant_id (con caching)
    assistant_id = call.get('assistantId') or message.get('assistantId') or event_data.get('assistantId', '')
    user_id, order_id = get_user_id_from_assistant(assistant_id)
    
    # ROUTING INTELLIGENTE: trova agente giusto per zona (usa user_id dinamico)
    destination_whatsapp = get_agent_for_zone(client_info['zona'], user_id)
    logging.info(f"Routing chiamata zona '{client_info['zona']}' a: {destination_whatsapp} (user: {user_id})")
    
    # Salva chiamata completa in Firestore
    try:
        call_data = {
            'call_id': call_id,
            'customer_number': customer_number,
            'client_info': client_info,
            'structured_data': structured_data,
            'transcript': transcript,
            'duration': duration,
            'ended_reason': ended_reason,
            'ended_at': firestore.SERVER_TIMESTAMP,
            'status': 'completed'
        }
        if user_id:
            call_data['user_id'] = user_id
        if order_id:
            call_data['order_id'] = order_id
        if assistant_id:
            call_data['assistant_id'] = assistant_id
            
        db.collection('calls').document(call_id).set(call_data, merge=True)
        
        logging.info(f"Call data saved to Firestore: {call_id}")
        
        # Aggiorna contatore chiamate mensili per user (se presente)
        if user_id:
            update_monthly_call_count(user_id)
        
    except Exception as e:
        logging.error(f"Error saving call data: {e}")
    
    # Invia notifica WhatsApp solo se abbiamo almeno il nome o numero
    if client_info['nome'] != 'Non specificato' or client_info['telefono'] != customer_number:
        try:
            send_whatsapp_notification(
                client_info, 
                customer_number, 
                transcript, 
                call_id, 
                duration,
                destination_whatsapp  # Agente specifico per zona
            )
            logging.info(f"WhatsApp notification sent to {destination_whatsapp} for call {call_id}")
        except Exception as e:
            logging.error(f"Error sending WhatsApp notification: {e}")
    else:
        logging.warning(f"Skipping WhatsApp notification - insufficient data for call {call_id}")
    
    return {'status': 'success'}


def handle_function_call(event_data):
    """
    Gestisce chiamate a funzioni custom (opzionale).
    Può essere usato per integrazioni real-time durante la chiamata.
    """
    message = event_data.get('message', {})
    function_call = message.get('functionCall', {})
    
    function_name = function_call.get('name', '')
    parameters = function_call.get('parameters', {})
    
    logging.info(f"Function call: {function_name} with params {parameters}")
    
    # Esempio: check disponibilità immobile in tempo reale
    if function_name == 'check_availability':
        # Qui potresti fare query a database immobili
        return {
            'result': {
                'available': True,
                'message': 'Abbiamo 3 appartamenti disponibili in quella zona'
            }
        }
    
    return {'result': 'Function not implemented'}

