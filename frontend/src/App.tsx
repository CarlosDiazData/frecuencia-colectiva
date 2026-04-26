import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SearchProvider } from '@/context/SearchContext';
import { Navbar, Footer, ScrollToTop } from '@/components';
import { HomePage, SectionPage, ArticlePage, NosotrosPage, DirectorioPage, ContactPage, AnunciatePage, AvisoPrivacidadPage } from '@/pages';

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/section/:category" element={<SectionPage />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/directorio" element={<DirectorioPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/anunciate" element={<AnunciatePage />} />
              <Route path="/aviso-privacidad" element={<AvisoPrivacidadPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </BrowserRouter>
  );
}
