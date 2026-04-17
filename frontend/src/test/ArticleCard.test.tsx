import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Article } from '../types';

describe('ArticleCard', () => {
  const mockArticle: Article = {
    articleId: 'test-id',
    title: 'Test Article Title',
    summary: 'This is a test article summary.',
    body: 'Full article body content.',
    author: 'John Doe',
    date: '2024-03-15T10:00:00Z',
    category: 'technology',
    imageUrl: 'https://example.com/image.jpg',
    readTimeMinutes: 5,
  };

  it('renders article title', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={mockArticle} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('renders article summary', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={mockArticle} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('This is a test article summary.')).toBeInTheDocument();
  });

  it('renders author name', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={mockArticle} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders category tag', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={mockArticle} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });
});
