import { View } from 'react-native';
import { colors } from '@/theme/colors';
import { BaseSticker } from '../BaseSticker';
import type { StickerCharacterProps } from '../types';

// Dev — the developer avatar. Tiny round glasses + a cap.
export function Dev({ size, params, tint = colors.paper }: StickerCharacterProps) {
  const lensSize = size * 0.12;
  const lensY = size * 0.34;
  const lensOffsetX = size * 0.18;

  return (
    <BaseSticker
      size={size}
      params={params}
      tint={tint}
      highlight={colors.cream}
      bodyShape="round"
      topLayer={
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: -size * 0.04,
            width: size * 0.7,
            height: size * 0.22,
            borderTopLeftRadius: size * 0.3,
            borderTopRightRadius: size * 0.3,
            backgroundColor: colors.ink,
          }}
        >
          <View
            style={{
              position: 'absolute',
              right: size * 0.08,
              top: size * 0.07,
              width: size * 0.16,
              height: size * 0.04,
              borderRadius: size * 0.02,
              backgroundColor: colors.terracotta,
            }}
          />
        </View>
      }
      frontLayer={
        <View pointerEvents="none">
          <View
            style={{
              position: 'absolute',
              left: size * 0.39 - lensOffsetX - lensSize / 2,
              top: lensY - lensSize / 2,
              width: lensSize,
              height: lensSize,
              borderRadius: lensSize / 2,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: 'transparent',
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: size * 0.39 + lensOffsetX - lensSize / 2,
              top: lensY - lensSize / 2,
              width: lensSize,
              height: lensSize,
              borderRadius: lensSize / 2,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: 'transparent',
            }}
          />
          <View
            style={{
              position: 'absolute',
              left: size * 0.39 - lensSize * 0.5,
              top: lensY - 1,
              width: lensSize,
              height: 2,
              backgroundColor: colors.ink,
            }}
          />
        </View>
      }
    />
  );
}
