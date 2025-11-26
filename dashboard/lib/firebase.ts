import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side only)
if (!getApps().length) {
  // In produzione, Firebase Admin può usare service account da variabile d'ambiente
  // o le credenziali automatiche di GCP se deployato su Google Cloud
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountPath) {
    // Usa service account da file path
    // NOTA: cert() richiede un oggetto, non un path string
    // Se hai un path, devi leggere il file prima
    try {
      const fs = require('fs');
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      initializeApp({
        credential: cert(serviceAccount),
        projectId: 'ai-centralinista-2025',
      });
    } catch (error) {
      console.error('Error loading service account from path:', error);
      // Fallback
      initializeApp({
        projectId: 'ai-centralinista-2025',
      });
    }
  } else if (serviceAccountJson) {
    // Usa service account da JSON string (utile per Vercel)
    try {
      const serviceAccount = JSON.parse(serviceAccountJson);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: 'ai-centralinista-2025',
      });
    } catch (error) {
      console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_JSON:', error);
      // Fallback: usa projectId solo (funziona su GCP)
      initializeApp({
        projectId: 'ai-centralinista-2025',
      });
    }
  } else {
    // Fallback: usa solo projectId (funziona se deployato su GCP o con Application Default Credentials)
    initializeApp({
      projectId: 'ai-centralinista-2025',
    });
  }
}

export const db = getFirestore();

// Types for our data
export interface Call {
  call_id: string;
  customer_number: string;
  client_info: {
    nome: string;
    telefono: string;
    tipo_richiesta: string;
    zona: string;
    tipo_immobile: string;
    budget: string;
    note: string;
  };
  structured_data: any;
  transcript: string;
  duration: number;
  ended_reason: string;
  started_at: any;
  ended_at: any;
  status: 'in_progress' | 'completed';
  assigned_agent?: string; // WhatsApp dell'agente assegnato
}

export interface Agent {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  role: 'owner' | 'collaborator';
  active: boolean;
  created_at: any;
}

export interface ZoneAssignment {
  zone: string;
  agent_id: string;
  agent_name: string;
  agent_whatsapp: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'client'; // admin = tu (gestisci tutto), client = agenti come Federico
  whatsapp?: string;
  company?: string;
  vapi_assistant_id?: string;
  phone_number?: string;
  agents?: Agent[]; // Solo per client: il loro team
  zone_assignments?: ZoneAssignment[]; // Solo per client: zone → agenti
  subscription_plan?: 'starter' | 'pro' | 'enterprise';
  subscription_status?: 'active' | 'trial' | 'suspended' | 'cancelled';
  monthly_calls?: number;
  monthly_calls_limit?: number;
  total_calls?: number;
  total_leads?: number;
  current_month_start?: any;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  billing_email?: string;
  created_at: any;
  last_login?: any;
}

export interface ClientStats {
  client_id: string;
  client_name: string;
  client_email: string;
  total_calls: number;
  total_leads: number;
  conversion_rate: number;
  monthly_cost: number;
  subscription_plan: string;
  status: 'active' | 'trial' | 'suspended';
  last_call?: any;
}

// Structured Output Field
export interface StructuredOutputField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'boolean';
  required: boolean;
  options?: string[]; // for select type
  placeholder?: string;
}

// Order Status
export type OrderStatus = 'pending_setup' | 'setup_in_progress' | 'waiting_activation' | 'active' | 'suspended';

// WhatsApp Configuration per numero
export interface WhatsAppConfig {
  whatsapp_number: string; // +39 XXX XXX XXXX
  whatsapp_name?: string; // Nome agente/team (opzionale)
  structured_output_config: {
    fields: StructuredOutputField[];
    example?: string;
  };
  enabled: boolean;
}

// Order - Complete managed service order
export interface Order {
  id: string; // order-{timestamp}
  user_id: string; // email cliente
  user_name: string;
  company_name: string;
  industry: string; // "ristorante", "immobiliare", "servizi" (menu a tendina)
  
  // Subscription
  subscription_plan: 'starter' | 'pro' | 'enterprise';
  stripe_checkout_session_id: string;
  stripe_subscription_id?: string;
  stripe_customer_id: string;
  
  // Customer Configuration
  customer_phone: string; // numero esistente cliente (per inoltro)
  phone_provider: string; // "TIM", "Vodafone", "Wind Tre", "Iliad", ecc. (menu a tendina)
  whatsapp_configs: WhatsAppConfig[]; // ✅ NUOVO: multipli WhatsApp (1 Starter, 3 Pro, 10 Enterprise)
  order_details?: string; // note cliente
  
  // Customer Preferences (scelti dal cliente)
  response_mode: 'immediate' | 'missed_call_only'; // ✅ Scelto dal cliente
  voice_id?: string; // Voice selection (opzionale, default: male_professional)
  default_structured_output?: {
    fields: StructuredOutputField[];
    example?: string;
  }; // Default se non specificato per numero
  
  // Admin Setup
  setup_status: OrderStatus;
  vapi_assistant_id?: string;
  vapi_assistant_config?: {
    prompt: string;
    voice: string;
    first_message: string;
    end_call_function_enabled: boolean;
    response_mode: 'immediate' | 'missed_call_only'; // Da admin (basato su customer choice)
  };
  
  // Twilio
  twilio_phone_number?: string; // numero acquistato per questo cliente
  twilio_sid?: string;
  call_forwarding_enabled: boolean; // cliente ha attivato inoltro?
  call_forwarding_provider?: string; // Provider per istruzioni
  
  // Setup Verification (Step 2 - Admin può verificare)
  setup_verification?: {
    vapi_agent_created: boolean;
    vapi_agent_test_passed?: boolean;
    twilio_number_purchased: boolean;
    twilio_whatsapp_connected: boolean; // Tutti i WhatsApp configurati
    webhook_configured: boolean;
    last_verified_at?: any;
  };
  
  // Timeline
  created_at: any;
  paid_at?: any;
  setup_started_at?: any;
  agent_ready_at?: any;
  activated_at?: any;
  
  // Admin Notes
  admin_notes?: string;
  setup_admin?: string; // email admin che ha fatto setup
}

// Vapi Assistant Template
export interface VapiAssistantTemplate {
  id: string;
  name: string; // "Pizzeria Template", "Immobiliare Template"
  industry: string;
  description?: string;
  prompt: string;
  structured_output_schema: {
    fields: StructuredOutputField[];
    example: any; // JSON example
  };
  voice_config: {
    provider: '11labs' | 'openai';
    voice_id: string;
    speed?: number;
  };
  default_config: {
    response_mode: 'immediate' | 'missed_call_only';
    first_message: string;
    end_call_function_enabled: boolean;
  };
  created_at: any;
  updated_at: any;
}

