import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { useUserStore } from '@/stores/useUserStore';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

export function LandingScreen() {
  const setOnboarded = useUserStore((s) => s.setOnboarded);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <Atmosphere intensity="rich" />

      <View className="flex-1 items-center justify-center px-6">
        <SplitText
          style={{ fontFamily: fonts.displayBold, fontSize: 56, color: colors.ink, lineHeight: 60 }}
          stagger={60}
        >
          bloom
        </SplitText>

        <View className="h-3" />

        <Reveal direction="up" delay={400}>
          <Text className="font-body text-base text-ink-100 text-center max-w-xs">
            A botanical period tracker.{'\n'}For yourself, for your person.
          </Text>
        </Reveal>

        <View className="h-12" />

        <Reveal direction="up" delay={700}>
          <Button size="lg" onPress={() => setOnboarded(true)}>
            Begin
          </Button>
        </Reveal>

        <View className="h-4" />

        <Reveal direction="fade" delay={1100}>
          <Text className="font-body text-xs text-ink-100/60">
            Already have an account? Sign in coming in M3.
          </Text>
        </Reveal>
      </View>
    </SafeAreaView>
  );
}
