/**
 * Configuration Constants - FIXER by Helping Hand
 * Valori costanti per form, dropdown, ecc.
 */

import { StructuredOutputField } from './firebase';

// Provider telefonici italiani
export const PHONE_PROVIDERS = [
  { value: 'tim', label: 'TIM' },
  { value: 'vodafone', label: 'Vodafone' },
  { value: 'wind_tre', label: 'Wind Tre' },
  { value: 'iliad', label: 'Iliad' },
  { value: 'fastweb', label: 'Fastweb' },
  { value: 'ho', label: 'Ho Mobile' },
  { value: 'very', label: 'Very Mobile' },
  { value: 'altro', label: 'Altro' },
] as const;

// Settori/Industrie
export const INDUSTRIES = [
  { value: 'ristorante', label: 'Ristorante / Pizzeria' },
  { value: 'immobiliare', label: 'Agenzia Immobiliare' },
  { value: 'servizi', label: 'Servizi Professionali' },
  { value: 'medico', label: 'Studio Medico / Clinica' },
  { value: 'legale', label: 'Studio Legale' },
  { value: 'beauty', label: 'Beauty / Estetica' },
  { value: 'fitness', label: 'Palestra / Fitness' },
  { value: 'hotel', label: 'Hotel / B&B' },
  { value: 'retail', label: 'Negozio / Retail' },
  { value: 'elettronica', label: 'Elettronica / Tecnologia' },
  { value: 'automotive', label: 'Auto / Moto' },
  { value: 'altro', label: 'Altro' },
] as const;

// Response Mode Options
export const RESPONSE_MODES = [
  { 
    value: 'immediate', 
    label: 'Risposta Immediata', 
    description: 'L\'agent risponde immediatamente a tutte le chiamate'
  },
  { 
    value: 'missed_call_only', 
    label: 'Solo Chiamate Perse', 
    description: 'L\'agent risponde solo se il cliente non risponde entro X secondi'
  },
] as const;

// Limiti WhatsApp per piano
export const WHATSAPP_LIMITS = {
  starter: 1,
  pro: 3,
  enterprise: 10,
} as const;

// Structured Output Field Types
export const STRUCTURED_FIELD_TYPES = [
  { value: 'text', label: 'Testo' },
  { value: 'number', label: 'Numero' },
  { value: 'select', label: 'Selezione' },
  { value: 'boolean', label: 'Sì/No' },
] as const;

// Template Structured Output per settore
export const INDUSTRY_STRUCTURED_OUTPUTS: Record<string, StructuredOutputField[]> = {
  ristorante: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'numero_persone', label: 'Numero Persone', type: 'number', required: false },
    { name: 'data_prenotazione', label: 'Data Prenotazione', type: 'text', required: false },
    { name: 'ora_prenotazione', label: 'Ora Prenotazione', type: 'text', required: false },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  immobiliare: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'select', required: true, options: ['comprare', 'vendere', 'affittare'] },
    { name: 'zona', label: 'Zona', type: 'text', required: false },
    { name: 'tipo_immobile', label: 'Tipo Immobile', type: 'select', required: false, options: ['appartamento', 'villa', 'ufficio', 'negozio'] },
    { name: 'budget', label: 'Budget', type: 'text', required: false },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  servizi: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_servizio', label: 'Tipo Servizio', type: 'text', required: true },
    { name: 'urgenza', label: 'Urgenza', type: 'select', required: false, options: ['bassa', 'media', 'alta'] },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  default: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
};

// Helper functions
export function getWhatsAppLimit(plan: 'starter' | 'pro' | 'enterprise'): number {
  return WHATSAPP_LIMITS[plan];
}

export function getIndustryStructuredOutput(industry: string): StructuredOutputField[] {
  return INDUSTRY_STRUCTURED_OUTPUTS[industry] || INDUSTRY_STRUCTURED_OUTPUTS.default;
}

export function getPhoneProviderLabel(value: string): string {
  const provider = PHONE_PROVIDERS.find(p => p.value === value);
  return provider?.label || value;
}

