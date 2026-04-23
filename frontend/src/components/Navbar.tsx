import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/context/SearchContext';

const sections = [
  {
    name: 'EXPRESIONES ARTÍSTICAS',
    items: [
      { name: 'Arte visual', path: '/section/arte-visual' },
      { name: 'Arte escénico', path: '/section/arte-escenico' },
      { name: 'Cine y audiovisual', path: '/section/cine-y-audiovisual' },
    ],
  },
  {
    name: 'COSTUMBRES, CREENCIAS Y TRADICIONES',
    items: [
      { name: 'Festividades locales', path: '/section/festividades-locales' },
      { name: 'Historias familiares o comunitarias', path: '/section/historias-familiares' },
      { name: 'Gastronomía', path: '/section/gastronomia' },
    ],
  },
  {
    name: 'MODOS DE VIDA',
    items: [
      { name: 'Patrimonio', path: '/section/patrimonio' },
      { name: 'Identidad', path: '/section/identidad' },
      { name: 'Agenda cultural digital', path: '/section/agenda-cultural' },
    ],
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { searchQuery, setSearchQuery, isSearchOpen, toggleSearch } = useSearch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <nav className="max-w-7xl mx-auto px-4" ref={dropdownRef}>
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-serif text-3xl font-black tracking-tight">
              FRECUENCIA COLECTIVA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {sections.map(section => (
              <div key={section.name} className="relative">
                <button
                  onClick={() => toggleDropdown(section.name)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                    openDropdown === section.name ? 'text-primary' : 'text-gray-900 hover:text-primary'
                  }`}
                >
                  <span className="whitespace-nowrap">{section.name}</span>
                  <svg
                    className={`w-3 h-3 transition-transform ${openDropdown === section.name ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {openDropdown === section.name && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-lg min-w-48 z-50">
                    {section.items.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-900 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-900 hover:text-primary"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 pt-4">
            {sections.map(section => (
              <div key={section.name} className="border-b border-gray-200 pb-2 mb-2">
                <button
                  onClick={() => toggleDropdown(section.name)}
                  className="flex items-center justify-between w-full py-2 text-sm font-bold uppercase tracking-wider text-gray-900"
                >
                  <span>{section.name}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${openDropdown === section.name ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === section.name && (
                  <div className="pl-4 flex flex-col gap-1">
                    {section.items.map(item => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setOpenDropdown(null);
                        }}
                        className="text-sm text-gray-700 py-1 hover:text-primary"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
