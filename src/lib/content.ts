import { join } from 'node:path';
import { getPost, getPosts, type Post } from './posts';

/** Diretorio dos posts, resolvido a partir da raiz do projeto. */
export const POSTS_DIR = join(process.cwd(), 'content', 'posts');

/** Atalho usado pelas paginas: posts publicados, mais recentes primeiro. */
export function getPublishedPosts(): Post[] {
  return getPosts(POSTS_DIR);
}

export function getPublishedPost(slug: string): Post | null {
  return getPost(slug, POSTS_DIR);
}
