import { Link } from 'react-router-dom';

const footerLinks = {
  sections: [
    { name: 'Política', path: '/section/politics' },
    { name: 'Economía', path: '/section/economy' },
    { name: 'Cultura', path: '/section/culture' },
    { name: 'Deportes', path: '/section/sports' },
  ],
  company: [
    { name: 'Nosotros', path: '#' },
    { name: 'Contacto', path: '#' },
    { name: 'Trabaja con nosotros', path: '#' },
    { name: 'Publicidad', path: '#' },
  ],
  legal: [
    { name: 'Política de Privacidad', path: '#' },
    { name: 'Términos de Servicio', path: '#' },
    { name: 'Política de Cookies', path: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-black text-white">
              FRECUENCIA COLECTIVA
            </Link>
            <p className="text-gray-400 mt-4 text-sm">
              Periodismo independiente desde Toluca, Estado de México.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Secciones
            </h4>
            <ul className="space-y-2">
              {footerLinks.sections.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Empresa
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">
              Boletín
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Recibe las noticias más importantes en tu correo.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-sm transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Frecuencia Colectiva. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              {footerLinks.legal.map(link => (
                <Link key={link.name} to={link.path} className="text-gray-500 hover:text-white transition-colors text-sm">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
