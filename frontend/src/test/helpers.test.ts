import { describe, it, expect } from 'vitest';
import { formatDate, formatDateShort, getCategoryColor, getCategoryLabel, slugify } from '../utils/helpers';

describe('formatDate', () => {
  it('formats ISO date string correctly', () => {
    const result = formatDate('2024-03-15T10:00:00Z');
    expect(result).toContain('marzo');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('formatDateShort', () => {
  it('formats date in short format', () => {
    const result = formatDateShort('2024-03-15T10:00:00Z');
    expect(result).toContain('mar');
    expect(result).toContain('15');
  });
});

describe('getCategoryColor', () => {
  it('returns correct color for arte-visual', () => {
    const result = getCategoryColor('arte-visual');
    expect(result).toBe('bg-[#C45C3E] text-white');
  });

  it('returns correct color for patrimonio', () => {
    const result = getCategoryColor('patrimonio');
    expect(result).toBe('bg-[#1D6B6B] text-white');
  });

  it('returns default color for unknown category', () => {
    const result = getCategoryColor('unknown');
    expect(result).toBe('bg-gray-700 text-white');
  });
});

describe('getCategoryLabel', () => {
  it('returns correct label for arte-visual', () => {
    expect(getCategoryLabel('arte-visual')).toBe('Arte visual');
  });

  it('returns correct label for gastronomia', () => {
    expect(getCategoryLabel('gastronomia')).toBe('Gastronomía');
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
