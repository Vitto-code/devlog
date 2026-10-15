import { describe, expect, it } from 'vitest';
import { getSiteConfig } from '../src/lib/site';

describe('getSiteConfig', () => {
  it('usa localhost como URL padrao', () => {
    const config = getSiteConfig({});
    expect(config.url).toBe('http://localhost:3000');
  });

  it('remove barra final da URL configurada', () => {
    const config = getSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://meu.blog/' });
    expect(config.url).toBe('https://meu.blog');
  });
});
