import { useMemo } from 'react';
import { View, Text } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from 'date-fns';
import { DayCell } from './DayCell';
import { colors } from '@/theme/colors';
import type { CycleEntry, PhaseSummary } from '@/types';

type Props = {
  month: Date;
  entries: CycleEntry[];
  phaseSummary: PhaseSummary | null;
  onDayPress: (dateISO: string) => void;
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function MonthGrid({ month, entries, phaseSummary, onDayPress }: Props) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  // Index entries by date for O(1) cell lookup.
  const entriesByDate = useMemo(() => {
    const m = new Map<string, CycleEntry>();
    for (const e of entries) m.set(e.dateISO, e);
    return m;
  }, [entries]);

  return (
    <View className="mb-4">
      <Text className="font-display text-xl text-ink px-1 mb-3">
        {format(month, 'MMMM yyyy')}
      </Text>

      <View className="flex-row mb-1.5">
        {WEEKDAYS.map((d, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="font-body text-xs text-ink-100/60">{d}</Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd');
          return (
            <DayCell
              key={iso}
              date={day}
              dateISO={iso}
              entry={entriesByDate.get(iso)}
              isCurrentMonth={isSameMonth(day, month)}
              isToday={isToday(day)}
              onPress={() => onDayPress(iso)}
            />
          );
        })}
      </View>
      {/* Subtle separator between months when stacking */}
      <View className="h-[1px] bg-ink-50/5 mt-3" style={{ backgroundColor: colors.paper }} />
    </View>
  );
}
