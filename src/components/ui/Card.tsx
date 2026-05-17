import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '@/lib/cn';

type Props = ViewProps & {
  children: ReactNode;
  tone?: 'paper' | 'cream' | 'tinted';
  padded?: boolean;
};

export function Card({
  children,
  tone = 'paper',
  padded = true,
  className,
  ...rest
}: Props) {
  return (
    <View
      className={cn(
        'rounded-petal border border-ink-50/10',
        tone === 'paper' && 'bg-paper/60',
        tone === 'cream' && 'bg-cream',
        tone === 'tinted' && 'bg-terracotta-50/60',
        padded && 'p-5',
        className,
      )}
      {...rest}
    >
      {children}
    </View>
  );
}
