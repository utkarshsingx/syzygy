import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { PressScale } from '@/components/motion/PressScale';
import { colors, phaseColors } from '@/theme/colors';
import type { CycleEntry, Flow } from '@/types';

type Props = {
  date: Date;
  dateISO: string;
  entry?: CycleEntry;
  isCurrentMonth: boolean;
  isToday: boolean;
  onPress: () => void;
};

const FLOW_OPACITY: Record<Flow, number> = {
  spotting: 0.25,
  light: 0.45,
  medium: 0.7,
  heavy: 0.95,
};

// One day cell in a 7-column month grid. Flow intensity tints the background;
// period-start days get a small terracotta dot in the corner.
export function DayCell({ date, entry, isCurrentMonth, isToday, onPress }: Props) {
  const flowOpacity = entry?.flow ? FLOW_OPACITY[entry.flow] : 0;
  const tint = entry?.phase ? phaseColors[entry.phase] : colors.terracotta;

  return (
    <PressScale
      onPress={onPress}
      pressedScale={0.94}
      haptic="light"
      style={{
        width: `${100 / 7}%`,
        aspectRatio: 1,
        padding: 3,
      }}
    >
      <View
        className="flex-1 rounded-soft items-center justify-center relative"
        style={{
          backgroundColor: flowOpacity > 0 ? tint : 'transparent',
          opacity: flowOpacity > 0 ? flowOpacity : 1,
          borderWidth: isToday ? 1.5 : 0,
          borderColor: colors.terracotta,
        }}
      >
        <Text
          className="font-body-medium text-sm"
          style={{
            color: !isCurrentMonth
              ? `${colors.ink}55`
              : flowOpacity > 0.5
                ? colors.cream
                : colors.ink,
          }}
        >
          {format(date, 'd')}
        </Text>
        {entry?.isPeriodStart ? (
          <View
            className="absolute top-1 right-1 rounded-full"
            style={{
              width: 6,
              height: 6,
              backgroundColor: colors.terracotta,
            }}
          />
        ) : null}
      </View>
    </PressScale>
  );
}
