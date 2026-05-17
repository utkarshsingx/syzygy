import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/stores/useUserStore';

export function LandingScreen() {
  const setOnboarded = useUserStore((s) => s.setOnboarded);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-5xl text-ink mb-3">bloom</Text>
        <Text className="font-body text-base text-ink-100 text-center mb-12">
          A botanical period tracker.{'\n'}For yourself, for your person.
        </Text>
        <Pressable
          onPress={() => setOnboarded(true)}
          className="bg-terracotta rounded-petal px-8 py-4"
        >
          <Text className="font-body-semibold text-cream text-base">Begin</Text>
        </Pressable>
        <Text className="font-body text-xs text-ink-50 mt-8">
          M1 placeholder — Onboarding flow lands in M5.
        </Text>
      </View>
    </SafeAreaView>
  );
}
