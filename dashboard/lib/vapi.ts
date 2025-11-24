/**
 * Vapi API Integration
 * Helper functions per creare e gestire agent Vapi
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;
// Vapi API endpoint - potrebbe essere /v1/assistant invece di /assistant
// Verifica documentazione Vapi se creazione agent fallisce
const VAPI_BASE_URL = 'https://api.vapi.ai';

interface CreateAssistantParams {
  name: string;
  model?: {
    provider: 'openai' | 'anthropic';
    model: string;
    messages?: Array<{
      role: 'system' | 'user' | 'assistant';
      content: string;
    }>;
  };
  voice?: {
    provider: '11labs' | 'openai';
    voiceId: string;
  };
  firstMessage?: string;
  serverUrl?: string;
  endCallFunctionEnabled?: boolean;
  responseMode?: 'immediate' | 'missed-call';
  structuredOutputs?: Array<{
    name: string;
    schema: {
      type: 'object';
      properties: Record<string, any>;
    };
  }>;
}

/**
 * Crea un nuovo assistant Vapi
 */
export async function createVapiAssistant(params: CreateAssistantParams) {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY non configurato');
  }

  try {
    // Prova prima /v1/assistant (versione comune delle API)
    // Se fallisce, prova /assistant
    const requestBody = {
      name: params.name,
      model: params.model || {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
      },
      voice: params.voice || {
        provider: '11labs',
        voiceId: params.voice?.voiceId || '21m00Tcm4TlvDq8ikWAM',
      },
      firstMessage: params.firstMessage,
      serverUrl: params.serverUrl || process.env.VAPI_WEBHOOK_URL,
      endCallFunctionEnabled: params.endCallFunctionEnabled !== false,
      responseMode: params.responseMode || 'immediate',
      structuredOutputs: params.structuredOutputs || [],
    };

    let response = await fetch(`${VAPI_BASE_URL}/v1/assistant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Se /v1/assistant fallisce, prova /assistant (fallback)
    if (!response.ok && response.status === 404) {
      response = await fetch(`${VAPI_BASE_URL}/assistant`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      phoneNumberId: data.phoneNumberId,
    };
  } catch (error: any) {
    console.error('Error creating Vapi assistant:', error);
    throw error;
  }
}

/**
 * Aggiorna un assistant Vapi esistente
 */
export async function updateVapiAssistant(assistantId: string, params: Partial<CreateAssistantParams>) {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY non configurato');
  }

  try {
    // Prova /v1/assistant prima
    let response = await fetch(`${VAPI_BASE_URL}/v1/assistant/${assistantId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    // Fallback a /assistant se 404
    if (!response.ok && response.status === 404) {
      response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vapi API error: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error updating Vapi assistant:', error);
    throw error;
  }
}

/**
 * Recupera un assistant Vapi
 */
export async function getVapiAssistant(assistantId: string) {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY non configurato');
  }

  try {
    // Prova /v1/assistant prima
    let response = await fetch(`${VAPI_BASE_URL}/v1/assistant/${assistantId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
      },
    });

    // Fallback a /assistant se 404
    if (!response.ok && response.status === 404) {
      response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
        },
      });
    }

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const error = await response.text();
      throw new Error(`Vapi API error: ${response.status} - ${error}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error getting Vapi assistant:', error);
    throw error;
  }
}

/**
 * Esegue una chiamata test per verificare che l'assistant funzioni
 * @param assistantId ID dell'assistant Vapi
 * @param phoneNumber Numero di destinazione per la chiamata test
 * @returns Risultato della chiamata test
 */
export async function makeTestCall(assistantId: string, phoneNumber: string): Promise<{
  success: boolean;
  callId?: string;
  error?: string;
}> {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY non configurato');
  }

  try {
    // Vapi API per creare una chiamata
    // Prova prima /v1/call
    let response = await fetch(`${VAPI_BASE_URL}/v1/call`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: assistantId,
        customer: {
          number: phoneNumber,
        },
      }),
    });

    // Fallback a /call se 404
    if (!response.ok && response.status === 404) {
      response = await fetch(`${VAPI_BASE_URL}/call`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: assistantId,
          customer: {
            number: phoneNumber,
          },
        }),
      });
    }

    if (!response.ok) {
      const error = await response.text();
      console.error(`Vapi test call error: ${response.status} - ${error}`);
      return {
        success: false,
        error: `Vapi API error: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      callId: data.id || data.callId,
    };
  } catch (error: any) {
    console.error('Error making test call:', error);
    return {
      success: false,
      error: error.message || 'Errore durante la chiamata test',
    };
  }
}

/**
 * Collega un numero Twilio a un assistant Vapi
 */
export async function linkTwilioNumberToVapi(assistantId: string, phoneNumber: string) {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY non configurato');
  }

  try {
    // Prima trova o crea il phone number in Vapi
    // Prova /v1/phone-number prima
    let phoneNumbersResponse = await fetch(`${VAPI_BASE_URL}/v1/phone-number`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
      },
    });

    // Fallback a /phone-number se 404
    if (!phoneNumbersResponse.ok && phoneNumbersResponse.status === 404) {
      phoneNumbersResponse = await fetch(`${VAPI_BASE_URL}/phone-number`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
        },
      });
    }

    let phoneNumberId: string | null = null;

    if (phoneNumbersResponse.ok) {
      const phoneNumbers = await phoneNumbersResponse.json();
      const existingNumber = phoneNumbers.find((pn: any) => pn.number === phoneNumber);
      if (existingNumber) {
        phoneNumberId = existingNumber.id;
      }
    }

    // Se non esiste, importalo
    if (!phoneNumberId) {
      let importResponse = await fetch(`${VAPI_BASE_URL}/v1/phone-number`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          number: phoneNumber,
        }),
      });

      // Fallback a /phone-number se 404
      if (!importResponse.ok && importResponse.status === 404) {
        importResponse = await fetch(`${VAPI_BASE_URL}/phone-number`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${VAPI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: phoneNumber,
          }),
        });
      }

      if (!importResponse.ok) {
        const error = await importResponse.text();
        throw new Error(`Error importing phone number: ${error}`);
      }

      const importedNumber = await importResponse.json();
      phoneNumberId = importedNumber.id;
    }

    // Collega il numero all'assistant
    // Prova /v1/phone-number prima
    let linkResponse = await fetch(`${VAPI_BASE_URL}/v1/phone-number/${phoneNumberId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: assistantId,
      }),
    });

    // Fallback a /phone-number se 404
    if (!linkResponse.ok && linkResponse.status === 404) {
      linkResponse = await fetch(`${VAPI_BASE_URL}/phone-number/${phoneNumberId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assistantId: assistantId,
        }),
      });
    }

    if (!linkResponse.ok) {
      const error = await linkResponse.text();
      throw new Error(`Error linking phone number: ${error}`);
    }

    return await linkResponse.json();
  } catch (error: any) {
    console.error('Error linking Twilio number to Vapi:', error);
    throw error;
  }
}

