import { useState, useEffect, useCallback } from 'react';
import { Article } from '@/types';
import { getArticle as fetchArticle } from '@/utils/api';

interface UseArticleResult {
  article: Article | null;
  loading: boolean;
  error: string | null;
}

export function useArticle(id: string): UseArticleResult {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticleById = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchArticle(id);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchArticleById();
    }
  }, [id, fetchArticleById]);

  return { article, loading, error };
}
