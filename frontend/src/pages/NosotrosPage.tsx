export function NosotrosPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">Nosotros</h1>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold mb-4">Misión</h2>
          <p className="text-gray-700 leading-relaxed">
            Frecuencia Colectiva es un medio de comunicación independiente comprometido con el
            periodismo de calidad en Toluca y el Estado de México. Nuestra misión es informar,
            reflexionar y dar voz a las comunidades que componen nuestro territorio.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl font-bold mb-4">Historia</h2>
          <p className="text-gray-700 leading-relaxed">
            Nacimos con la convicción de que el periodismo local debe reflejar la diversidad y
            riqueza cultural de nuestra región. Desde nuestras raíces en la cultura popular
            mexiquense, hemos construido un espacio donde las historias de comunidad toman
            relevancia.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-6">Equipo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-1">Dirección Editorial</h3>
              <p className="text-gray-600">Equipo directivo comprometido con la независимость periodística</p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-1">Reportajes</h3>
              <p className="text-gray-600">Periodistas con experiencia en cobertura local y regional</p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-1">Producción Digital</h3>
              <p className="text-gray-600">Especialistas en contenido multimedia y plataformas digitales</p>
            </div>
            <div className="bg-gray-50 p-6">
              <h3 className="font-bold text-lg mb-1">Colaboradores</h3>
              <p className="text-gray-600">Escritores, fotógrafos y creadores de contenido de la comunidad</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}