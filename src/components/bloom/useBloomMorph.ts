import { useEffect } from 'react';
import { useSharedValue, withSpring, type SharedValue } from 'react-native-reanimated';
import { phaseToMorph } from '@/lib/predictions';
import type { BloomMorph, CyclePhase } from '@/types';
import { springs } from '@/theme/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Output = {
  openness: SharedValue<number>;
  wilt: SharedValue<number>;
  glow: SharedValue<number>;
};

// Drives the bloom's openness/wilt/glow as Reanimated shared values.
// Petal paths read these inside useDerivedValue worklets on the UI thread,
// so morphs are spring-interpolated at 60fps without crossing the bridge.
export function useBloomMorph(
  phase: CyclePhase | undefined,
  dayInPhase = 1,
  phaseLength = 7,
): Output {
  const reduced = useReducedMotion();

  // Default to a half-open follicular bud so previews render with a value.
  const init: BloomMorph = phaseToMorph(phase ?? 'follicular', dayInPhase, phaseLength);

  const openness = useSharedValue(init.openness);
  const wilt = useSharedValue(init.wilt);
  const glow = useSharedValue(init.glow);

  useEffect(() => {
    const target = phaseToMorph(phase ?? 'follicular', dayInPhase, phaseLength);
    if (reduced) {
      openness.value = target.openness;
      wilt.value = target.wilt;
      glow.value = target.glow;
      return;
    }
    openness.value = withSpring(target.openness, springs.bloom);
    wilt.value = withSpring(target.wilt, springs.bloom);
    glow.value = withSpring(target.glow, springs.bloom);
  }, [phase, dayInPhase, phaseLength, reduced, openness, wilt, glow]);

  return { openness, wilt, glow };
}
