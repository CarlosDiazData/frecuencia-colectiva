import { useParams, Link } from 'react-router-dom';
import { useArticles } from '@/hooks';
import { ArticleCard } from '@/components';
import { ArticleCategory } from '@/types';
import { getCategoryLabel } from '@/utils/helpers';

const categoryDescriptions: Record<string, string> = {
  'arte-visual': 'Pintura, escultura, fotografía y artes visuales de Toluca y el Estado de México.',
  'arte-escenico': 'Teatro, danza, música y Actuación artísticas de la región.',
  'cine-y-audiovisual': 'Cine, documental, videoarte y producción audiovisual toluqueña.',
  'festividades-locales': 'Celebraciones, tradiciones, fiestas patronales y eventos comunitarios.',
  'historias-familiares': 'Relatos de familias y comunidades del Valle de Toluca.',
  'gastronomia': 'Cocina tradicional, recetas regionales y gastronomía del Estado de México.',
  'patrimonio': 'Historia, arquitectura, sitios patrimoniales y herencia cultural.',
  'identidad': 'Cultura, tradiciones, costumbres y identidad toluqueña.',
  'agenda-cultural': 'Eventos culturales, exposiciones, conciertos y actividades digitales.',
};

export function SectionPage() {
  const { category } = useParams<{ category: string }>();
  const validCategories: ArticleCategory[] = ['arte-visual', 'arte-escenico', 'cine-y-audiovisual', 'festividades-locales', 'historias-familiares', 'gastronomia', 'patrimonio', 'identidad', 'agenda-cultural'];
  const validCategory = validCategories.includes(category as ArticleCategory)
    ? category as ArticleCategory
    : 'arte-visual';
  
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

  const displayCategory = category?.toLowerCase() || 'arte-visual';
  const description = categoryDescriptions[displayCategory] || categoryDescriptions['arte-visual'];

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
