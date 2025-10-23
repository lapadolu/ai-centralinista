import openai
import os
import logging

logging.basicConfig(level=logging.INFO)

# Initialize OpenAI
openai.api_key = os.environ.get('OPENAI_API_KEY')

def process_conversation_with_ai(speech_text, conversation_history=None, turn_count=0):
    """Process user speech with OpenAI GPT for natural conversation."""
    
    if not conversation_history:
        conversation_history = []
    
    # Add user message to history
    conversation_history.append({"role": "user", "content": speech_text})
    
    # System prompt for real estate assistant - more conversational
    system_prompt = """Sei un assistente virtuale professionale per Iconacasa Milano, agenzia immobiliare.
    
Il tuo compito è raccogliere informazioni essenziali dal cliente in modo naturale e conversazionale:

1. SALUTO: Cordiale ma breve
2. RACCOLTA INFO: Nome, telefono, tipo richiesta (comprare/vendere)
3. DETTAGLI: Zona, tipo immobile, budget (se rilevante)
4. CHIUSURA: Ringraziare e confermare ricontatto

REGOLE IMPORTANTI:
- Fai UNA domanda alla volta
- Sii breve e diretto (max 15 parole)
- Usa un tono cordiale ma professionale
- Se il cliente non risponde chiaramente, chiedi gentilmente di ripetere
- Non fare domande troppo personali
- Mantieni sempre il focus su immobili

ESEMPI DI DOMANDE:
- "Qual è il suo nome?"
- "Mi può dare il suo numero di telefono?"
- "Sta cercando di comprare o vendere?"
- "In che zona di Milano?"
- "Che tipo di immobile?"

Parla sempre in italiano e mantieni un tono naturale."""
    
    try:
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt}
            ] + conversation_history[-4:],  # Keep last 4 messages for context
            max_tokens=50,  # Keep responses short
            temperature=0.7
        )
        
        ai_response = response.choices[0].message.content.strip()
        
        # Add AI response to history
        conversation_history.append({"role": "assistant", "content": ai_response})
        
        return ai_response, conversation_history
        
    except Exception as e:
        logging.error(f"OpenAI API error: {e}")
        return "Mi scusi, può ripetere?", conversation_history

def extract_client_info(conversation_history):
    """Extract structured client information from conversation."""
    
    full_conversation = " ".join([msg["content"] for msg in conversation_history])
    
    extraction_prompt = f"""Estrai le seguenti informazioni dal testo della conversazione:
    
Conversazione: {full_conversation}

Estrai solo le informazioni presenti, in formato JSON:
{{
    "nome": "nome del cliente se menzionato",
    "telefono": "numero di telefono se menzionato", 
    "tipo_richiesta": "comprare o vendere",
    "zona": "zona di Milano se menzionata",
    "tipo_immobile": "tipo di immobile se menzionato",
    "budget": "budget se menzionato",
    "note": "altre informazioni rilevanti"
}}

Rispondi solo con il JSON, nient'altro."""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sei un estrattore di informazioni. Rispondi solo con JSON valido."},
                {"role": "user", "content": extraction_prompt}
            ],
            max_tokens=200,
            temperature=0.1
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        logging.error(f"OpenAI extraction error: {e}")
        return '{"nome": "", "telefono": "", "tipo_richiesta": "", "zona": "", "tipo_immobile": "", "budget": "", "note": ""}'
