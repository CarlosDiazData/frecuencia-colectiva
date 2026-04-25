export function AnunciatePage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">Anúnciate</h1>

        <p className="text-gray-700 mb-8">
          Reaching the audience of Frecuencia Colectiva means connecting with engaged readers
          interested in local culture, community, and events in the Toluca region.
        </p>

        <div className="bg-gray-50 p-8">
          <h2 className="font-serif text-2xl font-bold mb-4">Contacto publicitario</h2>
          <p className="text-gray-700 mb-4">
            Para información sobre oportunidades de publicidad y colaboraciones:
          </p>
          <a
            href="mailto:publicidad@frecuenciacolectiva.com"
            className="text-primary font-bold hover:underline text-lg"
          >
            publicidad@frecuenciacolectiva.com
          </a>
        </div>
      </main>
    </div>
  );
}