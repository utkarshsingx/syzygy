import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Grain } from './Grain';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors } from '@/theme/colors';

type Props = {
  intensity?: 'subtle' | 'medium' | 'rich';
};

// Port of the web Atmosphere: cream wash + drifting terracotta orb + grain.
// All sits behind app content (pointerEvents=none) so it never intercepts touches.
export function Atmosphere({ intensity = 'medium' }: Props) {
  const reduced = useReducedMotion();
  const orbY = useSharedValue(0);
  const orbX = useSharedValue(0);
  const auroraShift = useSharedValue(0);

  useEffect(() => {
    if (reduced) {
      orbY.value = 0;
      orbX.value = 0;
      auroraShift.value = 0;
      return;
    }
    orbY.value = withRepeat(
      withTiming(1, { duration: 42_000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
    orbX.value = withRepeat(
      withTiming(1, { duration: 53_000, easing: Easing.inOut(Easing.cubic) }),
      -1,
      true,
    );
    auroraShift.value = withRepeat(
      withTiming(1, { duration: 28_000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [reduced, orbX, orbY, auroraShift]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: -120 + orbX.value * 240 },
      { translateY: -60 + orbY.value * 120 },
      { scale: 1 + auroraShift.value * 0.15 },
    ],
    opacity: 0.55 + auroraShift.value * 0.15,
  }));

  const auroraStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -40 + auroraShift.value * 80 }],
    opacity: intensity === 'rich' ? 0.85 : intensity === 'medium' ? 0.6 : 0.35,
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
      {/* Base cream wash */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.cream }]} />

      {/* Aurora — diagonal gradient with subtle vertical drift */}
      <Animated.View style={[StyleSheet.absoluteFillObject, auroraStyle]}>
        <LinearGradient
          colors={[colors.roseDust + '00', colors.roseDust + '33', colors.terracotta + '22']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      {/* Drifting orb */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: '20%',
            left: '50%',
            width: 480,
            height: 480,
            marginLeft: -240,
            borderRadius: 240,
            backgroundColor: colors.terracotta,
            opacity: 0.18,
          },
          orbStyle,
        ]}
      />

      {/* Sage drift below */}
      <View
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: 360,
          height: 360,
          borderRadius: 180,
          backgroundColor: colors.sage,
          opacity: 0.12,
        }}
      />

      {/* Paper grain on top */}
      <Grain opacity={0.035} />
    </View>
  );
}
