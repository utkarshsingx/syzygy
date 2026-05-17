import { useRef, useState } from 'react';
import { View, Text, useWindowDimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { BloomCanvas } from '@/components/bloom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { QuickLogFAB } from '@/components/log/QuickLogFAB';
import { LogEntryModal, type LogEntryModalHandle } from '@/components/log/LogEntryModal';
import { useUserStore } from '@/stores/useUserStore';
import { useCycleStore } from '@/stores/useCycleStore';
import { usePhase } from '@/hooks/usePhase';
import { fonts } from '@/theme/typography';
import { colors, phaseColors } from '@/theme/colors';
import type { CyclePhase } from '@/types';

const PHASES: CyclePhase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

const greetings: Record<CyclePhase, string> = {
  menstrual: 'Be gentle today.',
  follicular: 'Soft openings.',
  ovulation: 'You’re glowing.',
  luteal: 'A quiet unfolding.',
};

export function DashboardScreen() {
  const reset = useUserStore((s) => s.reset);
  const name = useUserStore((s) => s.name);
  const loading = useCycleStore((s) => s.loading);
  const { width } = useWindowDimensions();
  const phaseSummary = usePhase();
  const logModal = useRef<LogEntryModalHandle>(null);

  const [previewPhase, setPreviewPhase] = useState<CyclePhase>('follicular');
  const phase: CyclePhase = phaseSummary?.phase ?? previewPhase;
  const dayInPhase = phaseSummary?.dayInPhase ?? 3;

  const canvasSize = Math.min(width - 32, 360);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="medium" />

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View className="px-6 pt-4">
          <SplitText
            style={{
              fontFamily: fonts.displayBold,
              fontSize: 28,
              color: colors.ink,
              lineHeight: 32,
            }}
            stagger={40}
          >
            {name ? `Hello, ${name}.` : greetings[phase]}
          </SplitText>
          <Reveal direction="up" delay={400}>
            <Text className="font-body text-sm text-ink-100/80 mt-1">
              {loading
                ? 'Syncing your bloom…'
                : phaseSummary
                  ? `Day ${phaseSummary.cycleDay} of ${phaseSummary.cycleLength}` +
                    ` · ${phaseSummary.daysUntilNextPeriod} days until next period`
                  : 'Tap + to log your first entry — predictions begin once a period start is recorded.'}
            </Text>
          </Reveal>
        </View>

        <View className="items-center mt-4">
          <BloomCanvas
            width={canvasSize}
            height={canvasSize}
            phase={phase}
            dayInPhase={dayInPhase}
          />
        </View>

        <View className="px-6">
          {!phaseSummary ? (
            <Card tone="tinted" className="mt-4">
              <Text className="font-display-medium text-base text-ink mb-2">
                Preview the bloom
              </Text>
              <Text className="font-body text-sm text-ink-100 mb-3">
                Pick a phase to see how the bloom morphs. Real predictions arrive
                once you log a period start.
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {PHASES.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === previewPhase ? 'primary' : 'secondary'}
                    onPress={() => setPreviewPhase(p)}
                  >
                    {p}
                  </Button>
                ))}
              </View>
            </Card>
          ) : (
            <Card tone="tinted" className="mt-4">
              <Text className="font-display-medium text-base text-ink mb-1">
                {phase.charAt(0).toUpperCase() + phase.slice(1)} phase
              </Text>
              <Text className="font-body text-sm text-ink-100">
                Day {dayInPhase} in phase · confidence{' '}
                {Math.round(phaseSummary.confidence * 100)}%
              </Text>
              <View
                className="h-2 rounded-pill mt-3"
                style={{ backgroundColor: phaseColors[phase] }}
              />
            </Card>
          )}

          {__DEV__ ? (
            <Button
              variant="ghost"
              size="sm"
              onPress={reset}
              className="mt-4 self-center"
            >
              Reset onboarding (dev)
            </Button>
          ) : null}
        </View>
      </ScrollView>

      <QuickLogFAB onPress={() => logModal.current?.open()} />
      <LogEntryModal ref={logModal} />
    </SafeAreaView>
  );
}
