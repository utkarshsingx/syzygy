import { useState } from 'react';
import { ScrollView, View, Text, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { useUserStore } from '@/stores/useUserStore';
import { useCycleStore } from '@/stores/useCycleStore';
import { usersRepo } from '@/data/users.repo';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

const PRIVACY_URL = 'https://bloom.app/privacy'; // TODO: actual URL in M8

export function SettingsScreen() {
  const toast = useToast();
  const { user, status, signOut, deleteAccount } = useAuth();
  const periodData = useCycleStore((s) => s.periodData);
  const reducedMotionOverride = useUserStore((s) => s.reducedMotionOverride);
  const setReducedMotionOverride = useUserStore((s) => s.setReducedMotionOverride);
  const bloomQuality = useUserStore((s) => s.bloomQuality);
  const setBloomQuality = useUserStore((s) => s.setBloomQuality);
  const storedName = useUserStore((s) => s.name);
  const setStoredName = useUserStore((s) => s.setName);
  const reset = useUserStore((s) => s.reset);

  const [name, setName] = useState(storedName);
  const [savingName, setSavingName] = useState(false);

  async function saveName() {
    if (!user || !name.trim()) return;
    setSavingName(true);
    try {
      await usersRepo.upsert({
        uid: user.uid,
        displayName: name.trim(),
        email: user.email ?? null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setStoredName(name.trim());
      toast.show('Saved.', 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Save failed.', 'error');
    } finally {
      setSavingName(false);
    }
  }

  function confirmSignOut() {
    Alert.alert('Sign out?', 'You can sign back in any time.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            toast.show('Signed out.', 'info');
          } catch (e) {
            toast.show(e instanceof Error ? e.message : 'Sign-out failed.', 'error');
          }
        },
      },
    ]);
  }

  function confirmDelete() {
    Alert.alert(
      'Delete account?',
      'This permanently removes your data. We can’t recover it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              toast.show('Account deleted.', 'info');
            } catch (e) {
              toast.show(
                e instanceof Error ? e.message : 'Deletion failed — try sign-in then retry.',
                'error',
              );
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text
          style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          className="px-2 mb-5"
        >
          Settings
        </Text>

        {/* Profile */}
        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Profile</Text>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            autoCapitalize="words"
            containerClassName="mb-3"
          />
          <Button
            size="sm"
            variant="secondary"
            onPress={saveName}
            loading={savingName}
            disabled={!name.trim() || name.trim() === storedName}
          >
            Save name
          </Button>
          <Text className="font-body text-xs text-ink-100/60 mt-3">
            {user?.email
              ? `Signed in as ${user.email}`
              : status === 'anonymous'
                ? 'Signed in anonymously — data lives on this device until you sign in.'
                : ''}
          </Text>
        </Card>

        {/* Cycle */}
        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Cycle</Text>
          {periodData?.lastPeriodStart ? (
            <>
              <Row label="Average cycle" value={`${periodData.cycleLengthAvg} days`} />
              <Row label="Average period" value={`${periodData.periodLengthAvg} days`} />
              <Row
                label="Last period start"
                value={periodData.lastPeriodStart}
              />
              <Row
                label="Cycles logged"
                value={String(periodData.history?.length ?? 0)}
              />
            </>
          ) : (
            <Text className="font-body text-sm text-ink-100">
              No periods logged yet.
            </Text>
          )}
        </Card>

        {/* Appearance */}
        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Appearance</Text>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1 pr-3">
              <Text className="font-body text-base text-ink">Reduce motion</Text>
              <Text className="font-body text-xs text-ink-100/70">
                Skip springs, particles, and grain. Mirrors OS unless overridden.
              </Text>
            </View>
            <Switch
              value={reducedMotionOverride === true}
              onValueChange={(v) => setReducedMotionOverride(v ? true : null)}
            />
          </View>
          <Text className="font-body text-base text-ink mb-2">Bloom quality</Text>
          <View className="flex-row gap-2">
            {(['auto', 'high', 'low'] as const).map((q) => (
              <Button
                key={q}
                size="sm"
                variant={bloomQuality === q ? 'primary' : 'secondary'}
                onPress={() => setBloomQuality(q)}
              >
                {q}
              </Button>
            ))}
          </View>
        </Card>

        {/* Privacy */}
        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Privacy</Text>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => Linking.openURL(PRIVACY_URL)}
          >
            Privacy policy
          </Button>
        </Card>

        {/* Account */}
        <Card className="mb-3">
          <Text className="font-display-medium text-base text-ink mb-3">Account</Text>
          {status === 'authenticated' ? (
            <Button size="sm" variant="secondary" onPress={confirmSignOut} className="mb-2">
              Sign out
            </Button>
          ) : null}
          <Button
            size="sm"
            variant="secondary"
            onPress={confirmDelete}
            className="mb-2"
          >
            Delete account
          </Button>
          <Text className="font-body text-xs text-ink-100/60">
            Server-side data cascade lands in M6 — until then, deletion clears
            the local profile only.
          </Text>
        </Card>

        {__DEV__ ? (
          <View className="px-2 mt-2">
            <Button variant="ghost" size="sm" onPress={reset}>
              Reset onboarding (dev)
            </Button>
            <Text className="font-body text-xs text-ink-100/40 text-center mt-2">
              Long-press the Settings tab to open the component gallery.
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text className="font-body text-sm text-ink-100">{label}</Text>
      <Text className="font-body-medium text-sm text-ink">{value}</Text>
    </View>
  );
}
