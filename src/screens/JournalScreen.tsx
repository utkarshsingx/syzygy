import { useRef } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Card } from '@/components/ui/Card';
import { JournalEntry } from '@/components/journal/JournalEntry';
import { JournalComposer, type JournalComposerHandle } from '@/components/journal/JournalComposer';
import { QuickLogFAB } from '@/components/log/QuickLogFAB';
import { Sticker } from '@/components/stickers/Sticker';
import { useJournalStore } from '@/stores/useJournalStore';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

export function JournalScreen() {
  const entries = useJournalStore((s) => s.entries);
  const composer = useRef<JournalComposerHandle>(null);

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />

      <View className="px-6 pt-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}>
            Journal
          </Text>
          <Text className="font-body text-sm text-ink-100/80 mt-1 mb-4">
            {entries.length === 0
              ? 'A small inbox for your inner weather.'
              : `${entries.length} entr${entries.length === 1 ? 'y' : 'ies'}.`}
          </Text>
        </View>
        <Sticker id="Moonie" mode="idle" size={64} />
      </View>

      <FlatList
        data={entries}
        keyExtractor={(e) => e.id ?? String(e.createdAt)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 140 }}
        renderItem={({ item }) => <JournalEntry entry={item} />}
        ListEmptyComponent={
          <Card tone="tinted" className="mx-2 mt-4">
            <Text className="font-display-medium text-base text-ink mb-2">
              Nothing yet
            </Text>
            <Text className="font-body text-sm text-ink-100">
              Tap the + to write a thought.
            </Text>
          </Card>
        }
      />

      <QuickLogFAB onPress={() => composer.current?.open()} />
      <JournalComposer ref={composer} />
    </SafeAreaView>
  );
}
