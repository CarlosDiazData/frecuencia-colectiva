import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { getCategoryLabel } from '../utils/helpers';

const CULTURAL_SLUGS = [
  'arte-visual',
  'arte-escenico',
  'cine-y-audiovisual',
  'festividades-locales',
  'historias-familiares',
  'gastronomia',
  'patrimonio',
  'identidad',
  'agenda-cultural',
];

const OBSOLETE_LABELS = ['Política', 'Economía', 'Cultura', 'Deportes'];
const OBSOLETE_PATHS = [
  '/section/politics',
  '/section/economy',
  '/section/culture',
  '/section/sports',
];

describe('Footer', () => {
  const renderFooter = () =>
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

  describe('cultural category links', () => {
    it('renders all 9 cultural category links with correct labels', () => {
      renderFooter();

      for (const slug of CULTURAL_SLUGS) {
        const label = getCategoryLabel(slug);
        expect(screen.getByText(label)).toBeInTheDocument();
      }
    });

    it('renders all 9 section links with correct hrefs', () => {
      renderFooter();

      for (const slug of CULTURAL_SLUGS) {
        const label = getCategoryLabel(slug);
        const link = screen.getByText(label).closest('a');
        expect(link).toHaveAttribute('href', `/section/${slug}`);
      }
    });
  });

  describe('obsolete categories absent', () => {
    it('does not render obsolete category labels', () => {
      renderFooter();

      for (const label of OBSOLETE_LABELS) {
        expect(screen.queryByText(label)).not.toBeInTheDocument();
      }
    });

    it('does not render old English path segments', () => {
      renderFooter();

      const links = screen.getAllByRole('link');
      const hrefs = links.map(link => link.getAttribute('href'));

      for (const path of OBSOLETE_PATHS) {
        expect(hrefs).not.toContain(path);
      }
    });
  });
});
