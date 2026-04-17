import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from '@/context/SearchContext';
import { Navbar, Footer } from '@/components';
import { HomePage, SectionPage, ArticlePage } from '@/pages';

export function App() {
  return (
    <BrowserRouter>
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/section/:category" element={<SectionPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </BrowserRouter>
  );
}
