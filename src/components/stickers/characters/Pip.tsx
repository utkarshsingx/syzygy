import { View } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import type { StickerCharacterProps } from '../types';

// Pip — the period sprite. A soft, rounded little blob.
export function Pip({ size, params, tint = colors.terracotta }: StickerCharacterProps) {
  const { mouthOpen, bodyBob, headTilt, eyeBlink, glow, scale } = params;

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bodyBob.value * size * 0.04 },
      { rotate: `${headTilt.value * 6}deg` },
      { scale: scale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + glow.value * 0.35,
    transform: [{ scale: 1 + glow.value * 0.18 }],
  }));

  const leftLidStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeBlink.value }],
  }));
  const rightLidStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeBlink.value }],
  }));

  const mouthStyle = useAnimatedStyle(() => ({
    height: interpolate(mouthOpen.value, [0, 1], [size * 0.04, size * 0.18]),
    width: interpolate(mouthOpen.value, [0, 1], [size * 0.22, size * 0.28]),
    borderRadius: size * 0.12,
  }));

  const cheekOpacity = useAnimatedStyle(() => ({
    opacity: 0.45 + glow.value * 0.3,
  }));

  const eye = size * 0.085;
  const eyeOffsetX = size * 0.18;
  const eyeOffsetY = size * 0.05;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: tint,
          },
          glowStyle,
        ]}
      />
      <Animated.View style={[{ width: size * 0.78, height: size * 0.78, alignItems: 'center', justifyContent: 'center' }, bodyStyle]}>
        <View
          style={{
            position: 'absolute',
            width: size * 0.78,
            height: size * 0.78,
            borderRadius: size * 0.42,
            backgroundColor: tint,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: size * 0.06,
            width: size * 0.5,
            height: size * 0.22,
            borderRadius: size * 0.12,
            backgroundColor: colors.cream,
            opacity: 0.35,
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: size * 0.39 - eyeOffsetX - eye / 2,
            top: size * 0.39 - eyeOffsetY - eye / 2,
            width: eye,
            height: eye,
            borderRadius: eye / 2,
            backgroundColor: colors.ink,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: size * 0.39 + eyeOffsetX - eye / 2,
            top: size * 0.39 - eyeOffsetY - eye / 2,
            width: eye,
            height: eye,
            borderRadius: eye / 2,
            backgroundColor: colors.ink,
          }}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: size * 0.39 - eyeOffsetX - eye / 2,
              top: size * 0.39 - eyeOffsetY - eye / 2,
              width: eye,
              height: eye,
              borderRadius: eye / 2,
              backgroundColor: tint,
            },
            leftLidStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: size * 0.39 + eyeOffsetX - eye / 2,
              top: size * 0.39 - eyeOffsetY - eye / 2,
              width: eye,
              height: eye,
              borderRadius: eye / 2,
              backgroundColor: tint,
            },
            rightLidStyle,
          ]}
        />

        <Animated.View
          style={[
            {
              position: 'absolute',
              left: size * 0.12,
              top: size * 0.42,
              width: size * 0.1,
              height: size * 0.06,
              borderRadius: size * 0.05,
              backgroundColor: colors.roseDust,
            },
            cheekOpacity,
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: size * 0.12,
              top: size * 0.42,
              width: size * 0.1,
              height: size * 0.06,
              borderRadius: size * 0.05,
              backgroundColor: colors.roseDust,
            },
            cheekOpacity,
          ]}
        />

        <Animated.View
          style={[
            {
              position: 'absolute',
              top: size * 0.55,
              backgroundColor: colors.ink,
            },
            mouthStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
}
