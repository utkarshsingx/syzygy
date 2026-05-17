import { Group } from '@shopify/react-native-skia';
import type { SharedValue } from 'react-native-reanimated';
import { Petal } from './Petal';

type Props = {
  cx: number;
  cy: number;
  count: number;
  radius: number;
  petalWidth: number;
  color: string;
  highlightColor: string;
  angleOffset?: number;
  openness: SharedValue<number>;
  wilt: SharedValue<number>;
  glow: SharedValue<number>;
  baseOpacity?: number;
};

// One concentric ring of N petals. The angle offset lets us rotate odd rings
// so petals interleave rather than stack atop the prior ring.
export function PetalRing({
  cx,
  cy,
  count,
  radius,
  petalWidth,
  color,
  highlightColor,
  angleOffset = 0,
  openness,
  wilt,
  glow,
  baseOpacity,
}: Props) {
  const petals = [];
  for (let i = 0; i < count; i++) {
    const angle = angleOffset + (i / count) * Math.PI * 2;
    // Petals at opposite sides should sway slightly out of sync.
    const phaseOffset = (i % 2) * 0.4;
    petals.push(
      <Petal
        key={i}
        cx={cx}
        cy={cy}
        angle={angle}
        ringRadius={radius}
        petalWidth={petalWidth}
        color={color}
        highlightColor={highlightColor}
        openness={openness}
        wilt={wilt}
        glow={glow}
        baseOpacity={baseOpacity}
        phaseOffset={phaseOffset}
      />,
    );
  }
  return <Group>{petals}</Group>;
}
