import { describe, it, expect } from 'vitest';
import { formatDate, formatDateShort, getCategoryColor, getCategoryLabel, slugify } from '../utils/helpers';

describe('formatDate', () => {
  it('formats ISO date string correctly', () => {
    const result = formatDate('2024-03-15T10:00:00Z');
    expect(result).toContain('March');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('formatDateShort', () => {
  it('formats date in short format', () => {
    const result = formatDateShort('2024-03-15T10:00:00Z');
    expect(result).toContain('Mar');
    expect(result).toContain('15');
  });
});

describe('getCategoryColor', () => {
  it('returns correct color for technology', () => {
    const result = getCategoryColor('technology');
    expect(result).toBe('bg-blue-600 text-white');
  });

  it('returns correct color for sports', () => {
    const result = getCategoryColor('sports');
    expect(result).toBe('bg-green-600 text-white');
  });

  it('returns default color for unknown category', () => {
    const result = getCategoryColor('unknown');
    expect(result).toBe('bg-gray-600 text-white');
  });
});

describe('getCategoryLabel', () => {
  it('returns correct label for technology', () => {
    expect(getCategoryLabel('technology')).toBe('Tech');
  });

  it('returns correct label for world', () => {
    expect(getCategoryLabel('world')).toBe('World');
  });

  it('returns original text for unknown category', () => {
    expect(getCategoryLabel('unknown')).toBe('unknown');
  });
});

describe('slugify', () => {
  it('converts text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('handles special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('trims whitespace', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world');
  });
});
