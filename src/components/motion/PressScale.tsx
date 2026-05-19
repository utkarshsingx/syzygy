import { type ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';

type Props = Omit<PressableProps, 'children'> & {
  children: ReactNode;
  pressedScale?: number;
  haptic?: 'light' | 'medium' | 'selection' | 'none';
};

export function PressScale({
  children,
  pressedScale: _pressedScale,
  haptic: _haptic,
  ...rest
}: Props) {
  return <Pressable {...rest}>{children}</Pressable>;
}
