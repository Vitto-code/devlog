import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/PostCard';
import { getPublishedPosts } from '@/lib/content';

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export function generateStaticParams() {
  const tags = new Set(getPublishedPosts().flatMap((post) => post.tags));
  return [...tags].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `Posts sobre ${tag}`,
    description: `Todos os posts marcados com ${tag}.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPublishedPosts().filter((post) => post.tags.includes(decoded));

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="stack">
      <h1>Posts sobre {decoded}</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}
