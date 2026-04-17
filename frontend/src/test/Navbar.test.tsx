import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SearchProvider } from '../context/SearchContext';
import { Navbar } from '../components/Navbar';

describe('Navbar', () => {
  it('renders logo text', () => {
    render(
      <MemoryRouter>
        <SearchProvider>
          <Navbar />
        </SearchProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByText('FRECUENCIA COLECTIVA')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <SearchProvider>
          <Navbar />
        </SearchProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Política')).toBeInTheDocument();
    expect(screen.getByText('Economía')).toBeInTheDocument();
    expect(screen.getByText('Deportes')).toBeInTheDocument();
    expect(screen.getByText('Cultura')).toBeInTheDocument();
  });

  it('has a search button', () => {
    render(
      <MemoryRouter>
        <SearchProvider>
          <Navbar />
        </SearchProvider>
      </MemoryRouter>
    );
    
    const searchButton = screen.getByLabelText('Search');
    expect(searchButton).toBeInTheDocument();
  });
});
