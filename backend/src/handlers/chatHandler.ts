import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import type { Citation, ChatResponse } from '../types/chat';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.TABLE_NAME || 'Articles';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const SYSTEM_PROMPT = `Eres un asistente cultural que responde SOLO con los artículos proporcionados.
1. Responde ÚNICAMENTE con datos explícitos de los artículos.
2. Si no hay información suficiente, di: "No encontré información sobre este tema en nuestros artículos publicados."
3. NO inventes fechas, nombres, lugares, ni detalles. NADA fuera de los artículos.
4. Cada dato factual debe citarse como [Título del artículo](URL).
5. Máximo 3 párrafos. Sé conversacional pero preciso.
6. Si los artículos son parcialmente relevantes, menciona lo encontrado y reconoce vacíos.`;

interface Article {
  articleId: string;
  title: string;
  body: string;
  url: string;
  category: string;
  date: string;
  summary: string;
  author: string;
  imageUrl: string;
  readTimeMinutes: number;
}

function createResponse(
  statusCode: number,
  body: unknown
): HandlerResponse {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

function parseCitations(text: string): Citation[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const citations: Citation[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    citations.push({ title: match[1], url: match[2] });
  }
  return citations;
}

function buildArticleContext(articles: Article[]): string {
  return articles
    .map(
      (article, index) =>
        `--- ARTÍCULO ${index + 1} ---
Título: ${article.title}
Categoría: ${article.category}
Fecha: ${article.date}
URL: ${article.url}
Contenido:
${article.body}`
    )
    .join('\n\n');
}

interface HandlerEvent {
  httpMethod: string;
  body: string | null;
  headers?: Record<string, string>;
}

interface HandlerResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

export async function handler(event: HandlerEvent): Promise<HandlerResponse> {
  // Method guard
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  // Validate request body
  if (!event.body) {
    return createResponse(400, { error: 'Request body is required' });
  }

  let parsedBody: { message?: string };
  try {
    parsedBody = JSON.parse(event.body);
  } catch {
    return createResponse(400, { error: 'Invalid JSON body' });
  }

  if (
    !parsedBody.message ||
    typeof parsedBody.message !== 'string' ||
    parsedBody.message.trim().length === 0
  ) {
    return createResponse(400, { error: 'Message is required' });
  }

  // Scan DynamoDB for all articles
  let articles: Article[];
  try {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const response = await docClient.send(command);
    articles = (response.Items || []) as Article[];
  } catch (error) {
    console.error('Error scanning articles:', error);
    return createResponse(500, { error: 'Failed to retrieve articles' });
  }

  // If no articles found, return early without calling Gemini
  if (articles.length === 0) {
    return createResponse(200, {
      answer:
        'No encontré información sobre este tema en nuestros artículos publicados.',
      citations: [],
    });
  }

  // Build context and invoke Gemini
  let answer: string;
  try {
    const contextMessage = `${buildArticleContext(articles)}\n\nPregunta del usuario: ${parsedBody.message}`;

    const geminiResponse = await fetch(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: contextMessage }],
            },
          ],
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errorText);
      throw new Error(`Gemini API returned ${geminiResponse.status}`);
    }

    const data = (await geminiResponse.json()) as GeminiResponse;
    answer = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error calling Gemini:', errorMessage);
    return createResponse(502, {
      error: 'AI service temporarily unavailable',
    });
  }

  const citations = parseCitations(answer);

  return createResponse(200, { answer, citations } satisfies ChatResponse);
}
