import { Children, type ReactElement, type ReactNode, cloneElement, isValidElement } from 'react';
import { View, type ViewProps } from 'react-native';
import { Reveal } from './Reveal';

type Props = ViewProps & {
  children: ReactNode;
  stagger?: number;
  initialDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
};

// Wraps each direct child in a Reveal with an incremental delay.
// Equivalent to the web's `staggerChildren` prop on framer-motion containers.
export function Stagger({
  children,
  stagger = 80,
  initialDelay = 0,
  direction = 'up',
  ...rest
}: Props) {
  return (
    <View {...rest}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        return (
          <Reveal
            key={(child as ReactElement).key ?? i}
            delay={initialDelay + i * stagger}
            direction={direction}
          >
            {cloneElement(child as ReactElement)}
          </Reveal>
        );
      })}
    </View>
  );
}
