import { Link } from 'react-router-dom';
import { Article } from '@/types';
import { formatDate, getCategoryColor, getCategoryLabel } from '@/utils/helpers';

interface HeroArticleProps {
  article: Article;
}

export function HeroArticle({ article }: HeroArticleProps) {
  return (
    <article className="relative group cursor-pointer">
      <Link to={`/article/${article.articleId}`}>
        <div className="relative overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-[500px] md:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <span className={`category-tag ${getCategoryColor(article.category)} mb-4 inline-block`}>
              {getCategoryLabel(article.category)}
            </span>
            
            <h1 className="text-white font-serif text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl leading-relaxed mb-4 max-w-3xl">
              {article.summary}
            </p>
            
            <div className="flex items-center gap-4 text-white/70 text-sm">
              <span className="font-medium">{article.author}</span>
              <span>•</span>
              <span>{formatDate(article.date)}</span>
              <span>•</span>
              <span>{article.readTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
