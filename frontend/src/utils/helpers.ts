export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    technology: 'bg-blue-600 text-white',
    sports: 'bg-green-600 text-white',
    world: 'bg-purple-600 text-white',
    culture: 'bg-amber-600 text-white',
  };
  return colors[category.toLowerCase()] || 'bg-gray-600 text-white';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technology: 'Tech',
    sports: 'Sports',
    world: 'World',
    culture: 'Culture',
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
