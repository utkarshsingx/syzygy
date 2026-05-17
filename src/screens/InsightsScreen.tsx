import { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Card } from '@/components/ui/Card';
import { useCycleStore } from '@/stores/useCycleStore';
import { usePhase } from '@/hooks/usePhase';
import { fonts } from '@/theme/typography';
import { colors, phaseColors } from '@/theme/colors';
import type { CyclePhase, Mood } from '@/types';

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Menstrual',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

export function InsightsScreen() {
  const entries = useCycleStore((s) => s.entries);
  const periodData = useCycleStore((s) => s.periodData);
  const phaseSummary = usePhase();

  const cycleLengths = useMemo(() => {
    const starts = (periodData?.history ?? []).slice().sort();
    const out: number[] = [];
    for (let i = 1; i < starts.length; i++) {
      const a = new Date(starts[i - 1]!);
      const b = new Date(starts[i]!);
      const d = Math.round((+b - +a) / 86_400_000);
      if (d > 18 && d < 60) out.push(d);
    }
    return out.slice(-6);
  }, [periodData]);

  const moodCounts = useMemo(() => {
    const m = new Map<Mood, number>();
    for (const e of entries) {
      if (e.mood) m.set(e.mood, (m.get(e.mood) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text
          style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          className="px-2 mb-5"
        >
          Insights
        </Text>

        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">
            Recent cycle lengths
          </Text>
          {cycleLengths.length === 0 ? (
            <Text className="font-body text-sm text-ink-100">
              Log at least two periods to see your cycle pattern.
            </Text>
          ) : (
            <View className="flex-row items-end gap-2 h-32">
              {cycleLengths.map((len, i) => {
                const heightPct = Math.min(1, len / 40);
                return (
                  <View key={i} className="flex-1 items-center">
                    <View
                      className="w-full rounded-pill"
                      style={{
                        height: `${heightPct * 100}%`,
                        backgroundColor: colors.terracotta,
                        opacity: 0.6 + (i / cycleLengths.length) * 0.4,
                      }}
                    />
                    <Text className="font-body text-xs text-ink-100/70 mt-1">{len}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </Card>

        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Mood map</Text>
          {moodCounts.length === 0 ? (
            <Text className="font-body text-sm text-ink-100">
              Tag a mood when you log to see which feelings recur.
            </Text>
          ) : (
            <View className="gap-2">
              {moodCounts.map(([mood, n]) => (
                <View key={mood} className="flex-row items-center gap-2">
                  <Text className="font-body text-sm text-ink w-24">{mood}</Text>
                  <View
                    className="rounded-pill"
                    style={{
                      height: 10,
                      flex: n,
                      backgroundColor: colors.roseDust,
                    }}
                  />
                  <Text className="font-body text-xs text-ink-100/60 w-6 text-right">
                    {n}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </Card>

        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Current phase</Text>
          {phaseSummary ? (
            <>
              <View className="flex-row items-center gap-2 mb-2">
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: phaseColors[phaseSummary.phase] }}
                />
                <Text className="font-display text-xl text-ink">
                  {PHASE_LABELS[phaseSummary.phase]}
                </Text>
              </View>
              <Text className="font-body text-sm text-ink-100">
                Day {phaseSummary.dayInPhase} in phase · {phaseSummary.daysUntilNextPeriod} days
                until next period · ovulation {phaseSummary.ovulationDate}.
              </Text>
            </>
          ) : (
            <Text className="font-body text-sm text-ink-100">
              Log a period start to begin predicting phases.
            </Text>
          )}
        </Card>

        <Text className="font-body text-xs text-ink-100/40 text-center mt-2">
          Richer charts (victory-native) land in M5.7 follow-up + M7.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
