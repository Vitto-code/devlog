import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPosts } from '../src/lib/posts';
import { buildIndex, type SearchDoc } from '../src/lib/search';

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUTPUT = join(PROJECT_ROOT, 'public', 'search-index.json');

/** Remove marca MDX/HTML para indexar apenas o texto legivel. */
export function stripMdx(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, ' ') // blocos de codigo
    .replace(/`[^`]*`/g, ' ') // codigo inline
    .replace(/<[^>]+>/g, ' ') // JSX/HTML
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links: mantem o texto
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const posts = getPosts(join(PROJECT_ROOT, 'content', 'posts'));
const docs: SearchDoc[] = posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  description: post.description,
  tags: post.tags,
  text: stripMdx(post.content),
}));

const index = buildIndex(docs);
mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(index));

console.log(`[search-index] ${docs.length} posts indexados, ${Object.keys(index.postings).length} termos -> ${OUTPUT}`);
