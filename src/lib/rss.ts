import type { PostMeta } from './posts';
import type { SiteConfig } from './site';

/** Escapa os cinco caracteres reservados do XML. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toRfc822(date: string): string {
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

/** Gera um feed RSS 2.0 completo a partir dos posts publicados. */
export function buildRssFeed(site: SiteConfig, posts: PostMeta[]): string {
  const items = posts
    .map((post) => {
      const link = `${site.url}/posts/${post.slug}`;
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${toRfc822(post.date)}</pubDate>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(site.title)}</title>`,
    `    <link>${escapeXml(site.url)}</link>`,
    `    <description>${escapeXml(site.description)}</description>`,
    `    <language>${site.locale}</language>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
