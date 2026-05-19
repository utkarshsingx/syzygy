import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { BaseSticker } from '../BaseSticker';
import type { StickerCharacterProps } from '../types';

// Sunny — a beaming little sun. Rays bloom around the body.
export function Sunny({ size, params, tint = colors.ochre }: StickerCharacterProps) {
  const { glow, headTilt } = params;

  const rayWrapperStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${headTilt.value * 18}deg` }],
    opacity: 0.7 + glow.value * 0.3,
  }));

  const rays = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * 360;
    return (
      <View
        key={i}
        style={{
          position: 'absolute',
          left: size / 2 - size * 0.04,
          top: size * 0.02,
          width: size * 0.08,
          height: size * 0.18,
          borderRadius: size * 0.04,
          backgroundColor: colors.ochre,
          transform: [
            { translateY: size * 0.4 },
            { rotate: `${angle}deg` },
            { translateY: -size * 0.4 },
          ],
        }}
      />
    );
  });

  return (
    <BaseSticker
      size={size}
      params={params}
      tint={tint}
      highlight={colors.cream}
      bodyShape="round"
      backLayer={
        <Animated.View
          pointerEvents="none"
          style={[{ position: 'absolute', width: size, height: size }, rayWrapperStyle]}
        >
          {rays}
        </Animated.View>
      }
    />
  );
}
