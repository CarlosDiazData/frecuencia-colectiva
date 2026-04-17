import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { formatDateShort } from '@/utils/helpers';

interface RelatedArticlesProps {
  articles: Article[];
  currentId: string;
}

export function RelatedArticles({ articles, currentId }: RelatedArticlesProps) {
  const related = articles
    .filter(a => a.articleId !== currentId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">
        More Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {related.map(article => (
          <article key={article.articleId} className="group">
            <Link to={`/article/${article.articleId}`} className="block">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-32 object-cover mb-3 transition-transform duration-300 group-hover:scale-105"
              />
              <h3 className="font-serif font-semibold text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                {formatDateShort(article.date)}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
