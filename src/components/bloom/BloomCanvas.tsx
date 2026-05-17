import { useMemo } from 'react';
import { View } from 'react-native';
import { Canvas, Group } from '@shopify/react-native-skia';
import { useBloomMorph } from './useBloomMorph';
import { PetalRing } from './PetalRing';
import { GlowHalo } from './GlowHalo';
import { Stamen } from './Stamen';
import { PollenParticles } from './PollenParticles';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import { useUserStore } from '@/stores/useUserStore';
import { phaseColors, colors } from '@/theme/colors';
import type { CyclePhase } from '@/types';

type Props = {
  width: number;
  height: number;
  phase?: CyclePhase;
  dayInPhase?: number;
  phaseLength?: number;
  showPollen?: boolean;
};

// Time-of-day color tints applied as a subtle overlay on the petals.
// dawn = cool blue, midday = neutral cream, golden = warm orange, night = cool.
const todToTint: Record<string, string> = {
  preDawn: '#7E92B233',
  sunrise: '#FFE0BB22',
  midday: '#FFE6CB11',
  goldenHour: '#FFC59A33',
  night: '#A6B6D633',
};

// Color palette per phase. Outer ring is the hero; inner rings lighten toward
// the center for an iridescent-petal look.
const palettes: Record<CyclePhase, {
  outer: string; mid: string; inner: string; core: string;
  halo: string; stamen: string; stamenGlow: string; highlight: string;
}> = {
  menstrual: {
    outer: '#A75B3D',
    mid: '#C8704D',
    inner: '#D9A6A0',
    core: '#E8AE94',
    halo: '#C8704D',
    stamen: '#C99A4A',
    stamenGlow: '#F4DEB1',
    highlight: '#FBEEE7',
  },
  follicular: {
    outer: '#C58A82',
    mid: '#D9A6A0',
    inner: '#E9C2BC',
    core: '#F4DDD9',
    halo: '#D9A6A0',
    stamen: '#C99A4A',
    stamenGlow: '#F4DEB1',
    highlight: '#FBF3F2',
  },
  ovulation: {
    outer: '#C99A4A',
    mid: '#D4A857',
    inner: '#E5C076',
    core: '#F4DEB1',
    halo: '#E5C076',
    stamen: '#C8704D',
    stamenGlow: '#FBF3F2',
    highlight: '#FBF1DD',
  },
  luteal: {
    outer: '#7E926F',
    mid: '#9CAE8E',
    inner: '#BCC8AE',
    core: '#DDE3D6',
    halo: '#9CAE8E',
    stamen: '#C99A4A',
    stamenGlow: '#F4DEB1',
    highlight: '#F1F3EE',
  },
};

// 4 concentric Fibonacci rings: 21 outer, 13, 8, 5 inner. ~47 petals total.
// Auto-scaled for low-end devices: drop outer ring + pollen.
const RINGS_HIGH = [
  { count: 21, radiusFactor: 0.92, widthFactor: 0.12, angleOffset: 0 },
  { count: 13, radiusFactor: 0.7, widthFactor: 0.14, angleOffset: Math.PI / 13 },
  { count: 8, radiusFactor: 0.5, widthFactor: 0.16, angleOffset: 0 },
  { count: 5, radiusFactor: 0.3, widthFactor: 0.18, angleOffset: Math.PI / 5 },
] as const;

const RINGS_LOW = [
  { count: 13, radiusFactor: 0.92, widthFactor: 0.14, angleOffset: 0 },
  { count: 8, radiusFactor: 0.6, widthFactor: 0.16, angleOffset: Math.PI / 8 },
  { count: 5, radiusFactor: 0.32, widthFactor: 0.18, angleOffset: 0 },
] as const;

export function BloomCanvas({
  width,
  height,
  phase = 'follicular',
  dayInPhase = 1,
  phaseLength = 7,
  showPollen = true,
}: Props) {
  const reduced = useReducedMotion();
  const { phase: tod } = useTimeOfDay();
  const quality = useUserStore((s) => s.bloomQuality);
  const { openness, wilt, glow } = useBloomMorph(phase, dayInPhase, phaseLength);

  const palette = palettes[phase];
  const tint = todToTint[tod] ?? 'transparent';

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = Math.min(width, height) * 0.42;

  const rings = useMemo(() => {
    // Auto-select ring set for low-RAM devices unless explicitly overridden.
    if (quality === 'low') return RINGS_LOW;
    return RINGS_HIGH;
  }, [quality]);

  const pollenEnabled = !reduced && showPollen && quality !== 'low';

  return (
    <View style={{ width, height }}>
      <Canvas style={{ width, height }}>
        <GlowHalo
          cx={cx}
          cy={cy}
          radius={maxRadius * 1.15}
          innerColor={palette.halo + 'AA'}
          outerColor={palette.halo + '00'}
          glow={glow}
        />

        {/* Outer-to-inner: outer rings draw first so inner rings sit on top */}
        {rings.map((ring, i) => {
          const colorKey: 'outer' | 'mid' | 'inner' | 'core' =
            i === 0 ? 'outer' : i === 1 ? 'mid' : i === 2 ? 'inner' : 'core';
          return (
            <PetalRing
              key={i}
              cx={cx}
              cy={cy}
              count={ring.count}
              radius={maxRadius * ring.radiusFactor}
              petalWidth={maxRadius * ring.widthFactor}
              color={palette[colorKey]}
              highlightColor={palette.highlight}
              angleOffset={ring.angleOffset}
              openness={openness}
              wilt={wilt}
              glow={glow}
              baseOpacity={0.85 + i * 0.04}
            />
          );
        })}

        <Stamen
          cx={cx}
          cy={cy}
          radius={maxRadius * 0.12}
          color={palette.stamen}
          highlightColor={palette.stamenGlow}
          glow={glow}
        />

        <PollenParticles
          cx={cx}
          cy={cy}
          glow={glow}
          color={palette.stamenGlow}
          enabled={pollenEnabled}
          count={pollenEnabled ? 16 : 0}
        />

        {/* Time-of-day tint as a thin colored veil over the whole bloom */}
        <Group color={tint}>{/* TODO: per-petal tinting via ColorMatrix once visual is locked */}</Group>
      </Canvas>

      {/* Floor for non-Skia overlays (e.g. accessibility text). Empty for now. */}
      <View
        accessibilityLabel={`${phase} bloom, day ${dayInPhase} in phase`}
        importantForAccessibility="yes"
        style={{ position: 'absolute', inset: 0 }}
        pointerEvents="none"
      />
    </View>
  );
}

// Re-exports so consumers can `import { BloomCanvas } from '@/components/bloom'`.
export { useBloomMorph } from './useBloomMorph';

// Re-export colors so DevTools / debug previews can read tokens.
export { phaseColors, colors };
