import { useParams, Link } from 'react-router-dom';
import { useArticles } from '@/hooks';
import { ArticleCard } from '@/components';
import { ArticleCategory } from '@/types';
import { getCategoryLabel } from '@/utils/helpers';

const categoryDescriptions: Record<string, string> = {
  politics: 'Cobertura completa de la política local, estatal y nacional.',
  economy: 'Las últimas noticias económicas, negocios y finanzas del Estado de México.',
  sports: 'Noticias de deportes locales, análisis de partidos y entrevistas.',
  culture: 'Arte, entretenimiento, eventos culturales y música de la región.',
};

export function SectionPage() {
  const { category } = useParams<{ category: string }>();
  const validCategories: ArticleCategory[] = ['politics', 'economy', 'sports', 'culture'];
  const validCategory = validCategories.includes(category as ArticleCategory) 
    ? category as ArticleCategory 
    : 'politics';
  
  const { articles, loading, error } = useArticles(validCategory);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-10 w-48 bg-gray-200 animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 mt-2 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse" />
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
            No se pudieron cargar los artículos
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="text-primary font-bold hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const displayCategory = category?.toLowerCase() || 'politics';
  const description = categoryDescriptions[displayCategory] || categoryDescriptions.politics;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-primary">Inicio</Link>
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
              No se encontraron artículos
            </h2>
            <p className="text-gray-600 mb-6">
              No hay artículos en esta sección todavía.
            </p>
            <Link to="/" className="text-primary font-bold hover:underline">
              Volver al inicio
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
