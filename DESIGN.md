# Design System: Frecuencia Colectiva

**Project ID:** N/A (React + AWS CDK project)

## 1. Visual Theme & Atmosphere

A cultural, journalistic, and contemporary interface that communicates seriousness and clarity while remaining local, modern, and visually distinctive. The aesthetic draws from editorial newspaper design with an emphasis on readability, strong hierarchy, and restrained elegance.

- **Density**: Airy, content-focused with generous whitespace
- **Character**: Serious yet accessible, professional without being cold
- **Mood**: Trustworthy, clean, culturally rooted

## 2. Color Palette & Roles

| Role | Color Name | Hex Code | Usage |
|------|-----------|----------|-------|
| Primary | **Editorial Red** | `#c50907` | Accent for links, tags, highlights, navigation accents, calls to action |
| Background | **Pure White** | `#ffffff` | Main reading surfaces, page backgrounds |
| Primary Text | **Ink Black** | `#000000` | Headlines, body copy,primary content |

**Usage Guidelines:**
- Red (#c50907) should be used sparingly as an accent color
- Avoid using red as a dominant background for large reading surfaces
- White background keeps content readable and professional

## 3. Typography Rules

- **Headlines**: Merriweather (serif) - Strong editorial hierarchy with classic newspaper feel
- **Body Text**: Merriweather Sans or clean sans-serif - Highly readable for extended reading
- **Style Goal**: Clear editorial hierarchy balancing headlines and body copy
- **Letter-Spacing**: Natural, comfortable reading spacing

## 4. Component Stylings

### Buttons
- **Shape**: Subtle rounding for primary actions, avoiding overly rounded "toy-like" appearance
- **Color**: Red accent (#c50907) for primary CTAs, white with red border for secondary
- **Behavior**: Clear hover states, no decorative animations

### Cards/Containers
- **Corner Roundness**: Subtly rounded (small radius) or sharp, squared-off edges for editorial feel
- **Background**: White on light gray or white backgrounds
- **Shadow Depth**: Minimal or flat - avoid heavy drop shadows for cleaner newspaper aesthetic

### Inputs/Forms
- **Stroke Style**: Thin, defined borders (not heavy)
- **Background**: White with subtle borders
- **Focus States**: Red accent (#c50907) for focus rings

## 5. Layout Principles

- **Grid System**: Responsive editorial grid inspired by newspaper composition
- **Whitespace**: Generous margins and padding, allowing content to breathe
- **Visual Hierarchy**: Strong asymmetric content balance - larger featured elements, smaller supporting content
- **Alignment**: Clear vertical rhythm, newspaper-style column layouts on desktop, stacked on mobile
- **Content Balance**: Mix of full-width hero elements with asymmetric 2-3 column grids

### Design Intent

The interface should feel:
- **Cultural**: Rooted in local Toluca identity
- **Journalistic**: Serious, clarity-focused, information-first
- **Contemporary**: Modern without trendy or overly decorative
- **Distinctive**: Unique to Frecuencia Colectiva's brand

### Anti-Patterns to Avoid

- ❌ Large red background areas
- ❌ Heavy drop shadows or glass-morphism effects
- ❌ Overly rounded or playful button shapes
- ❌ Decorative patterns or illustrations that compete with content
- ❌ Dense, information-overloaded layouts