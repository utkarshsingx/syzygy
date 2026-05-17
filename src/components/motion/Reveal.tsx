import { type ReactNode } from 'react';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { durations } from '@/theme/motion';
import type { ViewProps } from 'react-native';

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade';

type Props = ViewProps & {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
};

const entering = {
  up: FadeInUp,
  down: FadeInDown,
  left: FadeInLeft,
  right: FadeInRight,
  fade: FadeIn,
};

export function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = durations.reveal,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <Animated.View {...rest}>{children}</Animated.View>;
  }
  return (
    <Animated.View
      entering={entering[direction].delay(delay).duration(duration)}
      {...rest}
    >
      {children}
    </Animated.View>
  );
}
