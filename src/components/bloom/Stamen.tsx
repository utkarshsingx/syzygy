import { Circle, Group, RadialGradient, vec } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

type Props = {
  cx: number;
  cy: number;
  radius: number;
  color: string;
  highlightColor: string;
  glow: SharedValue<number>;
};

// The bloom's center cluster. A bright dot with a soft radial halo whose
// brightness tracks glow. Pollen particles spawn outward from this point.
export function Stamen({ cx, cy, radius, color, highlightColor, glow }: Props) {
  const haloOpacity = useDerivedValue(() => 0.4 + glow.value * 0.55, []);
  const haloRadius = useDerivedValue(() => radius * (1.6 + glow.value * 0.8), [radius]);
  const dotRadius = useDerivedValue(() => radius * (0.95 + glow.value * 0.1), [radius]);

  return (
    <Group>
      {/* Soft halo around the stamen */}
      <Circle cx={cx} cy={cy} r={haloRadius} opacity={haloOpacity}>
        <RadialGradient
          c={vec(cx, cy)}
          r={radius * 2.4}
          colors={[highlightColor, `${color}00`]}
        />
      </Circle>
      {/* The bright center dot */}
      <Circle cx={cx} cy={cy} r={dotRadius} color={color} />
    </Group>
  );
}
