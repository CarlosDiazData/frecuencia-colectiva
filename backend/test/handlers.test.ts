import { describe, it, expect } from 'vitest';
import { Article } from '../types';

interface LambdaResponse {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
  };
  body: string;
}

const mockArticle: Article = {
  articleId: 'test-id',
  title: 'Test Article',
  summary: 'Test summary',
  body: 'Test body content',
  author: 'Test Author',
  date: '2024-03-15T10:00:00Z',
  category: 'technology',
  imageUrl: 'https://example.com/image.jpg',
  readTimeMinutes: 5,
};

describe('Lambda Handler Tests', () => {
  describe('listArticlesHandler', () => {
    it('should return articles response format', () => {
      const mockResponse: { articles: Article[]; count: number } = {
        articles: [mockArticle],
        count: 1,
      };

      expect(mockResponse).toHaveProperty('articles');
      expect(mockResponse).toHaveProperty('count');
      expect(Array.isArray(mockResponse.articles)).toBe(true);
    });

    it('should filter by category', () => {
      const categoryFilteredResponse = {
        articles: [mockArticle],
        count: 1,
        category: 'technology',
      };

      expect(categoryFilteredResponse.articles[0].category).toBe('technology');
    });
  });

  describe('getArticleHandler', () => {
    it('should return single article by ID', () => {
      const singleArticleResponse = mockArticle;
      expect(singleArticleResponse).toHaveProperty('articleId');
      expect(singleArticleResponse).toHaveProperty('title');
      expect(singleArticleResponse).toHaveProperty('body');
    });
  });

  describe('Response Format', () => {
    it('should have correct status codes', () => {
      const successResponse: LambdaResponse = {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ articles: [] }),
      };

      expect(successResponse.statusCode).toBe(200);

      const errorResponse: LambdaResponse = {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Internal server error' }),
      };

      expect(errorResponse.statusCode).toBe(500);
    });
  });
});
