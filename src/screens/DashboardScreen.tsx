import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/stores/useUserStore';

export function DashboardScreen() {
  const reset = useUserStore((s) => s.reset);

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="flex-1 px-6 pt-6">
        <Text className="font-display text-3xl text-ink mb-1">Good morning</Text>
        <Text className="font-body text-base text-ink-100 mb-8">
          Your bloom will live here.
        </Text>

        <View className="flex-1 items-center justify-center rounded-petal bg-paper/40 border border-paper">
          <Text className="font-display text-2xl text-ink mb-2">Bloom canvas</Text>
          <Text className="font-body text-sm text-ink-100 text-center px-8">
            Skia 2D peony with openness/wilt/glow morph lands in M4.
          </Text>
        </View>

        <Pressable
          onPress={reset}
          className="mt-6 self-center bg-ink-300/10 rounded-pill px-4 py-2"
        >
          <Text className="font-body text-xs text-ink-100">Reset onboarding (dev)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
