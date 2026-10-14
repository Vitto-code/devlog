import type { AnchorHTMLAttributes, ComponentType } from 'react';
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
export const mdxComponents: Record<string, ComponentType<never>> = {
  Callout: Callout as ComponentType<never>,
  a: ExternalSafeLink as ComponentType<never>,
};
