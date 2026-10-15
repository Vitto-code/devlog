import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/content';
import { getAllTags } from '@/lib/posts';
import { getSiteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const posts = getPublishedPosts();

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/posts/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tagEntries: MetadataRoute.Sitemap = getAllTags(posts).map(({ tag }) => ({
    url: `${site.url}/tags/${encodeURIComponent(tag)}`,
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [
    { url: site.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${site.url}/busca`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/sobre`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${site.url}/tags`, changeFrequency: 'weekly', priority: 0.5 },
    ...postEntries,
    ...tagEntries,
  ];
}
