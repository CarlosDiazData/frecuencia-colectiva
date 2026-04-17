import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

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
  queryStringParameters?: { category?: string; search?: string };
}): Promise<Response> {
  try {
    const { category, search } = event.queryStringParameters || {};

    if (category) {
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'categoryIndex',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
        ScanIndexForward: false,
      });

      const response = await docClient.send(command);
      const articles = (response.Items || []) as Article[];

      return createResponse(200, {
        articles,
        count: articles.length,
      });
    }

    if (search) {
      const command = new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'contains(title, :search) OR contains(summary, :search)',
        ExpressionAttributeValues: {
          ':search': search,
        },
      });

      const response = await docClient.send(command);
      const articles = (response.Items || []) as Article[];

      return createResponse(200, {
        articles,
        count: articles.length,
      });
    }

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      Limit: 50,
    });

    const response = await docClient.send(command);
    const articles = (response.Items || []) as Article[];

    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return createResponse(200, {
      articles,
      count: articles.length,
    });
  } catch (error) {
    console.error('Error listing articles:', error);
    return createResponse(500, {
      error: 'Failed to retrieve articles',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
