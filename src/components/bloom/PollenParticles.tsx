import { useMemo } from 'react';
import { Group, Circle } from '@shopify/react-native-skia';
import {
  useSharedValue,
  useDerivedValue,
  useFrameCallback,
  type SharedValue,
} from 'react-native-reanimated';

type Props = {
  cx: number;
  cy: number;
  glow: SharedValue<number>;
  color: string;
  enabled: boolean;
  count?: number;
};

// Renders N PollenDot children — each owns its own shared values + frame
// callback so React's Rules of Hooks aren't violated (no hooks in loops).
export function PollenParticles({ cx, cy, glow, color, enabled, count = 18 }: Props) {
  // Stable initial angles so dots don't all spawn in the same place on re-mount.
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2 + Math.random() * 0.4,
        speed: 0.18 + Math.random() * 0.12,
        maxLife: 1500 + Math.random() * 900,
        size: 1.5 + Math.random() * 1.5,
        startDelay: Math.random() * 1500,
      })),
    [count],
  );

  return (
    <Group>
      {seeds.map((s, i) => (
        <PollenDot
          key={i}
          cx={cx}
          cy={cy}
          color={color}
          glow={glow}
          enabled={enabled}
          seed={s}
        />
      ))}
    </Group>
  );
}

type Seed = {
  angle: number;
  speed: number;
  maxLife: number;
  size: number;
  startDelay: number;
};

function PollenDot({
  cx,
  cy,
  color,
  glow,
  enabled,
  seed,
}: {
  cx: number;
  cy: number;
  color: string;
  glow: SharedValue<number>;
  enabled: boolean;
  seed: Seed;
}) {
  const x = useSharedValue(cx);
  const y = useSharedValue(cy);
  const life = useSharedValue(-seed.startDelay); // negative = waiting to spawn

  useFrameCallback((info) => {
    'worklet';
    if (!enabled || glow.value < 0.55) {
      x.value = cx;
      y.value = cy;
      life.value = 0;
      return;
    }
    const dt = Math.min(info.timeSincePreviousFrame ?? 16, 32);
    life.value += dt;
    if (life.value < 0) return;
    if (life.value > seed.maxLife) {
      // Respawn at the stamen with a fresh angle.
      const newAngle = Math.random() * Math.PI * 2;
      const c = Math.cos(newAngle);
      const s = Math.sin(newAngle);
      seed.angle = newAngle;
      x.value = cx;
      y.value = cy;
      life.value = 0;
      // Mutating seed in a worklet is allowed because it's a plain JS object
      // passed by reference; we're not relying on React re-rendering on it.
      x.value = cx + c * seed.speed * dt;
      y.value = cy + s * seed.speed * dt;
      return;
    }
    x.value += Math.cos(seed.angle) * seed.speed * dt;
    y.value += Math.sin(seed.angle) * seed.speed * dt;
  });

  const opacity = useDerivedValue(() => {
    if (life.value < 0) return 0;
    const lifeRatio = 1 - life.value / seed.maxLife;
    return Math.max(0, Math.min(0.85, lifeRatio * 0.85)) * (glow.value > 0.55 ? 1 : 0);
  }, []);

  return <Circle cx={x} cy={y} r={seed.size} color={color} opacity={opacity} />;
}
