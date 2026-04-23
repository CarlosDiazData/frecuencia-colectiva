export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    month: 'short',
    day: 'numeric',
  });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'arte-visual': 'bg-[#C45C3E] text-white',
    'arte-escenico': 'bg-[#8B4513] text-white',
    'cine-y-audiovisual': 'bg-[#D4A017] text-white',
    'festividades-locales': 'bg-[#9B2335] text-white',
    'historias-familiares': 'bg-[#A85C6B] text-white',
    gastronomia: 'bg-[#E07B39] text-white',
    patrimonio: 'bg-[#1D6B6B] text-white',
    identidad: 'bg-[#2E8B6E] text-white',
    'agenda-cultural': 'bg-[#6B3FA0] text-white',
  };
  return colors[category.toLowerCase()] || 'bg-gray-700 text-white';
}

export function getCategoryHex(category: string): string {
  const colors: Record<string, string> = {
    'arte-visual': '#C45C3E',
    'arte-escenico': '#8B4513',
    'cine-y-audiovisual': '#D4A017',
    'festividades-locales': '#9B2335',
    'historias-familiares': '#A85C6B',
    gastronomia: '#E07B39',
    patrimonio: '#1D6B6B',
    identidad: '#2E8B6E',
    'agenda-cultural': '#6B3FA0',
  };
  return colors[category.toLowerCase()] || '#6B7280';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'arte-visual': 'Arte visual',
    'arte-escenico': 'Arte escénico',
    'cine-y-audiovisual': 'Cine y audiovisual',
    'festividades-locales': 'Festividades locales',
    'historias-familiares': 'Historias familiares',
    gastronomia: 'Gastronomía',
    patrimonio: 'Patrimonio',
    identidad: 'Identidad',
    'agenda-cultural': 'Agenda cultural digital',
  };
  return labels[category.toLowerCase()] || category;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}
