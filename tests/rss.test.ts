import { describe, expect, it } from 'vitest';
import type { PostMeta } from '../src/lib/posts';
import { buildRssFeed, escapeXml } from '../src/lib/rss';
import { getSiteConfig } from '../src/lib/site';

const site = getSiteConfig({ NEXT_PUBLIC_SITE_URL: 'https://blog.exemplo.com/' });

const posts: PostMeta[] = [
  {
    slug: 'post-especial',
    title: 'Tom & Jerry < episodio > "final"',
    description: 'Descricao com & e <tags>',
    date: '2026-10-01',
    tags: ['testes & qualidade'],
    draft: false,
    readingTimeMinutes: 2,
  },
];

describe('escapeXml', () => {
  it('escapa os cinco caracteres reservados', () => {
    expect(escapeXml(`a & b <c> "d" 'e'`)).toBe('a &amp; b &lt;c&gt; &quot;d&quot; &apos;e&apos;');
  });
});

describe('buildRssFeed', () => {
  const feed = buildRssFeed(site, posts);

  it('gera RSS 2.0 com canal e item', () => {
    expect(feed).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(feed).toContain('<rss version="2.0">');
    expect(feed).toContain('<channel>');
    expect(feed).toContain('<item>');
  });

  it('usa a URL do site sem barra final duplicada', () => {
    expect(feed).toContain('<link>https://blog.exemplo.com/posts/post-especial</link>');
    expect(site.url).toBe('https://blog.exemplo.com');
  });

  it('escapa caracteres especiais em titulo, descricao e tags', () => {
    expect(feed).toContain('Tom &amp; Jerry &lt; episodio &gt; &quot;final&quot;');
    expect(feed).toContain('Descricao com &amp; e &lt;tags&gt;');
    expect(feed).toContain('<category>testes &amp; qualidade</category>');
  });

  it('formata a data em RFC 822', () => {
    expect(feed).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d{2}:\d{2}:\d{2} GMT<\/pubDate>/);
  });

  it('gera feed sem itens quando nao ha posts', () => {
    const empty = buildRssFeed(site, []);
    expect(empty).toContain('<channel>');
    expect(empty).not.toContain('<item>');
  });
});
