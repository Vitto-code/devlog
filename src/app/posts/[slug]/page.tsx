import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { mdxComponents } from '@/components/mdx-components';
import { getPublishedPost, getPublishedPosts } from '@/lib/content';
import { getSiteConfig } from '@/lib/site';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

const site = getSiteConfig();

const dateFormatter = new Intl.DateTimeFormat(site.locale, {
  dateStyle: 'long',
  timeZone: 'UTC',
});

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) {
    return {};
  }
  const url = `${site.url}/posts/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPublishedPost(slug);
  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Person', name: site.author },
    url: `${site.url}/posts/${post.slug}`,
    keywords: post.tags.join(', '),
  };

  return (
    <article className="post">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="post__header">
        <h1>{post.title}</h1>
        <p className="post__meta">
          <time dateTime={post.date}>{dateFormatter.format(new Date(`${post.date}T12:00:00Z`))}</time>
          {' · '}
          {post.readingTimeMinutes} min de leitura
        </p>
        {post.tags.length > 0 && (
          <ul className="tag-list" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag}>
                <a className="tag" href={`/tags/${tag}`}>
                  {tag}
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="prose">
        <MDXRemote
          source={post.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
        />
      </div>
    </article>
  );
}
