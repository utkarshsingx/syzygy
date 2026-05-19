import { View, Text } from 'react-native';
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

export function BloomCanvas({
  width,
  height,
  phase = 'follicular',
  dayInPhase = 1,
  phaseLength = 7,
}: Props) {
  const color = phaseColors[phase] ?? colors.terracotta;
  const diameter = Math.min(width, height) * 0.6;

  return (
    <View
      style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
      accessibilityLabel={`${phase} phase, day ${dayInPhase} of ${phaseLength}`}
    >
      <View
        style={{
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: color,
          opacity: 0.18,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: colors.ink, fontSize: 14, opacity: 0.7 }}>
          {phase}
        </Text>
        <Text style={{ color: colors.ink, fontSize: 28, fontWeight: '600' }}>
          Day {dayInPhase}
        </Text>
      </View>
    </View>
  );
}

export { useBloomMorph } from './useBloomMorph';
export { phaseColors, colors };
