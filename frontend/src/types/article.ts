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

export type ArticleCategory = 'arte-visual' | 'arte-escenico' | 'cine-y-audiovisual' | 'festividades-locales' | 'historias-familiares' | 'gastronomia' | 'patrimonio' | 'identidad' | 'agenda-cultural';

export interface ArticlesResponse {
  articles: Article[];
  count: number;
}

export type CategoryFilter = ArticleCategory | 'all';
