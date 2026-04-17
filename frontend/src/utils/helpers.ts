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
    economy: 'bg-blue-700 text-white',
    sports: 'bg-green-700 text-white',
    politics: 'bg-red-700 text-white',
    culture: 'bg-amber-700 text-white',
  };
  return colors[category.toLowerCase()] || 'bg-gray-700 text-white';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    economy: 'Economía',
    sports: 'Deportes',
    politics: 'Política',
    culture: 'Cultura',
  };
  return labels[category.toLowerCase()] || category;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
