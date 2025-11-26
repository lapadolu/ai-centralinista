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
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'select', required: true, options: ['prenotazione', 'ordine_asporto', 'informazioni'] },
    { name: 'numero_persone', label: 'Numero Persone', type: 'number', required: false },
    { name: 'data_prenotazione', label: 'Data Prenotazione', type: 'text', required: false },
    { name: 'ora_prenotazione', label: 'Ora Prenotazione', type: 'text', required: false },
    { name: 'note', label: 'Note (allergie, richieste speciali)', type: 'text', required: false },
  ],
  immobiliare: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'select', required: true, options: ['comprare', 'vendere', 'affittare'] },
    { name: 'zona', label: 'Zona di Interesse', type: 'text', required: false },
    { name: 'tipo_immobile', label: 'Tipo Immobile', type: 'select', required: false, options: ['appartamento', 'villa', 'ufficio', 'negozio', 'terreno'] },
    { name: 'metratura', label: 'Metratura Desiderata', type: 'text', required: false },
    { name: 'budget', label: 'Budget', type: 'text', required: false },
    { name: 'note', label: 'Note (caratteristiche importanti)', type: 'text', required: false },
  ],
  servizi: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_servizio', label: 'Tipo Servizio', type: 'text', required: true },
    { name: 'urgenza', label: 'Urgenza', type: 'select', required: false, options: ['bassa', 'media', 'alta'] },
    { name: 'preferenza_contatto', label: 'Preferenza Contatto', type: 'select', required: false, options: ['telefono', 'email', 'whatsapp'] },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  medico: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_visita', label: 'Tipo Visita', type: 'text', required: true },
    { name: 'preferenza_data', label: 'Preferenza Data', type: 'text', required: false },
    { name: 'preferenza_ora', label: 'Preferenza Ora', type: 'text', required: false },
    { name: 'urgenza', label: 'Urgenza', type: 'select', required: false, options: ['normale', 'urgente', 'emergenza'] },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  legale: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_consulenza', label: 'Tipo Consulenza', type: 'select', required: true, options: ['civile', 'penale', 'commerciale', 'lavoro', 'famiglia', 'altro'] },
    { name: 'preferenza_appuntamento', label: 'Preferenza Appuntamento', type: 'text', required: false },
    { name: 'urgenza', label: 'Urgenza', type: 'select', required: false, options: ['normale', 'urgente', 'emergenza'] },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  beauty: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_trattamento', label: 'Tipo Trattamento', type: 'text', required: true },
    { name: 'preferenza_data', label: 'Preferenza Data', type: 'text', required: false },
    { name: 'preferenza_ora', label: 'Preferenza Ora', type: 'text', required: false },
    { name: 'durata_trattamento', label: 'Durata Trattamento', type: 'text', required: false },
    { name: 'note', label: 'Note (allergie, preferenze)', type: 'text', required: false },
  ],
  fitness: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_interesse', label: 'Tipo Interesse', type: 'select', required: true, options: ['iscrizione', 'prova_gratuita', 'corso_specifico', 'informazioni'] },
    { name: 'corso_interessato', label: 'Corso Interessato', type: 'text', required: false },
    { name: 'preferenza_visita', label: 'Preferenza Visita', type: 'text', required: false },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  hotel: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'data_checkin', label: 'Data Check-in', type: 'text', required: false },
    { name: 'data_checkout', label: 'Data Check-out', type: 'text', required: false },
    { name: 'numero_ospiti', label: 'Numero Ospiti', type: 'number', required: false },
    { name: 'tipo_camera', label: 'Tipo Camera', type: 'select', required: false, options: ['singola', 'doppia', 'tripla', 'suite'] },
    { name: 'note', label: 'Note (richieste speciali)', type: 'text', required: false },
  ],
  retail: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'select', required: true, options: ['disponibilità_prodotto', 'prezzo', 'informazioni', 'ordine'] },
    { name: 'prodotto_interessato', label: 'Prodotto Interessato', type: 'text', required: false },
    { name: 'preferenza_contatto', label: 'Preferenza Contatto', type: 'select', required: false, options: ['telefono', 'email', 'whatsapp'] },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  elettronica: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'select', required: true, options: ['acquisto', 'assistenza_tecnica', 'informazioni', 'preventivo'] },
    { name: 'prodotto_dispositivo', label: 'Prodotto/Dispositivo', type: 'text', required: false },
    { name: 'marca_modello', label: 'Marca/Modello', type: 'text', required: false },
    { name: 'problema', label: 'Problema (se assistenza)', type: 'text', required: false },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  automotive: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'select', required: true, options: ['riparazione', 'manutenzione', 'revisione', 'informazioni', 'preventivo'] },
    { name: 'marca_veicolo', label: 'Marca Veicolo', type: 'text', required: false },
    { name: 'modello_veicolo', label: 'Modello Veicolo', type: 'text', required: false },
    { name: 'anno_veicolo', label: 'Anno Veicolo', type: 'text', required: false },
    { name: 'problema', label: 'Problema/Intervento', type: 'text', required: false },
    { name: 'preferenza_data', label: 'Preferenza Data', type: 'text', required: false },
    { name: 'note', label: 'Note', type: 'text', required: false },
  ],
  default: [
    { name: 'nome_cliente', label: 'Nome Cliente', type: 'text', required: true },
    { name: 'telefono', label: 'Telefono', type: 'text', required: true },
    { name: 'tipo_richiesta', label: 'Tipo Richiesta', type: 'text', required: false },
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

