import { Circle, RadialGradient, vec, Group, Blur } from '@shopify/react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

type Props = {
  cx: number;
  cy: number;
  radius: number;
  innerColor: string;
  outerColor: string;
  glow: SharedValue<number>;
};

// Sits behind the petals. Opacity + scale rise with glow so the bloom feels
// luminous around ovulation and dim during menstrual.
export function GlowHalo({ cx, cy, radius, innerColor, outerColor, glow }: Props) {
  const opacity = useDerivedValue(() => 0.15 + glow.value * 0.55, []);
  const r = useDerivedValue(() => radius * (0.85 + glow.value * 0.4), [radius]);

  return (
    <Group opacity={opacity}>
      <Circle cx={cx} cy={cy} r={r}>
        <RadialGradient
          c={vec(cx, cy)}
          r={radius * 1.2}
          colors={[innerColor, outerColor, `${outerColor}00`]}
          positions={[0, 0.45, 1]}
        />
        <Blur blur={16} />
      </Circle>
    </Group>
  );
}
