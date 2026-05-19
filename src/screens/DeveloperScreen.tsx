import { useState } from 'react';
import { ScrollView, View, Text, Linking, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Card } from '@/components/ui/Card';
import { Sticker } from '@/components/stickers/Sticker';
import { useFxStore } from '@/stores/useFxStore';
import type { StickerMode } from '@/components/stickers/types';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

type Link = { label: string; url: string };

const LINKS: readonly Link[] = [
  { label: 'GitHub', url: 'https://github.com/utkarshsingxx' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/utkarshsingxx' },
  { label: 'Email', url: 'mailto:hi@bloom.app' },
] as const;

const CREDITS = [
  'React Native',
  'Expo SDK 54',
  'Reanimated',
  'Firebase',
  'Zustand',
  'NativeWind',
] as const;

export function DeveloperScreen() {
  const [mode, setMode] = useState<StickerMode>('cheering');
  const fireBurst = useFxStore((s) => s.fireBurst);

  function onLongPress() {
    setMode((m) => (m === 'dancing' ? 'cheering' : 'dancing'));
    fireBurst();
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="medium" />
      <ScrollView contentContainerStyle={{ paddingBottom: 64 }}>
        <View className="items-center mt-6">
          <Pressable onLongPress={onLongPress} delayLongPress={350}>
            <Sticker id="Dev" mode={mode} size={200} bpm={110} />
          </Pressable>
        </View>

        <View className="px-6 mt-6">
          <Text
            style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink, textAlign: 'center' }}
          >
            Made by Utkarsh.
          </Text>
          <Text className="font-body text-sm text-ink-100/80 text-center mt-1">
            Long-press the sticker for a little surprise.
          </Text>

          <Card className="mt-6">
            <Text className="font-display-medium text-base text-ink mb-2">
              Why syzygy exists
            </Text>
            <Text className="font-body text-sm text-ink-100">
              syzygy is a quiet companion for cycles — three bodies aligning,
              gentle predictions, a soft place to log how you feel, and now a
              small concert when the days feel heavy. I built it because most
              period apps shout. This one tries to listen.
            </Text>
          </Card>

          <Card className="mt-3">
            <Text className="font-display-medium text-base text-ink mb-2">Find me</Text>
            <View className="flex-row flex-wrap gap-2">
              {LINKS.map((l) => (
                <Pressable
                  key={l.label}
                  onPress={() => Linking.openURL(l.url)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: colors.terracotta,
                  }}
                >
                  <Text className="font-body-medium text-sm text-cream">{l.label}</Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Card className="mt-3">
            <Text className="font-display-medium text-base text-ink mb-2">Made with</Text>
            <View className="flex-row flex-wrap gap-2">
              {CREDITS.map((c) => (
                <View
                  key={c}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor: colors.paper,
                    borderWidth: 1,
                    borderColor: `${colors.ink}1A`,
                  }}
                >
                  <Text className="font-body text-xs text-ink">{c}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
