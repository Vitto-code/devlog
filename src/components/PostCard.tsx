import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';
import { getSiteConfig } from '@/lib/site';

const site = getSiteConfig();

const dateFormatter = new Intl.DateTimeFormat(site.locale, {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="post-card">
      <h3>
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="post-card__description">{post.description}</p>
      <p className="post-card__meta">
        <time dateTime={post.date}>{dateFormatter.format(new Date(`${post.date}T12:00:00Z`))}</time>
        {' · '}
        {post.readingTimeMinutes} min
      </p>
    </article>
  );
}
