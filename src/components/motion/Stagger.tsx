import { type ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  children: ReactNode;
  stagger?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
};

export function Stagger({
  children,
  stagger: _stagger,
  initialDelay: _initialDelay,
  direction: _direction,
  ...rest
}: Props) {
  return <View {...rest}>{children}</View>;
}
