import { describe, it, expect } from 'vitest';
import { Article } from '../types';

const mockArticle: Article = {
  articleId: 'test-id-123',
  title: 'Test Article Title',
  summary: 'This is a test article summary.',
  body: 'Full article body content.',
  author: 'John Doe',
  date: '2024-03-15T10:00:00Z',
  category: 'technology',
  imageUrl: 'https://example.com/image.jpg',
  readTimeMinutes: 5,
};

describe('Article Interface', () => {
  it('should have all required fields', () => {
    expect(mockArticle).toHaveProperty('articleId');
    expect(mockArticle).toHaveProperty('title');
    expect(mockArticle).toHaveProperty('summary');
    expect(mockArticle).toHaveProperty('body');
    expect(mockArticle).toHaveProperty('author');
    expect(mockArticle).toHaveProperty('date');
    expect(mockArticle).toHaveProperty('category');
    expect(mockArticle).toHaveProperty('imageUrl');
    expect(mockArticle).toHaveProperty('readTimeMinutes');
  });

  it('should have correct types', () => {
    expect(typeof mockArticle.articleId).toBe('string');
    expect(typeof mockArticle.title).toBe('string');
    expect(typeof mockArticle.readTimeMinutes).toBe('number');
    expect(mockArticle.readTimeMinutes).toBeGreaterThan(0);
  });

  it('should have valid category', () => {
    const validCategories = ['technology', 'sports', 'world', 'culture'];
    expect(validCategories).toContain(mockArticle.category);
  });

  it('should have valid ISO date', () => {
    const date = new Date(mockArticle.date);
    expect(date).toBeInstanceOf(Date);
    expect(isNaN(date.getTime())).toBe(false);
  });
});
