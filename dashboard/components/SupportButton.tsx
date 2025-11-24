'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail } from 'lucide-react';

interface SupportButtonProps {
  variant?: 'button' | 'floating';
  position?: 'pre-purchase' | 'dashboard';
}

/**
 * Support Button Component
 * Assistenza clienti e consulenza personalizzata
 */
export function SupportButton({ variant = 'floating', position = 'dashboard' }: SupportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'consultation'>('chat');
  const [message, setMessage] = useState('');
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    request: '',
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('');
        alert('Messaggio inviato! Ti risponderemo entro 24 ore.');
      } else {
        alert(`Errore: ${data.error || 'Impossibile inviare messaggio'}`);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      alert('Errore di connessione. Riprova più tardi.');
    }
  };

  const handleConsultationRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/support/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultationForm),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Richiesta consulenza inviata! Ti contatteremo entro 1-2 giorni lavorativi.');
        
        // Reset form
        setConsultationForm({
          name: '',
          email: '',
          phone: '',
          company: '',
          industry: '',
          request: '',
        });
      } else {
        alert(`Errore: ${data.error || 'Impossibile inviare richiesta'}`);
      }
    } catch (error: any) {
      console.error('Error sending consultation request:', error);
      alert('Errore di connessione. Riprova più tardi.');
    }
  };

  if (variant === 'button') {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition shadow-lg"
      >
        <MessageCircle className="w-5 h-5" />
        Assistenza Clienti
      </button>
    );
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-red-700 hover:bg-red-800 text-white rounded-full shadow-xl flex items-center justify-center transition hover:scale-110 z-50"
        aria-label="Assistenza clienti"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Support Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Assistenza Clienti
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Siamo qui per aiutarti
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                  activeTab === 'chat'
                    ? 'text-red-700 border-b-2 border-red-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageCircle className="w-4 h-4 inline-block mr-2" />
                Assistenza
              </button>
              <button
                onClick={() => setActiveTab('consultation')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition ${
                  activeTab === 'consultation'
                    ? 'text-red-700 border-b-2 border-red-700'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="w-4 h-4 inline-block mr-2" />
                Consulenza Personalizzata
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'chat' ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-700">
                      <strong>Chat diretta:</strong> Ti risponderemo entro 24 ore
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Email:</strong> support@helping-hand.it
                    </p>
                    <p className="text-sm text-slate-600 mt-2">
                      <strong>Telefono:</strong> +39 02 XXX XXX
                    </p>
                  </div>

                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Il tuo messaggio
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                        placeholder="Descrivi il tuo problema o la tua richiesta..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Invia Messaggio
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Consulenza Personalizzata Gratuita
                    </h3>
                    <p className="text-sm text-slate-700">
                      Richiedi una consulenza gratuita con il nostro team per:
                    </p>
                    <ul className="text-sm text-slate-700 mt-2 space-y-1 ml-4 list-disc">
                      <li>Setup personalizzato del tuo agent</li>
                      <li>Configurazione structured output ottimale</li>
                      <li>Ottimizzazione del workflow</li>
                      <li>Strategie per aumentare conversioni</li>
                    </ul>
                  </div>

                  <form onSubmit={handleConsultationRequest} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nome *
                        </label>
                        <input
                          type="text"
                          value={consultationForm.name}
                          onChange={(e) => setConsultationForm({ ...consultationForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={consultationForm.email}
                          onChange={(e) => setConsultationForm({ ...consultationForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Telefono *
                        </label>
                        <input
                          type="tel"
                          value={consultationForm.phone}
                          onChange={(e) => setConsultationForm({ ...consultationForm, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Azienda
                        </label>
                        <input
                          type="text"
                          value={consultationForm.company}
                          onChange={(e) => setConsultationForm({ ...consultationForm, company: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Settore
                      </label>
                      <select
                        value={consultationForm.industry}
                        onChange={(e) => setConsultationForm({ ...consultationForm, industry: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                      >
                        <option value="">Seleziona settore</option>
                        <option value="ristorante">Ristorante / Pizzeria</option>
                        <option value="immobiliare">Immobiliare</option>
                        <option value="servizi">Servizi Professionali</option>
                        <option value="altro">Altro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Richiesta *
                      </label>
                      <textarea
                        value={consultationForm.request}
                        onChange={(e) => setConsultationForm({ ...consultationForm, request: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                        placeholder="Descrivi la tua richiesta di consulenza..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Richiedi Consulenza Gratuita
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

