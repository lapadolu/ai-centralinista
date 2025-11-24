/**
 * Analytics - Industry-Specific Statistics
 * Statistiche personalizzate per settore
 */

import { StructuredOutputField } from './firebase';

// Analytics Configuration per settore
export interface IndustryAnalytics {
  industry: string;
  metrics: string[];
  charts: string[];
  insights: string[];
}

// Analytics Data per settore
export const INDUSTRY_ANALYTICS: Record<string, IndustryAnalytics> = {
  ristorante: {
    industry: 'ristorante',
    metrics: [
      'prenotazioni_totali',
      'prenotazioni_confermate',
      'numero_persone_medio',
      'orari_preferiti',
      'giorni_piu_richiesti',
    ],
    charts: [
      'pizze_piu_richieste',
      'zone_clienti',
      'orari_prenotazioni',
      'giorni_settimana',
      'numero_persone_distribuzione',
    ],
    insights: [
      'Pizze più richieste',
      'Zone prioritarie dei clienti',
      'Orari di punta per prenotazioni',
      'Giorni più richiesti',
      'Capacità media tavoli',
    ],
  },
  immobiliare: {
    industry: 'immobiliare',
    metrics: [
      'lead_totali',
      'lead_comprare',
      'lead_vendere',
      'zone_piu_richieste',
      'tipo_immobile_piu_richiesto',
      'budget_medio',
    ],
    charts: [
      'zone_piu_richieste',
      'tipo_immobile',
      'budget_distribuzione',
      'tipologia_richiesta',
      'locali_piu_richiesti',
      'features_piu_richieste',
    ],
    insights: [
      'Zone più richieste',
      'Tipo immobile più popolare',
      'Budget medio clienti',
      'Numero locali più richiesto',
      'Features più desiderate',
    ],
  },
  servizi: {
    industry: 'servizi',
    metrics: [
      'lead_totali',
      'tipo_servizio_piu_richiesto',
      'urgenza_media',
      'conversion_rate',
    ],
    charts: [
      'tipo_servizio',
      'urgenza_distribuzione',
      'giorni_settimana',
      'orari_preferiti',
    ],
    insights: [
      'Tipo servizio più richiesto',
      'Giorni più richiesti',
      'Orari di punta',
      'Urgenza media richieste',
    ],
  },
  medico: {
    industry: 'medico',
    metrics: [
      'prenotazioni_totali',
      'tipo_visita_piu_richiesta',
      'giorni_piu_richiesti',
      'urgenza_media',
    ],
    charts: [
      'tipo_visita',
      'giorni_settimana',
      'orari_prenotazioni',
      'urgenza_distribuzione',
    ],
    insights: [
      'Tipo visita più richiesta',
      'Giorni più richiesti',
      'Orari preferiti',
      'Urgenza media',
    ],
  },
  beauty: {
    industry: 'beauty',
    metrics: [
      'prenotazioni_totali',
      'tipo_trattamento_piu_richiesto',
      'giorni_piu_richiesti',
      'orari_preferiti',
    ],
    charts: [
      'tipo_trattamento',
      'giorni_settimana',
      'orari_prenotazioni',
      'fascia_prezzo',
    ],
    insights: [
      'Trattamenti più richiesti',
      'Giorni più popolari',
      'Orari di punta',
      'Fascia prezzo preferita',
    ],
  },
  fitness: {
    industry: 'fitness',
    metrics: [
      'iscrizioni_totali',
      'tipo_abbonamento_piu_richiesto',
      'orari_preferiti',
      'giorni_piu_richiesti',
    ],
    charts: [
      'tipo_abbonamento',
      'giorni_settimana',
      'orari_preferiti',
      'fascia_eta',
    ],
    insights: [
      'Tipo abbonamento più richiesto',
      'Orari preferiti',
      'Giorni più popolari',
      'Fascia età target',
    ],
  },
  hotel: {
    industry: 'hotel',
    metrics: [
      'prenotazioni_totali',
      'tipologia_camera_piu_richiesta',
      'periodo_piu_richiesto',
      'numero_ospiti_medio',
    ],
    charts: [
      'tipologia_camera',
      'periodo_richieste',
      'numero_ospiti',
      'stagionalita',
    ],
    insights: [
      'Tipologia camera più richiesta',
      'Periodi più richiesti',
      'Numero ospiti medio',
      'Stagionalità prenotazioni',
    ],
  },
  default: {
    industry: 'default',
    metrics: ['lead_totali', 'conversion_rate'],
    charts: ['lead_distribuzione', 'orari_preferiti'],
    insights: ['Lead totali', 'Orari preferiti'],
  },
};

/**
 * Get analytics config for industry
 */
export function getIndustryAnalytics(industry: string): IndustryAnalytics {
  return INDUSTRY_ANALYTICS[industry] || INDUSTRY_ANALYTICS.default;
}

/**
 * Extract structured data from call based on industry
 */
export function extractIndustryData(
  industry: string,
  structuredData: any
): Record<string, any> {
  switch (industry) {
    case 'ristorante':
      return {
        nome_cliente: structuredData.nome_cliente,
        telefono: structuredData.telefono,
        numero_persone: structuredData.numero_persone,
        data_prenotazione: structuredData.data_prenotazione,
        ora_prenotazione: structuredData.ora_prenotazione,
        tipo_prenotazione: structuredData.tipo_prenotazione || 'pizza',
        zona: structuredData.zona,
      };
    case 'immobiliare':
      return {
        nome_cliente: structuredData.nome_cliente,
        telefono: structuredData.telefono,
        tipo_richiesta: structuredData.tipo_richiesta,
        zona: structuredData.zona,
        tipo_immobile: structuredData.tipo_immobile,
        numero_locali: structuredData.numero_locali,
        budget: structuredData.budget,
        features: structuredData.features || [],
      };
    default:
      return structuredData;
  }
}

