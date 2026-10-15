import type { MDXComponents } from 'mdx/types';
import type { AnchorHTMLAttributes } from 'react';
import { Callout } from './Callout';

function ExternalSafeLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = props.href?.startsWith('http') === true;
  return (
    <a
      {...props}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    />
  );
}

/**
 * Componentes disponiveis para todos os posts MDX.
 * Links externos ganham target/rel seguros automaticamente.
 */
export const mdxComponents: MDXComponents = {
  Callout,
  a: ExternalSafeLink,
};
