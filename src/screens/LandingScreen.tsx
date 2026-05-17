import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { BloomCanvas } from '@/components/bloom';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

export function LandingScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <Atmosphere intensity="rich" />

      <View className="flex-1 items-center justify-center px-6">
        <BloomCanvas
          width={240}
          height={240}
          phase="follicular"
          dayInPhase={4}
          showPollen={false}
        />

        <View className="h-6" />

        <SplitText
          style={{
            fontFamily: fonts.displayBold,
            fontSize: 52,
            color: colors.ink,
            lineHeight: 58,
          }}
          stagger={60}
        >
          bloom
        </SplitText>

        <View className="h-2" />

        <Reveal direction="up" delay={400}>
          <Text className="font-body text-base text-ink-100 text-center max-w-xs">
            A botanical period tracker.{'\n'}For yourself, for your person.
          </Text>
        </Reveal>

        <View className="h-10" />

        <Reveal direction="up" delay={700}>
          <Button size="lg" onPress={() => nav.navigate('Onboarding')}>
            Begin
          </Button>
        </Reveal>

        <View className="h-3" />

        <Reveal direction="fade" delay={1100}>
          <Button variant="ghost" size="sm" onPress={() => nav.navigate('SignIn')}>
            Already have an account? Sign in
          </Button>
        </Reveal>
      </View>
    </SafeAreaView>
  );
}
