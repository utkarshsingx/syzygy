import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { TextInput, View, Text, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { journalRepo } from '@/data/journal.repo';
import { colors } from '@/theme/colors';

export type JournalComposerHandle = {
  open: () => void;
  close: () => void;
};

export const JournalComposer = forwardRef<JournalComposerHandle>(function JournalComposer(_, ref) {
  const sheetRef = useRef<BottomSheet>(null);
  const inputRef = useRef<TextInput>(null);
  const { user } = useAuth();
  const toast = useToast();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setContent('');
      sheetRef.current?.snapToIndex(0);
      // Slight delay so the sheet is in place before keyboard pops.
      setTimeout(() => inputRef.current?.focus(), 250);
    },
    close: () => {
      Keyboard.dismiss();
      sheetRef.current?.close();
    },
  }));

  async function save() {
    if (!user) {
      toast.show('Sign in first.', 'error');
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) {
      toast.show('Write something first.', 'info');
      return;
    }
    setSaving(true);
    try {
      await journalRepo.create(user.uid, {
        type: 'note',
        content: trimmed,
      });
      toast.show('Saved.', 'success');
      Keyboard.dismiss();
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
      snapPoints={['65%']}
      enablePanDownToClose
      keyboardBehavior="interactive"
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.cream }}
      handleIndicatorStyle={{ backgroundColor: colors.ink, opacity: 0.25, width: 48 }}
    >
      <BottomSheetView style={{ flex: 1, padding: 20 }}>
        <Text className="font-display text-2xl text-ink mb-1">A quiet thought</Text>
        <Text className="font-body text-sm text-ink-100/70 mb-4">
          For you — or eventually for your person, if you link a partner.
        </Text>
        <TextInput
          ref={inputRef}
          multiline
          placeholder="Write something gentle…"
          placeholderTextColor={`${colors.ink}55`}
          selectionColor={colors.terracotta}
          value={content}
          onChangeText={setContent}
          className="bg-paper/60 border border-ink-50/15 rounded-soft px-4 py-3 font-body text-base text-ink flex-1 mb-3"
          style={{ textAlignVertical: 'top', minHeight: 160 }}
        />
        <View className="flex-row gap-2">
          <Button
            variant="ghost"
            size="md"
            onPress={() => sheetRef.current?.close()}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button size="md" onPress={save} loading={saving} className="flex-1">
            Save
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});
