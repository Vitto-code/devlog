import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/content';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'Todos os assuntos do blog.',
};

export default function TagsPage() {
  const tags = getAllTags(getPublishedPosts());

  return (
    <div className="stack">
      <h1>Tags</h1>
      <ul className="tag-list">
        {tags.map(({ tag, count }) => (
          <li key={tag}>
            <Link className="tag" href={`/tags/${tag}`}>
              {tag} ({count})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
