import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { BaseSticker } from '../BaseSticker';
import type { StickerCharacterProps } from '../types';

// BloomSpirit — a peony-petaled friend. Four soft petals fan behind the body.
export function BloomSpirit({ size, params, tint = colors.roseDust }: StickerCharacterProps) {
  const petalSize = size * 0.42;
  const petals = [0, 90, 180, 270].map((angle) => (
    <View
      key={angle}
      style={{
        position: 'absolute',
        left: size / 2 - petalSize / 2,
        top: size / 2 - petalSize / 2,
        width: petalSize,
        height: petalSize,
        borderRadius: petalSize / 2,
        backgroundColor: colors.roseDust,
        opacity: 0.55,
        transform: [
          { rotate: `${angle}deg` },
          { translateY: -size * 0.18 },
        ],
      }}
    />
  ));

  return (
    <BaseSticker
      size={size}
      params={params}
      tint={tint}
      highlight={colors.cream}
      bodyShape="flower"
      backLayer={<View pointerEvents="none">{petals}</View>}
    />
  );
}
