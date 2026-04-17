import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

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

const validCategories = ['technology', 'sports', 'world', 'culture'];

export async function handler(event: {
  queryStringParameters?: { category?: string };
}): Promise<Response> {
  try {
    const { category } = event.queryStringParameters || {};

    if (!category) {
      return createResponse(400, {
        error: 'Category parameter is required',
      });
    }

    const normalizedCategory = category.toLowerCase();

    if (!validCategories.includes(normalizedCategory)) {
      return createResponse(400, {
        error: 'Invalid category',
        validCategories,
      });
    }

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'categoryIndex',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': normalizedCategory,
      },
      ScanIndexForward: false,
    });

    const response = await docClient.send(command);
    const articles = (response.Items || []) as Article[];

    return createResponse(200, {
      articles,
      count: articles.length,
      category: normalizedCategory,
    });
  } catch (error) {
    console.error('Error filtering articles by category:', error);
    return createResponse(500, {
      error: 'Failed to filter articles',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
