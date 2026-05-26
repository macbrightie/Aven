import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export function Card({
  variant = 'default',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-border bg-card text-card-foreground p-6',
        variant === 'elevated' ? 'shadow-lg' : 'shadow-sm',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
