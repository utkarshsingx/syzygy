import type { ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import type { StickerParams } from './types';

type BodyShape = 'round' | 'crescent' | 'flower' | 'square';

type Props = {
  size: number;
  params: StickerParams;
  tint: string;
  highlight?: string;
  bodyShape?: BodyShape;
  // optional ornament rendered behind the body (rays, petals, etc.)
  backLayer?: ReactNode;
  // optional ornament rendered above the body (hat, glasses, etc.)
  frontLayer?: ReactNode;
  // optional ornament rendered at the very top, follows the body sway
  topLayer?: ReactNode;
};

export function BaseSticker({
  size,
  params,
  tint,
  highlight = colors.cream,
  bodyShape = 'round',
  backLayer,
  frontLayer,
  topLayer,
}: Props) {
  const { mouthOpen, bodyBob, headTilt, eyeBlink, glow, scale } = params;

  const bodyStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: bodyBob.value * size * 0.04 },
      { rotate: `${headTilt.value * 6}deg` },
      { scale: scale.value },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + glow.value * 0.4,
    transform: [{ scale: 1 + glow.value * 0.2 }],
  }));

  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: eyeBlink.value }],
  }));

  const mouthStyle = useAnimatedStyle(() => ({
    height: interpolate(mouthOpen.value, [0, 1], [size * 0.04, size * 0.18]),
    width: interpolate(mouthOpen.value, [0, 1], [size * 0.22, size * 0.28]),
    borderRadius: size * 0.12,
  }));

  const eye = size * 0.085;
  const eyeOffsetX = size * 0.18;
  const eyeOffsetY = size * 0.05;
  const center = size * 0.39;

  const bodyW = size * 0.78;
  const bodyH = bodyShape === 'crescent' ? size * 0.86 : size * 0.78;
  const bodyRadius =
    bodyShape === 'round'
      ? size * 0.42
      : bodyShape === 'crescent'
        ? size * 0.45
        : bodyShape === 'flower'
          ? size * 0.3
          : size * 0.18;

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

      {backLayer}

      <Animated.View
        style={[
          { width: bodyW, height: bodyH, alignItems: 'center', justifyContent: 'center' },
          bodyStyle,
        ]}
      >
        <View
          style={{
            position: 'absolute',
            width: bodyW,
            height: bodyH,
            borderRadius: bodyRadius,
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
            backgroundColor: highlight,
            opacity: 0.35,
          }}
        />

        <View
          style={{
            position: 'absolute',
            left: center - eyeOffsetX - eye / 2,
            top: center - eyeOffsetY - eye / 2,
            width: eye,
            height: eye,
            borderRadius: eye / 2,
            backgroundColor: colors.ink,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: center + eyeOffsetX - eye / 2,
            top: center - eyeOffsetY - eye / 2,
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
              left: center - eyeOffsetX - eye / 2,
              top: center - eyeOffsetY - eye / 2,
              width: eye,
              height: eye,
              borderRadius: eye / 2,
              backgroundColor: tint,
            },
            lidStyle,
          ]}
        />
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: center + eyeOffsetX - eye / 2,
              top: center - eyeOffsetY - eye / 2,
              width: eye,
              height: eye,
              borderRadius: eye / 2,
              backgroundColor: tint,
            },
            lidStyle,
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

        {frontLayer}
        {topLayer}
      </Animated.View>
    </View>
  );
}
