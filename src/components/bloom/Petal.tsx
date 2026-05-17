import { Group, Path } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { buildPetalPath } from './petalPath';

type Props = {
  cx: number;
  cy: number;
  angle: number;
  ringRadius: number;
  petalWidth: number;
  color: string;
  highlightColor: string;
  openness: SharedValue<number>;
  wilt: SharedValue<number>;
  glow: SharedValue<number>;
  baseOpacity?: number;
  phaseOffset?: number; // 0..1 — staggers this petal's "opening pace"
};

// A single petal. Recomputes its SkPath whenever the shared morph values
// change, on the UI thread. The slight per-petal phaseOffset gives the bloom
// an organic, non-synchronous opening (mirrors the web's per-petal offsets).
export function Petal({
  cx,
  cy,
  angle,
  ringRadius,
  petalWidth,
  color,
  highlightColor,
  openness,
  wilt,
  glow,
  baseOpacity = 0.92,
  phaseOffset = 0,
}: Props) {
  const path = useDerivedValue(() => {
    const o = Math.max(0, Math.min(1, openness.value - phaseOffset * 0.08));
    return buildPetalPath(cx, cy, angle, ringRadius, petalWidth, o, wilt.value);
  }, [cx, cy, angle, ringRadius, petalWidth, phaseOffset]);

  const opacity = useDerivedValue(() => baseOpacity + glow.value * 0.05, [baseOpacity]);

  return (
    <Group>
      {/* Fill */}
      <Path path={path} color={color} opacity={opacity} />
      {/* Highlight stroke for a soft inner glow line */}
      <Path
        path={path}
        color={highlightColor}
        style="stroke"
        strokeWidth={1.1}
        opacity={opacity}
      />
    </Group>
  );
}
