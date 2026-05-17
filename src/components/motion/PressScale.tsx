import { type ReactNode, useMemo } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { springs } from '@/theme/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'children'> & {
  children: ReactNode;
  pressedScale?: number;
  haptic?: 'light' | 'medium' | 'selection' | 'none';
};

// Replaces the web's <Magnetic> wrapper. Touch devices have no cursor, so we
// signal interactivity via a subtle press scale + haptic instead.
export function PressScale({
  children,
  pressedScale = 0.96,
  haptic = 'selection',
  onPressIn,
  onPressOut,
  onPress,
  style,
  ...rest
}: Props) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const fireHaptic = useMemo(() => {
    if (haptic === 'none') return () => {};
    if (haptic === 'light') return () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (haptic === 'medium') return () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return () => Haptics.selectionAsync();
  }, [haptic]);

  return (
    <AnimatedPressable
      style={[animStyle, style]}
      onPressIn={(e) => {
        if (!reduced) scale.value = withSpring(pressedScale, springs.press);
        fireHaptic();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        if (!reduced) scale.value = withSpring(1, springs.press);
        onPressOut?.(e);
      }}
      onPress={onPress}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
