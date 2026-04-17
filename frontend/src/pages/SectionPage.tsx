import { useParams, Link } from 'react-router-dom';
import { useArticles } from '@/hooks';
import { ArticleCard } from '@/components';
import { ArticleCategory } from '@/types';
import { getCategoryLabel } from '@/utils/helpers';

const categoryDescriptions: Record<string, string> = {
  world: 'Comprehensive coverage of international affairs, global politics, and events shaping our world.',
  technology: 'The latest innovations, tech industry news, and digital transformation stories.',
  sports: 'Breaking sports news, game analysis, and athlete features from around the globe.',
  culture: 'Arts, entertainment, lifestyle, and the stories that define our cultural moment.',
};

export function SectionPage() {
  const { category } = useParams<{ category: string }>();
  const validCategories: ArticleCategory[] = ['world', 'technology', 'sports', 'culture'];
  const validCategory = validCategories.includes(category as ArticleCategory) 
    ? category as ArticleCategory 
    : 'world';
  
  const { articles, loading, error } = useArticles(validCategory);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Unable to Load Articles
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="text-primary font-semibold hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const displayCategory = category?.toLowerCase() || 'world';
  const description = categoryDescriptions[displayCategory] || categoryDescriptions.world;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-gray-900">{getCategoryLabel(displayCategory)}</span>
          </nav>
          <h1 className="font-serif text-4xl font-bold text-gray-900 mb-2">
            {getCategoryLabel(displayCategory)}
          </h1>
          <p className="text-gray-600 max-w-2xl">{description}</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
              No articles found
            </h2>
            <p className="text-gray-600 mb-6">
              There are no articles in this category yet.
            </p>
            <Link to="/" className="text-primary font-semibold hover:underline">
              Return to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.articleId} article={article} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
