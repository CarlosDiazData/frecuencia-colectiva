import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSearch } from '@/context/SearchContext';

const categories = [
  { name: 'Política', path: '/section/politics' },
  { name: 'Economía', path: '/section/economy' },
  { name: 'Cultura', path: '/section/culture' },
  { name: 'Deportes', path: '/section/sports' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, isSearchOpen, toggleSearch } = useSearch();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="bg-primary text-white py-1 px-4 text-sm font-semibold">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>EN VIVO</span>
        </div>
      </div>
      
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-serif text-3xl font-black tracking-tight">
              FRECUENCIA COLECTIVA
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {categories.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                  location.pathname === cat.path 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-900 hover:text-primary'
                }`}
              >
                {cat.name}
              </Link>
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
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-bold uppercase tracking-wider py-2 ${
                    location.pathname === cat.path ? 'text-primary' : 'text-gray-900'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
