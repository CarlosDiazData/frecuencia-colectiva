import { useState, FormEvent } from 'react';
import { API_BASE_URL } from '@/utils/api';

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">Contáctanos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">Envíanos un mensaje</h2>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                ¡Mensaje enviado! Te responderemos pronto.
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-bold mb-2">Nombre</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-bold mb-2">Correo electrónico</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-bold mb-2">Mensaje</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-6 py-2 bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">Información de contacto</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>Correo:</strong> contacto@frecuenciacolectiva.com</p>
              <p><strong>Ubicación:</strong> Toluca, Estado de México</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}