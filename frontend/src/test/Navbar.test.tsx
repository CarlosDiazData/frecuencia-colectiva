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
    
    expect(screen.getByText('THE DAILY CHRONICLE')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <SearchProvider>
          <Navbar />
        </SearchProvider>
      </MemoryRouter>
    );
    
    expect(screen.getByText('World')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Sports')).toBeInTheDocument();
    expect(screen.getByText('Culture')).toBeInTheDocument();
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
