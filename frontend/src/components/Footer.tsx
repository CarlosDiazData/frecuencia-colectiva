import { Link } from 'react-router-dom';

const footerLinks = {
  sections: [
    { name: 'World', path: '/section/world' },
    { name: 'Technology', path: '/section/technology' },
    { name: 'Sports', path: '/section/sports' },
    { name: 'Culture', path: '/section/culture' },
  ],
  company: [
    { name: 'About Us', path: '#' },
    { name: 'Contact', path: '#' },
    { name: 'Careers', path: '#' },
    { name: 'Advertise', path: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
    { name: 'Cookie Policy', path: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-black text-white">
              THE DAILY CHRONICLE
            </Link>
            <p className="text-gray-400 mt-4 text-sm">
              Delivering trusted news and in-depth analysis from around the globe since 2024.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-gray-300">
              Sections
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
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-gray-300">
              Company
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
            <h4 className="font-semibold text-sm uppercase tracking-wide mb-4 text-gray-300">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest news delivered to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} The Daily Chronicle. All rights reserved.
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
