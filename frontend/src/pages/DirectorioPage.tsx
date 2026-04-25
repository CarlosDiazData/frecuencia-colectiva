export function DirectorioPage() {
  const contacts = [
    { role: 'Dirección Editorial', email: 'contacto@frecuenciacolectiva.com' },
    { role: 'Reportería', email: 'reportes@frecuenciacolectiva.com' },
    { role: 'Colaboraciones', email: 'colaboraciones@frecuenciacolectiva.com' },
    { role: 'Publicidad', email: 'publicidad@frecuenciacolectiva.com' },
  ];

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-8">Directorio</h1>

        <p className="text-gray-700 mb-8">
          Contactos de nuestro equipo para comunicaciones profesionales y de medios.
        </p>

        <div className="space-y-4">
          {contacts.map(contact => (
            <div key={contact.role} className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 py-4">
              <h3 className="font-bold text-lg">{contact.role}</h3>
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}