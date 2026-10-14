import type { ReactNode } from 'react';

const LABELS = {
  info: 'Nota',
  warning: 'Atencao',
  danger: 'Perigo',
} as const;

interface CalloutProps {
  type?: keyof typeof LABELS;
  children: ReactNode;
}

/** Bloco de destaque usavel dentro de qualquer post MDX. */
export function Callout({ type = 'info', children }: CalloutProps) {
  return (
    <aside className={`callout callout--${type}`} role={type === 'info' ? 'note' : 'alert'}>
      <strong className="callout__label">{LABELS[type]}</strong>
      <div className="callout__body">{children}</div>
    </aside>
  );
}
