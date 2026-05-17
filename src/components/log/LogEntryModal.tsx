import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { View, Text, ScrollView, TextInput } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { PressScale } from '@/components/motion/PressScale';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { cyclesRepo } from '@/data/cycles.repo';
import { useFxStore } from '@/stores/useFxStore';
import { colors } from '@/theme/colors';
import { MOODS, SYMPTOMS } from '@/types';
import type { Flow, Mood, Symptom } from '@/types';

export type LogEntryModalHandle = {
  open: (dateISO?: string) => void;
  close: () => void;
};

const FLOWS: Flow[] = ['spotting', 'light', 'medium', 'heavy'];

const FLOW_LABELS: Record<Flow, string> = {
  spotting: '· spot',
  light: '·· light',
  medium: '··· medium',
  heavy: '···· heavy',
};

const MOOD_LABELS: Record<Mood, string> = {
  radiant: '🌼 radiant',
  peaceful: '☁️ peaceful',
  tender: '🌸 tender',
  tired: '🌙 tired',
  anxious: '🌀 anxious',
  sad: '🌧 sad',
  energetic: '⚡ energetic',
  emotional: '🌊 emotional',
};

const SYMPTOM_LABELS: Record<Symptom, string> = {
  cramps: 'Cramps',
  headache: 'Headache',
  bloating: 'Bloating',
  tender_breasts: 'Tender',
  fatigue: 'Fatigue',
  nausea: 'Nausea',
  acne: 'Acne',
  back_pain: 'Back pain',
  cravings: 'Cravings',
  insomnia: 'Insomnia',
};

export const LogEntryModal = forwardRef<LogEntryModalHandle>(function LogEntryModal(_, ref) {
  const sheetRef = useRef<BottomSheet>(null);
  const toast = useToast();
  const { user } = useAuth();

  const [dateISO, setDateISO] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [flow, setFlow] = useState<Flow | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [notes, setNotes] = useState('');
  const [isPeriodStart, setIsPeriodStart] = useState(false);
  const [saving, setSaving] = useState(false);

  useImperativeHandle(ref, () => ({
    open: (d?: string) => {
      const target = d ?? format(new Date(), 'yyyy-MM-dd');
      setDateISO(target);
      setFlow(null);
      setMood(null);
      setSymptoms([]);
      setNotes('');
      setIsPeriodStart(false);
      sheetRef.current?.snapToIndex(0);
    },
    close: () => sheetRef.current?.close(),
  }));

  const toggleSymptom = (s: Symptom) => {
    setSymptoms((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

  async function save() {
    if (!user) {
      toast.show('Sign in first.', 'error');
      return;
    }
    setSaving(true);
    try {
      await cyclesRepo.upsert(user.uid, {
        dateISO,
        flow,
        mood,
        symptoms,
        notes,
        isPeriodStart,
      });
      useFxStore.getState().fireBurst();
      toast.show('Logged.', 'success');
      sheetRef.current?.close();
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['85%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.cream }}
      handleIndicatorStyle={{ backgroundColor: colors.ink, opacity: 0.25, width: 48 }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} keyboardShouldPersistTaps="handled">
          <Text className="font-display text-2xl text-ink mb-1">Log entry</Text>
          <Text className="font-body text-sm text-ink-100/70 mb-5">
            {format(new Date(dateISO), 'EEEE, MMMM d')}
          </Text>

          <FieldLabel>Flow</FieldLabel>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {FLOWS.map((f) => (
              <Chip key={f} active={flow === f} onPress={() => setFlow(flow === f ? null : f)}>
                {FLOW_LABELS[f]}
              </Chip>
            ))}
          </View>

          <FieldLabel>Mood</FieldLabel>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {MOODS.map((m) => (
              <Chip key={m} active={mood === m} onPress={() => setMood(mood === m ? null : m)}>
                {MOOD_LABELS[m]}
              </Chip>
            ))}
          </View>

          <FieldLabel>Symptoms</FieldLabel>
          <View className="flex-row flex-wrap gap-2 mb-5">
            {SYMPTOMS.map((s) => (
              <Chip key={s} active={symptoms.includes(s)} onPress={() => toggleSymptom(s)}>
                {SYMPTOM_LABELS[s]}
              </Chip>
            ))}
          </View>

          <FieldLabel>Notes</FieldLabel>
          <TextInput
            placeholder="What did your body say?"
            placeholderTextColor={`${colors.ink}66`}
            multiline
            value={notes}
            onChangeText={setNotes}
            className="bg-paper/60 border border-ink-50/15 rounded-soft px-4 py-3 font-body text-base text-ink min-h-[88px] mb-5"
            style={{ textAlignVertical: 'top' }}
          />

          <FieldLabel>This is the first day of my period</FieldLabel>
          <View className="flex-row gap-2 mb-6">
            <Chip active={isPeriodStart} onPress={() => setIsPeriodStart(!isPeriodStart)}>
              {isPeriodStart ? 'Yes' : 'No'}
            </Chip>
          </View>

          <Button size="lg" onPress={save} loading={saving}>
            Save
          </Button>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

function FieldLabel({ children }: { children: string }) {
  return (
    <Text className="font-display-medium text-xs text-ink-100 uppercase tracking-widest mb-2">
      {children}
    </Text>
  );
}

function Chip({
  active,
  onPress,
  children,
}: {
  active: boolean;
  onPress: () => void;
  children: string;
}) {
  return (
    <PressScale
      onPress={onPress}
      className={
        active
          ? 'bg-terracotta px-3 py-2 rounded-pill'
          : 'bg-paper border border-ink-50/15 px-3 py-2 rounded-pill'
      }
    >
      <Text
        className={
          active ? 'font-body-medium text-sm text-cream' : 'font-body text-sm text-ink'
        }
      >
        {children}
      </Text>
    </PressScale>
  );
}
