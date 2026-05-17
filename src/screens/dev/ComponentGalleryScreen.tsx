import { useRef, useState } from 'react';
import { ScrollView, View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@gorhom/bottom-sheet';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Sheet } from '@/components/ui/Sheet';
import { useToast } from '@/components/ui/Toast';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { Stagger } from '@/components/motion/Stagger';
import { PressScale } from '@/components/motion/PressScale';
import { useUserStore } from '@/stores/useUserStore';
import { phaseColors } from '@/theme/colors';
import { useTheme } from '@/theme/ThemeProvider';

type Phase = keyof typeof phaseColors;
const PHASES: Phase[] = ['menstrual', 'follicular', 'ovulation', 'luteal'];

export function ComponentGalleryScreen() {
  const toast = useToast();
  const sheetRef = useRef<BottomSheet>(null);
  const [text, setText] = useState('');
  const reducedOverride = useUserStore((s) => s.reducedMotionOverride);
  const setReducedOverride = useUserStore((s) => s.setReducedMotionOverride);
  const { phase, setPhase, accent } = useTheme();

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="medium" />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <SplitText
          style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, color: '#2A2622' }}
        >
          Component gallery
        </SplitText>

        <Text className="font-body text-sm text-ink-100 mt-2 mb-6">
          M2 design-system sandbox. Long-press the Settings tab to reach this screen.
        </Text>

        <Section title="Theme phase">
          <View className="flex-row flex-wrap gap-2">
            {PHASES.map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === phase ? 'primary' : 'secondary'}
                onPress={() => setPhase(p)}
              >
                {p}
              </Button>
            ))}
          </View>
          <View
            className="h-8 rounded-pill mt-3"
            style={{ backgroundColor: accent }}
          />
        </Section>

        <Section title="Reduced motion override">
          <View className="flex-row items-center justify-between">
            <Text className="font-body text-base text-ink">Force reduced motion</Text>
            <Switch
              value={reducedOverride === true}
              onValueChange={(v) => setReducedOverride(v ? true : null)}
            />
          </View>
        </Section>

        <Section title="Buttons">
          <Stagger stagger={70} className="gap-3">
            <Button onPress={() => toast.show('Primary tapped', 'success')}>Primary</Button>
            <Button variant="secondary" onPress={() => toast.show('Secondary tapped')}>
              Secondary
            </Button>
            <Button variant="soft" onPress={() => toast.show('Soft tapped')}>
              Soft
            </Button>
            <Button variant="ghost" onPress={() => toast.show('Ghost tapped')}>
              Ghost
            </Button>
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
          </Stagger>
        </Section>

        <Section title="Cards">
          <Stagger stagger={70} className="gap-3">
            <Card>
              <Text className="font-display text-xl text-ink mb-1">Paper card</Text>
              <Text className="font-body text-sm text-ink-100">
                Default tone — soft paper surface with a quiet border.
              </Text>
            </Card>
            <Card tone="cream">
              <Text className="font-display text-xl text-ink mb-1">Cream card</Text>
              <Text className="font-body text-sm text-ink-100">For nested cards.</Text>
            </Card>
            <Card tone="tinted">
              <Text className="font-display text-xl text-ink mb-1">Tinted card</Text>
              <Text className="font-body text-sm text-ink-100">
                Phase-coloured emphasis (used for next-period countdown).
              </Text>
            </Card>
          </Stagger>
        </Section>

        <Section title="Input">
          <Reveal direction="up">
            <Input
              label="What's on your mind?"
              placeholder="A quiet thought…"
              value={text}
              onChangeText={setText}
              hint="Hint text appears here."
            />
          </Reveal>
          <View className="h-3" />
          <Reveal direction="up" delay={120}>
            <Input label="Email" placeholder="you@bloom.app" error="That doesn't look right." />
          </Reveal>
        </Section>

        <Section title="Toasts">
          <View className="flex-row flex-wrap gap-2">
            <Button size="sm" variant="soft" onPress={() => toast.show('Saved.', 'success')}>
              Success
            </Button>
            <Button size="sm" variant="secondary" onPress={() => toast.show('Heads up.', 'info')}>
              Info
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onPress={() => toast.show('Something wilted.', 'error')}
            >
              Error
            </Button>
          </View>
        </Section>

        <Section title="Bottom sheet">
          <Button onPress={() => sheetRef.current?.snapToIndex(0)}>Open sheet</Button>
        </Section>

        <Section title="PressScale">
          <View className="flex-row gap-3">
            <PressScale className="bg-ochre-100 px-5 py-4 rounded-petal">
              <Text className="font-body-medium text-ink">Tap me</Text>
            </PressScale>
            <PressScale className="bg-sage-200 px-5 py-4 rounded-petal" haptic="medium">
              <Text className="font-body-medium text-ink">Medium haptic</Text>
            </PressScale>
          </View>
        </Section>

        <Section title="Typography">
          <Text className="font-display text-4xl text-ink mb-1">Fraunces display</Text>
          <Text className="font-display-medium text-2xl text-ink mb-2">Fraunces medium</Text>
          <Text className="font-body text-base text-ink">Inter Tight body, regular.</Text>
          <Text className="font-body-medium text-base text-ink">Inter Tight medium.</Text>
          <Text className="font-body-bold text-base text-ink">Inter Tight bold.</Text>
        </Section>

        <View className="h-20" />
      </ScrollView>

      <Sheet ref={sheetRef} snapPoints={['40%', '85%']}>
        <Text className="font-display text-2xl text-ink mb-2">Sheet preview</Text>
        <Text className="font-body text-sm text-ink-100 mb-6">
          Drag down to dismiss. The LogEntryModal and CalendarDay detail use this primitive.
        </Text>
        <Button onPress={() => sheetRef.current?.close()}>Close</Button>
      </Sheet>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-8">
      <Text className="font-display-medium text-base text-ink-100 mb-3 uppercase tracking-widest">
        {title}
      </Text>
      {children}
    </View>
  );
}
