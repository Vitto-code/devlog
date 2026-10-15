import { getPublishedPosts } from '@/lib/content';
import { buildRssFeed } from '@/lib/rss';
import { getSiteConfig } from '@/lib/site';

// Gerado estaticamente no build: o feed nao depende de servidor em runtime.
export const dynamic = 'force-static';

export function GET() {
  const feed = buildRssFeed(getSiteConfig(), getPublishedPosts());
  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
