import { useParams, Link } from 'react-router-dom';
import { ArticleDetail, RelatedArticles } from '@/components';
import { useArticles } from '@/hooks';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { articles } = useArticles();

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            Article Not Found
          </h2>
          <Link to="/" className="text-primary font-semibold hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ArticleDetail articleId={id} />
      <RelatedArticles articles={articles} currentId={id} />
    </div>
  );
}
