export function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">Aviso de Privacidad</h1>

        <section className="mb-8">
          <h2 className="font-serif text-xl font-bold mb-3">Responsable</h2>
          <p className="text-gray-700">
            Frecuencia Colectiva, con domicilio en Toluca, Estado de México, es responsable
            del tratamiento de sus datos personales.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-xl font-bold mb-3">Datos que recopilamos</h2>
          <p className="text-gray-700">
            Recopilamos datos personales cuando usted se subscribe a nuestro boletín,
            llena formularios de contacto o deja comentarios en nuestros artículos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-xl font-bold mb-3">Uso de sus datos</h2>
          <p className="text-gray-700">
            Utilizamos sus datos para enviarle nuestro boletín, responder a sus mensajes
            y mejorar nuestros servicios. No vendemos ni compartimos sus datos con terceros.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-bold mb-3">Contacto</h2>
          <p className="text-gray-700">
            Para ejercer sus derechos de acceso, rectificación, cancelación u oposición,
            contactenos en: contacto@frecuenciacolectiva.com
          </p>
        </section>
      </main>
    </div>
  );
}