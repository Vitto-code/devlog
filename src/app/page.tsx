import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import { getPublishedPosts } from '@/lib/content';
import { getAllTags } from '@/lib/posts';

export default function HomePage() {
  const posts = getPublishedPosts();
  const tags = getAllTags(posts);

  return (
    <div className="stack">
      <section className="hero">
        <h1>Engenharia de software, sem atalhos</h1>
        <p>
          Posts tecnicos sobre front-end, backend e qualidade — escritos em MDX,
          gerados estaticamente e versionados junto com o codigo.
        </p>
      </section>

      <section aria-labelledby="posts-recentes">
        <h2 id="posts-recentes">Posts recentes</h2>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tags-populares">
        <h2 id="tags-populares">Tags</h2>
        <ul className="tag-list">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link className="tag" href={`/tags/${tag}`}>
                {tag} ({count})
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
