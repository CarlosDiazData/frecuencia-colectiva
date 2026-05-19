import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockDynamoDbSend: any = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockFetch: any = jest.fn();

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn(() => ({})),
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn(() => ({
      send: mockDynamoDbSend,
    })),
  },
  ScanCommand: jest.fn(),
}));

// Mock global fetch for Gemini API calls
global.fetch = mockFetch;

// Set a dummy API key so the handler doesn't use empty string
process.env.GEMINI_API_KEY = 'test-key';

import { handler } from '../src/handlers/chatHandler';

interface TestEvent {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string>;
}

const baseEvent: TestEvent = {
  httpMethod: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: '¿qué eventos culturales hay este mes?' }),
};

function mockGeminiResponse(text: string) {
  return Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        candidates: [
          {
            content: {
              parts: [{ text }],
            },
          },
        ],
      }),
  });
}

function mockGeminiError(status: number, body?: string) {
  return Promise.resolve({
    ok: false,
    status,
    text: () => Promise.resolve(body || 'Error'),
  });
}

describe('chatHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Method Guard', () => {
    it('should return 405 for GET requests', async () => {
      const response = await handler({ ...baseEvent, httpMethod: 'GET' });
      expect(response.statusCode).toBe(405);
      expect(mockDynamoDbSend).not.toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return 200 for OPTIONS requests', async () => {
      const response = await handler({ ...baseEvent, httpMethod: 'OPTIONS' });
      expect(response.statusCode).toBe(200);
      expect(mockDynamoDbSend).not.toHaveBeenCalled();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Input Validation', () => {
    it('should return 400 for empty message string', async () => {
      const response = await handler({
        ...baseEvent,
        body: JSON.stringify({ message: '' }),
      });
      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('error');
      expect(mockDynamoDbSend).not.toHaveBeenCalled();
    });

    it('should return 400 for missing message field', async () => {
      const response = await handler({
        ...baseEvent,
        body: JSON.stringify({}),
      });
      expect(response.statusCode).toBe(400);
      expect(mockDynamoDbSend).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid JSON body', async () => {
      const response = await handler({
        ...baseEvent,
        body: 'not-valid-json',
      });
      expect(response.statusCode).toBe(400);
      expect(mockDynamoDbSend).not.toHaveBeenCalled();
    });

    it('should return 400 when body is null', async () => {
      const response = await handler({
        ...baseEvent,
        body: null,
      });
      expect(response.statusCode).toBe(400);
      expect(mockDynamoDbSend).not.toHaveBeenCalled();
    });
  });

  describe('DynamoDB Error', () => {
    it('should return 500 when DynamoDB scan fails', async () => {
      mockDynamoDbSend.mockRejectedValueOnce(new Error('DynamoDB error'));
      const response = await handler(baseEvent);
      expect(response.statusCode).toBe(500);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Zero Articles', () => {
    it('should return "No encontré información" without calling Gemini when no articles exist', async () => {
      mockDynamoDbSend.mockResolvedValueOnce({ Items: [] });
      const response = await handler(baseEvent);
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.answer).toContain('No encontré información');
      expect(body.citations).toEqual([]);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('Gemini Error', () => {
    it('should return 502 when Gemini API call fails', async () => {
      mockDynamoDbSend.mockResolvedValueOnce({
        Items: [
          {
            articleId: '1',
            title: 'Test Article',
            body: 'Content',
            url: 'https://example.com/test',
            category: 'general',
            date: '2024-03-15',
            summary: 'Summary',
            author: 'Author',
            imageUrl: '',
            readTimeMinutes: 5,
          },
        ],
      });
      mockFetch.mockResolvedValueOnce(mockGeminiError(500));

      const response = await handler(baseEvent);
      expect(response.statusCode).toBe(502);
      const body = JSON.parse(response.body);
      expect(body.error).toBe('AI service temporarily unavailable');
    });
  });

  describe('Successful Response Shape', () => {
    it('should return 200 with answer and citations array', async () => {
      const mockArticles = [
        {
          articleId: '1',
          title: 'Evento Cultural',
          body: 'Contenido del evento cultural en la ciudad.',
          url: 'https://example.com/evento',
          category: 'agenda-cultural',
          date: '2024-03-15',
          summary: 'Resumen',
          author: 'Autor',
          imageUrl: '',
          readTimeMinutes: 5,
        },
      ];

      mockDynamoDbSend.mockResolvedValueOnce({ Items: mockArticles });
      mockFetch.mockResolvedValueOnce(
        mockGeminiResponse(
          'Te recomiendo visitar [Evento Cultural](https://example.com/evento).'
        )
      );

      const response = await handler(baseEvent);
      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body).toHaveProperty('answer');
      expect(body).toHaveProperty('citations');
      expect(typeof body.answer).toBe('string');
      expect(Array.isArray(body.citations)).toBe(true);
    });

    it('should parse citations from markdown links in the answer', async () => {
      const mockArticles = [
        {
          articleId: '1',
          title: 'Evento Cultural',
          body: 'Contenido del primer artículo.',
          url: 'https://example.com/evento',
          category: 'agenda-cultural',
          date: '2024-03-15',
          summary: 'Resumen',
          author: 'Autor',
          imageUrl: '',
          readTimeMinutes: 5,
        },
        {
          articleId: '2',
          title: 'Museo Abierto',
          body: 'Contenido del segundo artículo.',
          url: 'https://example.com/museo',
          category: 'patrimonio',
          date: '2024-03-20',
          summary: 'Resumen museo',
          author: 'Autor',
          imageUrl: '',
          readTimeMinutes: 3,
        },
      ];

      mockDynamoDbSend.mockResolvedValueOnce({ Items: mockArticles });
      mockFetch.mockResolvedValueOnce(
        mockGeminiResponse(
          'Puedes visitar [Evento Cultural](https://example.com/evento) y también [Museo Abierto](https://example.com/museo).'
        )
      );

      const response = await handler(baseEvent);
      const body = JSON.parse(response.body);
      expect(body.citations).toHaveLength(2);
      expect(body.citations[0]).toEqual({
        title: 'Evento Cultural',
        url: 'https://example.com/evento',
      });
      expect(body.citations[1]).toEqual({
        title: 'Museo Abierto',
        url: 'https://example.com/museo',
      });
    });
  });
});
