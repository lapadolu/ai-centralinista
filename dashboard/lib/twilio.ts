/**
 * Twilio API Integration
 * Helper functions per acquistare e gestire numeri Twilio
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_BASE_URL = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`;

/**
 * Cerca numeri disponibili in Italia
 */
export async function searchAvailableItalianNumbers(areaCode?: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN non configurati');
  }

  try {
    const params = new URLSearchParams({
      IsoCountry: 'IT',
      VoiceEnabled: 'true',
      SmsEnabled: 'true',
      Limit: '10',
    });

    if (areaCode) {
      params.append('AreaCode', areaCode);
    }

    const response = await fetch(`${TWILIO_BASE_URL}/AvailablePhoneNumbers/IT/Local.json?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.available_phone_numbers || [];
  } catch (error: any) {
    console.error('Error searching Twilio numbers:', error);
    throw error;
  }
}

/**
 * Acquista un numero Twilio
 */
export async function purchaseTwilioNumber(phoneNumber: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN non configurati');
  }

  try {
    const params = new URLSearchParams({
      PhoneNumber: phoneNumber,
    });

    const response = await fetch(`${TWILIO_BASE_URL}/IncomingPhoneNumbers.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      sid: data.sid,
      phoneNumber: data.phone_number,
      friendlyName: data.friendly_name,
    };
  } catch (error: any) {
    console.error('Error purchasing Twilio number:', error);
    throw error;
  }
}

/**
 * Configura webhook per un numero Twilio (per Vapi)
 */
export async function configureTwilioNumberWebhook(
  phoneNumberSid: string,
  voiceUrl: string,
  statusCallback?: string
) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN non configurati');
  }

  try {
    const params = new URLSearchParams({
      VoiceUrl: voiceUrl,
      VoiceMethod: 'POST',
    });

    if (statusCallback) {
      params.append('StatusCallback', statusCallback);
      params.append('StatusCallbackMethod', 'POST');
    }

    const response = await fetch(`${TWILIO_BASE_URL}/IncomingPhoneNumbers/${phoneNumberSid}.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Twilio API error: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error configuring Twilio webhook:', error);
    throw error;
  }
}

/**
 * Verifica che un numero Twilio esista
 */
export async function getTwilioNumber(phoneNumberSid: string) {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    throw new Error('TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN non configurati');
  }

  try {
    const response = await fetch(`${TWILIO_BASE_URL}/IncomingPhoneNumbers/${phoneNumberSid}.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.text();
      throw new Error(`Twilio API error: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting Twilio number:', error);
    throw error;
  }
}

/**
 * Acquista automaticamente un numero italiano disponibile
 */
export async function purchaseAvailableItalianNumber() {
  try {
    // Cerca numeri disponibili
    const availableNumbers = await searchAvailableItalianNumbers();
    
    if (availableNumbers.length === 0) {
      throw new Error('Nessun numero italiano disponibile');
    }

    // Prendi il primo disponibile
    const selectedNumber = availableNumbers[0];
    
    // Acquista
    const purchased = await purchaseTwilioNumber(selectedNumber.phone_number);
    
    return purchased;
  } catch (error: any) {
    console.error('Error purchasing available Italian number:', error);
    throw error;
  }
}

