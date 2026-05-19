import { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Button } from '@/components/ui/Button';
import { Sticker } from '@/components/stickers/Sticker';
import { useMusicStore } from '@/stores/useMusicStore';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

export type MusicPlayerHandle = {
  open: () => void;
  close: () => void;
};

const moodTint: Record<string, string> = {
  soothing: colors.sage,
  uplifting: colors.ochre,
  energetic: colors.terracotta,
  dreamy: colors.roseDust,
};

export const MusicPlayer = forwardRef<MusicPlayerHandle>(function MusicPlayer(_, ref) {
  const sheetRef = useRef<BottomSheet>(null);
  const currentTrack = useMusicStore((s) => s.currentTrack);
  const playing = useMusicStore((s) => s.playing);
  const positionMs = useMusicStore((s) => s.positionMs);
  const durationMs = useMusicStore((s) => s.durationMs);
  const toggle = useMusicStore((s) => s.toggle);
  const stop = useMusicStore((s) => s.stop);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.snapToIndex(0),
    close: () => sheetRef.current?.close(),
  }));

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      pressBehavior="close"
    />
  );

  const tint = currentTrack ? moodTint[currentTrack.mood] ?? colors.terracotta : colors.terracotta;
  const progress = durationMs > 0 ? Math.min(1, positionMs / durationMs) : 0;

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={['92%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.cream }}
      handleIndicatorStyle={{ backgroundColor: colors.ink, opacity: 0.25, width: 48 }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 24, paddingTop: 8 }}>
        {currentTrack ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingBottom: 32 }}>
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Sticker
                id={currentTrack.stickerId}
                mode={playing ? 'singing' : 'idle'}
                bpm={currentTrack.bpm}
                tint={tint}
                size={220}
              />
            </View>

            <View style={{ alignItems: 'center', width: '100%' }}>
              <Text
                style={{ fontFamily: fonts.displayBold, fontSize: 24, color: colors.ink, textAlign: 'center' }}
                numberOfLines={2}
              >
                {currentTrack.title}
              </Text>
              <Text className="font-body text-base text-ink-100 mt-1">{currentTrack.artist}</Text>
              <Text className="font-body text-xs text-ink-100/70 mt-1">
                {currentTrack.mood} · {currentTrack.bpm} bpm
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: `${colors.ink}22`,
                  marginTop: 24,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    backgroundColor: tint,
                  }}
                />
              </View>
              <View className="flex-row justify-between w-full mt-1.5">
                <Text className="font-body text-xs text-ink-100/70">{formatMs(positionMs)}</Text>
                <Text className="font-body text-xs text-ink-100/70">{formatMs(durationMs)}</Text>
              </View>
            </View>

            <View className="flex-row gap-3 mt-2 items-center">
              <Button size="md" variant="secondary" onPress={stop}>
                Stop
              </Button>
              <Button size="lg" onPress={toggle}>
                {playing ? 'Pause' : 'Play'}
              </Button>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="font-body text-sm text-ink-100">Nothing playing.</Text>
          </View>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

function formatMs(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
