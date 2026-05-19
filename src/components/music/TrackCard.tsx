import { View, Text, Image } from 'react-native';
import { PressScale } from '@/components/motion/PressScale';
import { Sticker } from '@/components/stickers/Sticker';
import { colors } from '@/theme/colors';
import type { Track } from '@/types/music';

type Props = {
  track: Track;
  active?: boolean;
  onPress: () => void;
};

const moodTint: Record<string, string> = {
  soothing: colors.sage,
  uplifting: colors.ochre,
  energetic: colors.terracotta,
  dreamy: colors.roseDust,
};

export function TrackCard({ track, active, onPress }: Props) {
  const tint = moodTint[track.mood] ?? colors.terracotta;
  return (
    <PressScale onPress={onPress} className="w-[48%] mb-3">
      <View
        className="rounded-petal border border-ink-50/10 p-3 bg-paper/60"
        style={active ? { borderColor: tint, borderWidth: 2 } : undefined}
      >
        <View
          style={{
            aspectRatio: 1,
            borderRadius: 16,
            overflow: 'hidden',
            backgroundColor: `${tint}33`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {track.coverUrl ? (
            <Image
              source={{ uri: track.coverUrl }}
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Sticker
              id={track.stickerId}
              mode={active ? 'singing' : 'idle'}
              bpm={track.bpm}
              tint={tint}
              size={96}
            />
          )}
        </View>
        <Text
          className="font-body-semibold text-sm text-ink mt-2"
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text className="font-body text-xs text-ink-100" numberOfLines={1}>
          {track.artist} · {track.bpm} bpm
        </Text>
      </View>
    </PressScale>
  );
}
