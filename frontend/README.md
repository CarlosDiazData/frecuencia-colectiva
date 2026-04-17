# News Website - Frontend

This directory contains the React frontend for Frecuencia Colectiva news website.

## Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── HeroArticle.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleDetail.tsx
│   │   ├── Footer.tsx
│   │   └── RelatedArticles.tsx
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx
│   │   ├── SectionPage.tsx
│   │   └── ArticlePage.tsx
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context providers
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   └── test/             # Unit tests
├── public/               # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

```bash
npm test
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
VITE_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
```

## Design

The frontend for Frecuencia Colectiva is based on an editorial newspaper-style aesthetic aligned with the project's cultural and journalistic identity.

### Visual system

- **Primary color**: `#c50907`
- **Background**: `#ffffff`
- **Primary text**: `#000000`

### Typography

- **Headlines**: Merriweather (serif)
- **Body text**: Merriweather Sans or another clean sans-serif
- **Style goal**: Strong editorial hierarchy with highly readable body copy

### Layout principles

- Use a responsive editorial grid inspired by newspaper composition.
- Prioritize strong visual hierarchy, asymmetric content balance, and clean spacing.
- Keep the interface visually restrained and avoid overly decorative UI patterns.

### Color usage

- Red (`#c50907`) should be used sparingly as an accent color.
- Use it for links, tags, highlights, navigation accents, and calls to action.
- Avoid using red as a dominant background for large reading surfaces.

### Design intent

The interface should feel cultural, journalistic, and contemporary. It should communicate seriousness and clarity while still feeling local, modern, and visually distinctive.