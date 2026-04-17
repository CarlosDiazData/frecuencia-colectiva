import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSearch } from '@/context/SearchContext';

const categories = [
  { name: 'World', path: '/section/world' },
  { name: 'Technology', path: '/section/technology' },
  { name: 'Sports', path: '/section/sports' },
  { name: 'Culture', path: '/section/culture' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, isSearchOpen, toggleSearch } = useSearch();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="breaking-bar">
        <div className="max-w-7xl mx-auto px-4">
          <span className="font-bold">LIVE</span> Latest updates from around the world
        </div>
      </div>
      
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary font-serif text-2xl font-black tracking-tight">
              THE DAILY CHRONICLE
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {categories.map(cat => (
              <Link
                key={cat.path}
                to={cat.path}
                className={`text-sm font-semibold uppercase tracking-wide transition-colors ${
                  location.pathname === cat.path 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-primary transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary"
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-3">
              {categories.map(cat => (
                <Link
                  key={cat.path}
                  to={cat.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold uppercase tracking-wide py-2 ${
                    location.pathname === cat.path ? 'text-primary' : 'text-gray-700'
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
