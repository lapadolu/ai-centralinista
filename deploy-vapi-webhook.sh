#!/bin/bash

# 🚀 Script per deployare Vapi Webhook su Google Cloud
# Usa: ./deploy-vapi-webhook.sh

echo "🚀 Deploy Vapi Webhook..."

# Vai nella cartella functions
cd "$(dirname "$0")/backend/functions" || exit

# ⚠️ SICUREZZA: Usa solo variabili d'ambiente, mai credenziali hardcoded
# Configura le variabili d'ambiente prima di eseguire lo script:
# export TWILIO_ACCOUNT_SID="your_account_sid"
# export TWILIO_AUTH_TOKEN="your_auth_token"
# export VAPI_API_KEY="your_vapi_key"

if [ -z "$TWILIO_ACCOUNT_SID" ] || [ -z "$TWILIO_AUTH_TOKEN" ] || [ -z "$VAPI_API_KEY" ]; then
    echo "❌ Errore: Configura le variabili d'ambiente prima di eseguire lo script"
    echo "   export TWILIO_ACCOUNT_SID=\"your_account_sid\""
    echo "   export TWILIO_AUTH_TOKEN=\"your_auth_token\""
    echo "   export VAPI_API_KEY=\"your_vapi_key\""
    exit 1
fi

# Deploy
echo "⏳ Deploy in corso..."
gcloud functions deploy vapi-webhook \
  --runtime python311 \
  --trigger-http \
  --allow-unauthenticated \
  --source . \
  --entry-point vapi_webhook \
  --region europe-west1 \
  --memory 512MB \
  --timeout 540s \
  --set-env-vars "VAPI_API_KEY=${VAPI_API_KEY},TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID},TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}"

# Verifica risultato
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deploy completato!"
    echo ""
    echo "📋 Prossimi passi:"
    echo "1. Copia l'URL che vedi sopra (tipo: https://europe-west1-ai-centralinista-2025.cloudfunctions.net/vapi-webhook)"
    echo "2. Aggiungilo in Vercel come VAPI_WEBHOOK_URL"
    echo "3. Aggiungilo in Vapi Dashboard → Assistant → Server URL"
else
    echo ""
    echo "❌ Errore durante il deploy"
    echo "Verifica:"
    echo "- Sei autenticato? (gcloud auth login)"
    echo "- Il progetto è corretto? (gcloud config set project ai-centralinista-2025)"
    echo "- Le API sono abilitate? (gcloud services enable cloudfunctions.googleapis.com)"
fi

