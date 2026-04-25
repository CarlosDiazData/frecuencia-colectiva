export function ContactPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">Contáctanos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-2xl font-bold mb-4">Envíanos un mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Nombre</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Correo electrónico</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Mensaje</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white font-bold hover:bg-primary-dark transition-colors"
              >
                Enviar mensaje
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