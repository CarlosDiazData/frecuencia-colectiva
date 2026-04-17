import { useArticle } from '@/hooks';
import { Link } from 'react-router-dom';
import { formatDate, getCategoryColor, getCategoryLabel } from '@/utils/helpers';

interface ArticleDetailProps {
  articleId: string;
}

export function ArticleDetail({ articleId }: ArticleDetailProps) {
  const { article, loading, error } = useArticle(articleId);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-12 w-full bg-gray-200 rounded" />
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-96 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
          Article Not Found
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/" className="text-primary font-semibold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!article) return null;

  const paragraphs = article.body.split('\n\n');

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link 
          to={`/section/${article.category}`}
          className={`category-tag ${getCategoryColor(article.category)} mb-4 inline-block`}
        >
          {getCategoryLabel(article.category)}
        </Link>
        
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-6">
          {article.summary}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-gray-600">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{article.author}</p>
              <p className="text-xs">{formatDate(article.date)}</p>
            </div>
          </div>
          <span className="ml-auto flex items-center gap-1 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {article.readTimeMinutes} min read
          </span>
        </div>
      </header>

      <figure className="mb-10">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-auto"
        />
      </figure>

      <div className="prose prose-lg max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-gray-800 leading-relaxed mb-6 font-serif text-lg">
            {paragraph}
          </p>
        ))}
      </div>

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Written by {article.author}</p>
              <p className="text-sm text-gray-500">Staff Writer</p>
            </div>
          </div>
          <Link 
            to={`/section/${article.category}`}
            className="text-primary font-semibold hover:underline"
          >
            More from {getCategoryLabel(article.category)} →
          </Link>
        </div>
      </footer>
    </article>
  );
}
