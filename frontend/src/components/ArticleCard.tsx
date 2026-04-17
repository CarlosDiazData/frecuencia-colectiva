import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { formatDateShort, getCategoryColor, getCategoryLabel } from '@/utils/helpers';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'compact';
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
        <Link to={`/article/${article.articleId}`} className="flex-shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-col justify-center">
          <span className={`category-tag ${getCategoryColor(article.category)} mb-2 w-fit`}>
            {getCategoryLabel(article.category)}
          </span>
          <Link to={`/article/${article.articleId}`}>
            <h3 className="font-serif font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {formatDateShort(article.date)} • {article.readTimeMinutes} min
          </p>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group py-3 border-b border-gray-100 last:border-b-0">
        <Link to={`/article/${article.articleId}`}>
          <h3 className="font-serif font-medium text-gray-900 group-hover:text-primary transition-colors text-sm leading-snug">
            {article.title}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1">
          {formatDateShort(article.date)}
        </p>
      </article>
    );
  }

  return (
    <article className="group">
      <Link to={`/article/${article.articleId}`} className="block">
        <div className="overflow-hidden mb-3">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <span className={`category-tag ${getCategoryColor(article.category)} mb-2 inline-block`}>
          {getCategoryLabel(article.category)}
        </span>
        <h3 className="font-serif font-bold text-lg md:text-xl text-gray-900 group-hover:text-primary transition-colors leading-snug mb-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
          <span className="font-medium">{article.author}</span>
          <span>•</span>
          <span>{formatDateShort(article.date)}</span>
        </div>
      </Link>
    </article>
  );
}
