import { useEffect } from 'react';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useUserStore } from '@/stores/useUserStore';
import type { StickerMode, StickerParams } from './types';

type ModeConfig = {
  bobAmp: number;
  bobHz: number;
  mouthAmp: number;
  mouthHz: number;
  tiltAmp: number;
  glow: number;
  baseScale: number;
};

function configFor(mode: StickerMode, bpm: number): ModeConfig {
  const beatHz = bpm / 60;
  switch (mode) {
    case 'singing':
      return { bobAmp: 0.55, bobHz: beatHz, mouthAmp: 0.9, mouthHz: beatHz, tiltAmp: 0.25, glow: 0.6, baseScale: 1 };
    case 'dancing':
      return { bobAmp: 0.8, bobHz: beatHz, mouthAmp: 0.45, mouthHz: beatHz / 2, tiltAmp: 0.55, glow: 0.4, baseScale: 1.02 };
    case 'cheering':
      return { bobAmp: 0.45, bobHz: 1.6, mouthAmp: 0.65, mouthHz: 1.6, tiltAmp: 0.35, glow: 0.7, baseScale: 1 };
    case 'hugging':
      return { bobAmp: 0.15, bobHz: 0.6, mouthAmp: 0.25, mouthHz: 0.4, tiltAmp: 0.1, glow: 0.5, baseScale: 1 };
    case 'sleeping':
      return { bobAmp: 0.1, bobHz: 0.25, mouthAmp: 0, mouthHz: 0, tiltAmp: 0.05, glow: 0.1, baseScale: 0.95 };
    case 'sad':
      return { bobAmp: 0.08, bobHz: 0.4, mouthAmp: 0.05, mouthHz: 0.3, tiltAmp: 0.05, glow: 0.05, baseScale: 0.97 };
    case 'idle':
    default:
      return { bobAmp: 0.18, bobHz: 0.5, mouthAmp: 0.08, mouthHz: 0.3, tiltAmp: 0.1, glow: 0.2, baseScale: 1 };
  }
}

export function useStickerAnimation(mode: StickerMode, bpm: number = 90): StickerParams {
  const reduced = useUserStore((s) => s.reducedMotionOverride === true);

  const mouthOpen = useSharedValue(0);
  const bodyBob = useSharedValue(0);
  const headTilt = useSharedValue(0);
  const eyeBlink = useSharedValue(0);
  const glow = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const cfg = configFor(mode, bpm);

    cancelAnimation(mouthOpen);
    cancelAnimation(bodyBob);
    cancelAnimation(headTilt);
    cancelAnimation(eyeBlink);
    cancelAnimation(glow);
    cancelAnimation(scale);

    scale.value = withTiming(cfg.baseScale, { duration: 240 });
    glow.value = withTiming(reduced ? 0 : cfg.glow, { duration: 400 });

    if (reduced) {
      mouthOpen.value = withTiming(0, { duration: 200 });
      bodyBob.value = withTiming(0, { duration: 200 });
      headTilt.value = withTiming(0, { duration: 200 });
    } else {
      const bobMs = Math.max(60, Math.round(1000 / cfg.bobHz / 2));
      bodyBob.value = withRepeat(
        withSequence(
          withTiming(cfg.bobAmp, { duration: bobMs, easing: Easing.inOut(Easing.sin) }),
          withTiming(-cfg.bobAmp, { duration: bobMs, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      if (cfg.mouthAmp > 0 && cfg.mouthHz > 0) {
        const mouthMs = Math.max(80, Math.round(1000 / cfg.mouthHz / 2));
        mouthOpen.value = withRepeat(
          withSequence(
            withTiming(cfg.mouthAmp, { duration: Math.round(mouthMs * 0.35), easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: Math.round(mouthMs * 0.65), easing: Easing.in(Easing.quad) }),
          ),
          -1,
          false,
        );
      } else {
        mouthOpen.value = withTiming(0, { duration: 200 });
      }

      const tiltMs = Math.max(400, Math.round(1500 / Math.max(0.4, cfg.bobHz)));
      headTilt.value = withRepeat(
        withSequence(
          withTiming(cfg.tiltAmp, { duration: tiltMs, easing: Easing.inOut(Easing.sin) }),
          withTiming(-cfg.tiltAmp, { duration: tiltMs, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    }

    eyeBlink.value = withRepeat(
      withSequence(
        withDelay(2400, withTiming(1, { duration: 90, easing: Easing.out(Easing.quad) })),
        withTiming(0, { duration: 120, easing: Easing.in(Easing.quad) }),
        withDelay(1600, withTiming(0, { duration: 1 })),
      ),
      -1,
      false,
    );
  }, [mode, bpm, reduced, mouthOpen, bodyBob, headTilt, eyeBlink, glow, scale]);

  return { mouthOpen, bodyBob, headTilt, eyeBlink, glow, scale };
}
