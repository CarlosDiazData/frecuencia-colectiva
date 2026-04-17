import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'Articles';

interface Article {
  articleId: string;
  title: string;
  summary: string;
  body: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  readTimeMinutes: number;
}

interface Response {
  statusCode: number;
  headers: {
    'Content-Type': string;
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Headers': string;
  };
  body: string;
}

function createResponse(statusCode: number, body: unknown): Response {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(body),
  };
}

export async function handler(event: {
  pathParameters?: { id?: string };
}): Promise<Response> {
  try {
    const articleId = event.pathParameters?.id;

    if (!articleId) {
      return createResponse(400, {
        error: 'Article ID is required',
      });
    }

    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        articleId,
      },
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return createResponse(404, {
        error: 'Article not found',
      });
    }

    const article = response.Item as Article;

    return createResponse(200, article);
  } catch (error) {
    console.error('Error getting article:', error);
    return createResponse(500, {
      error: 'Failed to retrieve article',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
