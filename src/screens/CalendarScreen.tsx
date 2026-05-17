import { useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addMonths, subMonths } from 'date-fns';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { MonthGrid } from '@/components/calendar/MonthGrid';
import { QuickLogFAB } from '@/components/log/QuickLogFAB';
import { LogEntryModal, type LogEntryModalHandle } from '@/components/log/LogEntryModal';
import { useCycleStore } from '@/stores/useCycleStore';
import { usePhase } from '@/hooks/usePhase';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

const MONTH_WINDOW = 6; // show 6 months on either side of "now"

export function CalendarScreen() {
  const entries = useCycleStore((s) => s.entries);
  const phaseSummary = usePhase();
  const logModal = useRef<LogEntryModalHandle>(null);
  const [anchor] = useState(new Date());

  const months = useMemo(() => {
    const out: Date[] = [];
    for (let i = -MONTH_WINDOW; i <= MONTH_WINDOW; i++) {
      out.push(i < 0 ? subMonths(anchor, -i) : addMonths(anchor, i));
    }
    return out;
  }, [anchor]);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />

      <View className="px-6 pt-4">
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}>
          Calendar
        </Text>
        <Text className="font-body text-sm text-ink-100/80 mt-1 mb-4">
          {entries.length === 0
            ? 'Tap a day to log how you’re feeling.'
            : `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} logged.`}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
        contentOffset={{ x: 0, y: 0 }}
      >
        {months.map((m) => (
          <MonthGrid
            key={m.toISOString()}
            month={m}
            entries={entries}
            phaseSummary={phaseSummary}
            onDayPress={(iso) => logModal.current?.open(iso)}
          />
        ))}

        <Button
          variant="ghost"
          size="sm"
          onPress={() => logModal.current?.open()}
          className="self-center mt-4"
        >
          Log today
        </Button>
      </ScrollView>

      <QuickLogFAB onPress={() => logModal.current?.open()} />
      <LogEntryModal ref={logModal} />
    </SafeAreaView>
  );
}
