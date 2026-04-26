import { Article, ArticlesResponse, ArticleCategory } from '@/types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getArticles(): Promise<ArticlesResponse> {
  return fetchAPI<ArticlesResponse>('/articles');
}

export async function getArticle(id: string): Promise<Article> {
  return fetchAPI<Article>(`/articles/${id}`);
}

export async function getArticlesByCategory(category: ArticleCategory): Promise<ArticlesResponse> {
  return fetchAPI<ArticlesResponse>(`/articles?category=${category}`);
}

export async function searchArticles(query: string): Promise<ArticlesResponse> {
  return fetchAPI<ArticlesResponse>(`/articles?search=${encodeURIComponent(query)}`);
}
