export interface Article {
  articleId: string;
  title: string;
  summary: string;
  body: string;
  author: string;
  date: string;
  category: ArticleCategory;
  imageUrl: string;
  readTimeMinutes: number;
}

export type ArticleCategory = 'technology' | 'sports' | 'world' | 'culture';

export interface ArticlesResponse {
  articles: Article[];
  count: number;
}

export type CategoryFilter = ArticleCategory | 'all';
