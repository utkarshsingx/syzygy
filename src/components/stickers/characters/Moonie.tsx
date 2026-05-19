import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { BaseSticker } from '../BaseSticker';
import type { StickerCharacterProps } from '../types';

// Moonie — a calm crescent. A small star drifts at the temple.
export function Moonie({ size, params, tint = colors.sage }: StickerCharacterProps) {
  return (
    <BaseSticker
      size={size}
      params={params}
      tint={tint}
      highlight={colors.cream}
      bodyShape="crescent"
      frontLayer={
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: size * 0.08,
            right: size * 0.08,
            width: size * 0.1,
            height: size * 0.1,
            borderRadius: size * 0.05,
            backgroundColor: colors.cream,
            opacity: 0.85,
          }}
        />
      }
    />
  );
}
