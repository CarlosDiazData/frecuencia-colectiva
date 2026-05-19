import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';
import type { Citation, ChatResponse } from '../types/chat';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const TABLE_NAME = process.env.TABLE_NAME || 'Articles';
const BEDROCK_MODEL_ID =
  process.env.BEDROCK_MODEL_ID ||
  'anthropic.claude-haiku-4-5-20251001-v1:0';

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

  // If no articles found, return early without calling Bedrock
  if (articles.length === 0) {
    return createResponse(200, {
      answer:
        'No encontré información sobre este tema en nuestros artículos publicados.',
      citations: [],
    });
  }

  // Build context blocks and invoke Bedrock
  let answer: string;
  try {
    const contextMessage = `${buildArticleContext(articles)}\n\nPregunta del usuario: ${parsedBody.message}`;

    const converseCommand = new ConverseCommand({
      modelId: BEDROCK_MODEL_ID,
      system: [{ text: SYSTEM_PROMPT }],
      messages: [
        {
          role: 'user',
          content: [{ text: contextMessage }],
        },
      ],
      inferenceConfig: {
        maxTokens: 1024,
        temperature: 0,
      },
    });

    const response = await bedrockClient.send(converseCommand);
    answer = response.output?.message?.content?.[0]?.text || '';
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorName = error instanceof Error ? error.name : 'Unknown';
    console.error('Error calling Bedrock:', errorMessage);
    console.error('Bedrock error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return createResponse(502, {
      error: 'AI service temporarily unavailable',
      debug: `${errorName}: ${errorMessage}`,
    });
  }

  const citations = parseCitations(answer);

  return createResponse(200, { answer, citations } satisfies ChatResponse);
};
