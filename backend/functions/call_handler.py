import os
import functions_framework
from twilio.twiml.voice_response import VoiceResponse
import logging

logging.basicConfig(level=logging.INFO)

@functions_framework.http
def call_handler(request):
    """Handles incoming Twilio voice calls."""
    response = VoiceResponse()
    response.say(language="it-IT", voice="alice", message="Buongiorno, sono l'assistente virtuale di Iconacasa. Il sistema è in fase di configurazione.")
    response.hangup()
    return str(response)
