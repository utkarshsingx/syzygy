import { ScrollView, View, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/stores/useUserStore';

export function SettingsScreen() {
  const reset = useUserStore((s) => s.reset);
  const reducedMotionOverride = useUserStore((s) => s.reducedMotionOverride);
  const setReducedMotionOverride = useUserStore((s) => s.setReducedMotionOverride);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Text className="font-display text-3xl text-ink mb-6">Settings</Text>

        <Card className="mb-4">
          <Text className="font-display-medium text-base text-ink mb-3">Appearance</Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-body text-base text-ink">Reduce motion</Text>
              <Text className="font-body text-xs text-ink-100/70">
                Mirrors OS setting unless overridden.
              </Text>
            </View>
            <Switch
              value={reducedMotionOverride === true}
              onValueChange={(v) => setReducedMotionOverride(v ? true : null)}
            />
          </View>
        </Card>

        <Card className="mb-4">
          <Text className="font-display-medium text-base text-ink mb-3">Profile</Text>
          <Text className="font-body text-sm text-ink-100">
            Sign-in, account deletion, and partner unlink land in M3 + M7.
          </Text>
        </Card>

        <Card className="mb-4">
          <Text className="font-display-medium text-base text-ink mb-3">Data</Text>
          <Text className="font-body text-sm text-ink-100 mb-3">
            Reset onboarding state (dev only — full data wipe lands in M7).
          </Text>
          <Button variant="secondary" size="sm" onPress={reset}>
            Reset onboarding
          </Button>
        </Card>

        {__DEV__ ? (
          <Text className="font-body text-xs text-ink-100/50 text-center mt-4">
            Tip: long-press the Settings tab to open the component gallery.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
