import { useEffect, useMemo, useRef } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { Canvas, Path, Skia, Group } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  withTiming,
  withSequence,
  Easing,
  useFrameCallback,
  cancelAnimation,
} from 'react-native-reanimated';
import { buildPetalPath } from '@/components/bloom/petalPath';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors } from '@/theme/colors';

type Props = {
  trigger: number; // increment to fire a new burst
  onDone?: () => void;
};

const COUNT = 22;

// One-shot celebration: a ring of petals scatters outward and fades, like
// the bloom shedding a few petals in delight. Fires whenever `trigger`
// increases (LogEntryModal bumps it on successful save).
export function PetalBurst({ trigger, onDone }: Props) {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const t = useSharedValue(0);
  const lastTrigger = useRef(trigger);

  // Stable per-petal seeds so each burst feels organic but consistent within itself.
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        angle: (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4,
        distance: 110 + Math.random() * 140,
        rotation: (Math.random() - 0.5) * 0.8,
        size: 14 + Math.random() * 10,
        color: [colors.terracotta, colors.roseDust, colors.ochre, colors.sage][
          Math.floor(Math.random() * 4)
        ] as string,
        delay: Math.random() * 0.18,
      })),
    [],
  );

  useEffect(() => {
    if (trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    if (reduced) {
      onDone?.();
      return;
    }
    cancelAnimation(t);
    t.value = 0;
    t.value = withSequence(
      withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 0 }),
    );
    // Schedule onDone after the visible duration.
    const id = setTimeout(() => onDone?.(), 1300);
    return () => clearTimeout(id);
  }, [trigger, reduced]);

  if (reduced) return null;

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: 0, left: 0, width, height }}
    >
      <Canvas style={{ flex: 1 }}>
        <Group>
          {seeds.map((s, i) => (
            <BurstPetal key={i} t={t} seed={s} cx={width / 2} cy={height / 2} />
          ))}
        </Group>
      </Canvas>
    </View>
  );
}

function BurstPetal({
  t,
  seed,
  cx,
  cy,
}: {
  t: ReturnType<typeof useSharedValue<number>>;
  seed: {
    angle: number;
    distance: number;
    rotation: number;
    size: number;
    color: string;
    delay: number;
  };
  cx: number;
  cy: number;
}) {
  const path = useDerivedValue(() => {
    const local = Math.max(0, Math.min(1, (t.value - seed.delay) / (1 - seed.delay)));
    // Ease-out custom for smooth release.
    const eased = 1 - Math.pow(1 - local, 2);
    const r = seed.distance * eased;
    const px = cx + Math.cos(seed.angle) * r;
    const py = cy + Math.sin(seed.angle) * r;
    return buildPetalPath(
      px,
      py,
      seed.angle + seed.rotation * eased,
      seed.size,
      seed.size * 0.4,
      0.85,
      0,
    );
  }, [cx, cy]);

  const opacity = useDerivedValue(() => {
    const local = Math.max(0, Math.min(1, (t.value - seed.delay) / (1 - seed.delay)));
    return Math.max(0, 1 - local) * 0.92;
  }, []);

  return <Path path={path} color={seed.color} opacity={opacity} />;
}
