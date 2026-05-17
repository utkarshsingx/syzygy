import { useRef, useState, useMemo } from 'react';
import { View, Text, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import Slider from '@react-native-community/slider';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { format, subDays } from 'date-fns';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { BloomCanvas } from '@/components/bloom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { useToast } from '@/components/ui/Toast';
import { useUserStore } from '@/stores/useUserStore';
import { useAuth } from '@/auth/AuthProvider';
import { cyclesRepo } from '@/data/cycles.repo';
import { usersRepo } from '@/data/users.repo';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';
import type { CyclePhase } from '@/types';

// Across the 4 steps the bloom incrementally opens — visual progress signal.
const STEP_PHASE_HINTS: Array<{ phase: CyclePhase; dayInPhase: number }> = [
  { phase: 'menstrual', dayInPhase: 3 },
  { phase: 'follicular', dayInPhase: 4 },
  { phase: 'ovulation', dayInPhase: 1 },
  { phase: 'luteal', dayInPhase: 2 },
];

export function OnboardingScreen() {
  const pager = useRef<PagerView>(null);
  const [page, setPage] = useState(0);
  const { width } = useWindowDimensions();
  const toast = useToast();

  const [name, setName] = useState('');
  const [periodStart, setPeriodStart] = useState<Date>(subDays(new Date(), 7));
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
  const [cycleLength, setCycleLength] = useState(28);
  const [notifEnabled, setNotifEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);

  const { user } = useAuth();
  const setOnboarded = useUserStore((s) => s.setOnboarded);
  const setStoredName = useUserStore((s) => s.setName);

  const goNext = () => {
    if (page < 3) pager.current?.setPage(page + 1);
  };
  const goBack = () => {
    if (page > 0) pager.current?.setPage(page - 1);
  };

  async function requestNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifEnabled(status === 'granted');
  }

  async function finish() {
    if (!user) {
      toast.show('Auth not ready — try again in a moment.', 'error');
      return;
    }
    setSaving(true);
    try {
      const dateISO = format(periodStart, 'yyyy-MM-dd');
      // Record the user's first known period start as a CycleEntry.
      await cyclesRepo.upsert(user.uid, {
        dateISO,
        isPeriodStart: true,
        flow: 'medium',
      });
      // Update the user profile with display name + initial cycle settings.
      await usersRepo.upsert({
        uid: user.uid,
        displayName: name || 'Friend',
        email: user.email ?? null,
        notificationPrefs: {
          remindBeforePeriodDays: 2,
          dailyLogReminder: false,
          partnerSummons: true,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setStoredName(name || 'Friend');
      setOnboarded(true);
    } catch (e) {
      toast.show(
        e instanceof Error ? e.message : 'Failed to save onboarding data.',
        'error',
      );
    } finally {
      setSaving(false);
    }
  }

  const bloomSize = Math.min(width * 0.7, 260);
  const { phase, dayInPhase } = STEP_PHASE_HINTS[page] ?? STEP_PHASE_HINTS[1]!;
  const canContinue = useMemo(() => {
    if (page === 0) return name.trim().length > 0;
    return true;
  }, [page, name]);

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <Atmosphere intensity="medium" />

      <View className="items-center pt-6">
        <BloomCanvas
          width={bloomSize}
          height={bloomSize}
          phase={phase}
          dayInPhase={dayInPhase}
          showPollen={false}
        />
      </View>

      <PagerView
        ref={pager}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        <View key="0" className="px-8 pt-6">
          <SplitText
            style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          >
            What should we call you?
          </SplitText>
          <Reveal direction="up" delay={300}>
            <Text className="font-body text-sm text-ink-100 mt-2 mb-6">
              Used in your greeting and shared with your partner if you link.
            </Text>
            <Input
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoFocus
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={goNext}
            />
          </Reveal>
        </View>

        <View key="1" className="px-8 pt-6">
          <SplitText
            style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          >
            When did your last period start?
          </SplitText>
          <Reveal direction="up" delay={300}>
            <Text className="font-body text-sm text-ink-100 mt-2 mb-6">
              Predictions sharpen as you log more cycles.
            </Text>
            {Platform.OS === 'android' ? (
              <Button variant="secondary" onPress={() => setShowPicker(true)}>
                {format(periodStart, 'EEEE, MMMM d')}
              </Button>
            ) : null}
            {showPicker ? (
              <DateTimePicker
                value={periodStart}
                mode="date"
                maximumDate={new Date()}
                minimumDate={subDays(new Date(), 365)}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(_e: DateTimePickerEvent, d?: Date) => {
                  if (Platform.OS === 'android') setShowPicker(false);
                  if (d) setPeriodStart(d);
                }}
              />
            ) : null}
          </Reveal>
        </View>

        <View key="2" className="px-8 pt-6">
          <SplitText
            style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          >
            How long is a typical cycle?
          </SplitText>
          <Reveal direction="up" delay={300}>
            <Text className="font-body text-sm text-ink-100 mt-2 mb-8">
              Counted from one period start to the next. Most cycles fall between
              26 and 32 days.
            </Text>
            <View className="items-center">
              <Text className="font-display text-5xl text-ink mb-2">
                {cycleLength}
              </Text>
              <Text className="font-body text-xs text-ink-100/70">days</Text>
            </View>
            <Slider
              minimumValue={18}
              maximumValue={45}
              step={1}
              value={cycleLength}
              onValueChange={setCycleLength}
              minimumTrackTintColor={colors.terracotta}
              maximumTrackTintColor={colors.paper}
              thumbTintColor={colors.terracotta}
              style={{ width: '100%', marginTop: 24 }}
            />
          </Reveal>
        </View>

        <View key="3" className="px-8 pt-6">
          <SplitText
            style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          >
            A gentle nudge?
          </SplitText>
          <Reveal direction="up" delay={300}>
            <Text className="font-body text-sm text-ink-100 mt-2 mb-6">
              We&apos;ll let you know when your period is two days out. No spam.
            </Text>
            <Button
              variant={notifEnabled === true ? 'primary' : 'secondary'}
              onPress={requestNotifications}
            >
              {notifEnabled === true
                ? 'Notifications on'
                : notifEnabled === false
                  ? 'Try again — denied'
                  : 'Enable notifications'}
            </Button>
            <Text className="font-body text-xs text-ink-100/60 text-center mt-3">
              You can change this anytime in Settings.
            </Text>
          </Reveal>
        </View>
      </PagerView>

      <View className="flex-row items-center justify-between px-6 pb-4">
        <Button
          variant="ghost"
          size="sm"
          onPress={goBack}
          disabled={page === 0}
        >
          Back
        </Button>

        <View className="flex-row gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className="h-1.5 rounded-pill"
              style={{
                width: i === page ? 20 : 6,
                backgroundColor: i === page ? colors.terracotta : colors.paper,
              }}
            />
          ))}
        </View>

        {page < 3 ? (
          <Button size="sm" onPress={goNext} disabled={!canContinue}>
            Next
          </Button>
        ) : (
          <Button size="sm" onPress={finish} loading={saving}>
            Begin
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}
