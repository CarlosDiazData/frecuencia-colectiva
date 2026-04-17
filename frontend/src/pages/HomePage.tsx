import { useArticles } from '@/hooks';
import { HeroArticle, ArticleCard } from '@/components';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { articles, loading, error } = useArticles();

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-[500px] bg-gray-200 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded" />
              ))}
            </div>
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
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white font-semibold rounded hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const [heroArticle, ...restArticles] = articles;
  const mainArticles = restArticles.slice(0, 4);
  const sideArticles = restArticles.slice(4, 7);
  const bottomArticles = restArticles.slice(7);

  return (
    <div className="min-h-screen">
      {heroArticle && <HeroArticle article={heroArticle} />}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-900">
            <h2 className="font-serif text-2xl font-bold text-gray-900">Top Stories</h2>
            <Link to="/section/world" className="text-primary font-semibold hover:underline text-sm">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {mainArticles.map(article => (
                <ArticleCard key={article.articleId} article={article} />
              ))}
            </div>
            
            <aside className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-serif font-bold text-lg mb-4 pb-2 border-b border-gray-200">
                  Latest News
                </h3>
                <div className="space-y-4">
                  {sideArticles.map(article => (
                    <ArticleCard 
                      key={article.articleId} 
                      article={article} 
                      variant="horizontal" 
                    />
                  ))}
                </div>
              </div>
              
              <div className="bg-primary text-white p-6 rounded-lg">
                <h3 className="font-serif font-bold text-lg mb-2">Subscribe</h3>
                <p className="text-white/90 text-sm mb-4">
                  Get breaking news and insightful analysis delivered to your inbox.
                </p>
                <button className="w-full py-2 bg-white text-primary font-semibold rounded hover:bg-gray-100 transition-colors text-sm">
                  Sign Up Free
                </button>
              </div>
            </aside>
          </div>
        </section>

        {bottomArticles.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-gray-900">
              <h2 className="font-serif text-2xl font-bold text-gray-900">More Stories</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {bottomArticles.map(article => (
                <ArticleCard key={article.articleId} article={article} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border-t-4 border-primary pt-6">
            <h3 className="font-serif text-xl font-bold mb-4">Technology</h3>
            <div className="space-y-3">
              {articles
                .filter(a => a.category === 'technology')
                .slice(0, 3)
                .map(article => (
                  <ArticleCard key={article.articleId} article={article} variant="compact" />
                ))}
            </div>
            <Link to="/section/technology" className="text-primary font-semibold text-sm hover:underline mt-4 inline-block">
              More Tech News →
            </Link>
          </div>
          
          <div className="border-t-4 border-green-600 pt-6">
            <h3 className="font-serif text-xl font-bold mb-4">Sports</h3>
            <div className="space-y-3">
              {articles
                .filter(a => a.category === 'sports')
                .slice(0, 3)
                .map(article => (
                  <ArticleCard key={article.articleId} article={article} variant="compact" />
                ))}
            </div>
            <Link to="/section/sports" className="text-primary font-semibold text-sm hover:underline mt-4 inline-block">
              More Sports News →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
