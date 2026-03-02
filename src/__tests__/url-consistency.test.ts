import { describe, it, expect } from 'vitest';
import { SITE_URL } from '@/data/constants';

describe('URL Consistency', () => {
  it('should have consistent canonical URL across all components', () => {
    const canonicalUrl = SITE_URL;
    const expectedUrl = 'https://the-barber-cave.vercel.app';
    
    expect(canonicalUrl).toBe(expectedUrl);
  });

  it('should use HTTPS protocol', () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it('should not have trailing slash', () => {
    expect(SITE_URL).not.toMatch(/\/$/);
  });

  it('should be a valid URL format', () => {
    expect(() => new URL(SITE_URL)).not.toThrow();
  });
});
