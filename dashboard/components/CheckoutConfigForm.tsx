'use client';

import { useState } from 'react';
import { X, Plus, Trash2, ArrowRight, ArrowLeft, Phone, MessageCircle, Building2, Briefcase } from 'lucide-react';
import { PHONE_PROVIDERS, INDUSTRIES, RESPONSE_MODES, WHATSAPP_LIMITS, getWhatsAppLimit, getIndustryStructuredOutput, STRUCTURED_FIELD_TYPES } from '@/lib/config';
import { StructuredOutputField } from '@/lib/firebase';
import { PRICING_PLANS } from '@/lib/pricing';

interface CheckoutConfigFormProps {
  planId: 'starter' | 'pro' | 'enterprise';
  onClose: () => void;
  onProceed: (config: CheckoutConfig) => void;
}

export interface CheckoutConfig {
  company_name: string;
  industry: string;
  customer_phone: string;
  phone_provider: string;
  whatsapp_configs: Array<{
    whatsapp_number: string;
    whatsapp_name?: string;
    structured_output_config: {
      fields: StructuredOutputField[];
      example?: string;
    };
    enabled: boolean;
  }>;
  response_mode: 'immediate' | 'missed_call_only';
  default_structured_output?: {
    fields: StructuredOutputField[];
  };
  order_details?: string;
}

export function CheckoutConfigForm({ planId, onClose, onProceed }: CheckoutConfigFormProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<CheckoutConfig>({
    company_name: '',
    industry: '',
    customer_phone: '',
    phone_provider: '',
    whatsapp_configs: [],
    response_mode: 'immediate',
    order_details: '',
  });

  const whatsappLimit = getWhatsAppLimit(planId);
  const plan = PRICING_PLANS[planId];

  // Inizializza WhatsApp configs quando cambia industry o limit
  const initializeWhatsAppConfigs = () => {
    if (config.whatsapp_configs.length === 0 && config.industry) {
      const defaultFields = getIndustryStructuredOutput(config.industry);
      setConfig({
        ...config,
        whatsapp_configs: Array.from({ length: whatsappLimit }, (_, i) => ({
          whatsapp_number: '',
          whatsapp_name: '',
          structured_output_config: {
            fields: defaultFields,
          },
          enabled: i === 0, // Solo il primo abilitato di default
        })),
      });
    }
  };

  const handleIndustryChange = (industry: string) => {
    const defaultFields = getIndustryStructuredOutput(industry);
    setConfig({
      ...config,
      industry,
      whatsapp_configs: config.whatsapp_configs.map((wc, i) => ({
        ...wc,
        structured_output_config: i === 0 || !wc.structured_output_config.fields.length
          ? { fields: defaultFields }
          : wc.structured_output_config,
      })),
    });
  };

  const updateWhatsAppConfig = (index: number, updates: Partial<CheckoutConfig['whatsapp_configs'][0]>) => {
    const updated = [...config.whatsapp_configs];
    updated[index] = { ...updated[index], ...updates };
    setConfig({ ...config, whatsapp_configs: updated });
  };

  const addStructuredField = (whatsappIndex: number, field: StructuredOutputField) => {
    const updated = [...config.whatsapp_configs];
    updated[whatsappIndex].structured_output_config.fields.push(field);
    setConfig({ ...config, whatsapp_configs: updated });
  };

  const removeStructuredField = (whatsappIndex: number, fieldIndex: number) => {
    const updated = [...config.whatsapp_configs];
    updated[whatsappIndex].structured_output_config.fields.splice(fieldIndex, 1);
    setConfig({ ...config, whatsapp_configs: updated });
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      return !!(config.company_name && config.industry && config.customer_phone && config.phone_provider);
    }
    if (step === 2) {
      return config.whatsapp_configs.some((wc, i) => 
        wc.enabled && wc.whatsapp_number && wc.structured_output_config.fields.length > 0
      );
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onProceed(config);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Configura il tuo centralino
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Piano {plan.name} - Step {step} di 3
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                    s <= step ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? 'bg-red-700' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-red-700" />
                  Informazioni Base
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nome Azienda *
                    </label>
                    <input
                      type="text"
                      value={config.company_name}
                      onChange={(e) => setConfig({ ...config, company_name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      placeholder="Es: Pizzeria Da Mario"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Settore *
                    </label>
                    <select
                      value={config.industry}
                      onChange={(e) => handleIndustryChange(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Seleziona settore</option>
                      {INDUSTRIES.map((ind) => (
                        <option key={ind.value} value={ind.value}>
                          {ind.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Numero Telefono Esistente *
                    </label>
                    <input
                      type="tel"
                      value={config.customer_phone}
                      onChange={(e) => setConfig({ ...config, customer_phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      placeholder="+39 333 123 4567"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Numero su cui verrà fatto l'inoltro chiamate
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Provider Telefonico *
                    </label>
                    <select
                      value={config.phone_provider}
                      onChange={(e) => setConfig({ ...config, phone_provider: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Seleziona provider</option>
                      {PHONE_PROVIDERS.map((provider) => (
                        <option key={provider.value} value={provider.value}>
                          {provider.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-500 mt-1">
                      Ti spiegheremo come attivare l'inoltro per il tuo provider
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-red-700" />
                  Configurazione WhatsApp ({whatsappLimit} {whatsappLimit === 1 ? 'numero' : 'numeri'})
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Configura i numeri WhatsApp dove ricevere i lead. Ogni numero può avere un structured output personalizzato.
                </p>
              </div>

              {config.whatsapp_configs.map((whatsapp, index) => {
                if (!config.industry) {
                  initializeWhatsAppConfigs();
                }
                return (
                  <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">
                        WhatsApp #{index + 1}
                      </h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={whatsapp.enabled}
                          onChange={(e) => updateWhatsAppConfig(index, { enabled: e.target.checked })}
                          className="w-4 h-4 text-red-700 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-slate-600">Abilitato</span>
                      </label>
                    </div>

                    {whatsapp.enabled && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Numero WhatsApp *
                            </label>
                            <input
                              type="tel"
                              value={whatsapp.whatsapp_number}
                              onChange={(e) => updateWhatsAppConfig(index, { whatsapp_number: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                              placeholder="+39 333 123 4567"
                              required={whatsapp.enabled}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Nome Agente/Team (opzionale)
                            </label>
                            <input
                              type="text"
                              value={whatsapp.whatsapp_name || ''}
                              onChange={(e) => updateWhatsAppConfig(index, { whatsapp_name: e.target.value })}
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                              placeholder="Es: Team Vendite"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Structured Output
                          </label>
                          <div className="space-y-2">
                            {whatsapp.structured_output_config.fields.map((field, fieldIndex) => (
                              <div key={fieldIndex} className="flex items-center gap-2 p-2 bg-slate-50 rounded">
                                <div className="flex-1 text-sm">
                                  <strong>{field.label}</strong> ({field.type})
                                  {field.required && <span className="text-red-600 ml-1">*</span>}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeStructuredField(index, fieldIndex)}
                                  className="p-1 hover:bg-red-100 rounded text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 mt-2">
                            Structured output predefinito per {config.industry || 'questo settore'}. 
                            Puoi personalizzarlo dopo l'attivazione.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-red-700" />
                  Configurazione Finale
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quando risponde l'agent? *
                    </label>
                    <div className="space-y-3">
                      {RESPONSE_MODES.map((mode) => (
                        <label
                          key={mode.value}
                          className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition"
                          style={{
                            borderColor: config.response_mode === mode.value ? '#DC2626' : '#E2E8F0',
                            backgroundColor: config.response_mode === mode.value ? '#FEF2F2' : 'transparent',
                          }}
                        >
                          <input
                            type="radio"
                            name="response_mode"
                            value={mode.value}
                            checked={config.response_mode === mode.value}
                            onChange={(e) => setConfig({ ...config, response_mode: e.target.value as 'immediate' | 'missed_call_only' })}
                            className="mt-1 w-4 h-4 text-red-700 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900">{mode.label}</div>
                            <div className="text-sm text-slate-600 mt-1">{mode.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Note aggiuntive (opzionale)
                    </label>
                    <textarea
                      value={config.order_details || ''}
                      onChange={(e) => setConfig({ ...config, order_details: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                      placeholder="Descrivi eventuali richieste specifiche o dettagli per il setup..."
                    />
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Cosa succede dopo?</h4>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>✅ Completerai il pagamento su Stripe</li>
                      <li>✅ Riceverai email di conferma ordine</li>
                      <li>✅ Entro 1 settimana configureremo il tuo agent</li>
                      <li>✅ Ti spiegheremo come attivare l'inoltro chiamate sul tuo provider</li>
                      <li>✅ Il tuo centralino sarà attivo!</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2 px-6 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 1 ? 'Indietro' : 'Annulla'}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Totale: €{plan.monthlyPrice}/mese
              {plan.setupFee > 0 && ` + €${plan.setupFee} setup`}
            </div>
            <button
              onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
              disabled={!validateStep()}
              className="flex items-center gap-2 px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step < 3 ? (
                <>
                  Avanti
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                'Procedi al Pagamento'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

