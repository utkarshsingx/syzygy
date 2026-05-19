import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
};

export function Reveal({
  children,
  direction: _direction,
  delay: _delay,
  duration: _duration,
  ...rest
}: Props) {
  return <View {...rest}>{children}</View>;
}
