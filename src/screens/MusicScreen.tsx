import { useEffect, useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TrackCard } from '@/components/music/TrackCard';
import { Sticker } from '@/components/stickers/Sticker';
import { musicRepo } from '@/data/music.repo';
import { useMusicStore } from '@/stores/useMusicStore';
import { TRACK_MOODS, type Track, type TrackMood } from '@/types/music';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

export function MusicScreen() {
  const tracks = useMusicStore((s) => s.tracks);
  const setTracks = useMusicStore((s) => s.setTracks);
  const play = useMusicStore((s) => s.play);
  const current = useMusicStore((s) => s.currentTrack);
  const [filter, setFilter] = useState<TrackMood | null>(null);

  useEffect(() => {
    const unsub = musicRepo.subscribe(setTracks);
    return unsub;
  }, [setTracks]);

  const visible: Track[] = filter ? tracks.filter((t) => t.mood === filter) : tracks;

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="medium" />
      <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
        <View className="px-6 pt-4">
          <Text
            style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}
          >
            A small concert.
          </Text>
          <Text className="font-body text-sm text-ink-100/80 mt-1">
            Pick a song. Your sticker will sing it back.
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2 px-6 mt-4">
          <Button
            size="sm"
            variant={filter === null ? 'primary' : 'secondary'}
            onPress={() => setFilter(null)}
          >
            all
          </Button>
          {TRACK_MOODS.map((m) => (
            <Button
              key={m}
              size="sm"
              variant={filter === m ? 'primary' : 'secondary'}
              onPress={() => setFilter(m)}
            >
              {m}
            </Button>
          ))}
        </View>

        {visible.length === 0 ? (
          <Card tone="tinted" className="mx-6 mt-6 items-center" padded>
            <Sticker id="Moonie" mode="sleeping" size={96} />
            <Text className="font-display-medium text-base text-ink mt-3 text-center">
              The library is quiet right now.
            </Text>
            <Text className="font-body text-sm text-ink-100 text-center mt-1">
              Songs added by the admin will appear here. Come back soon.
            </Text>
          </Card>
        ) : (
          <View className="px-6 mt-4 flex-row flex-wrap justify-between">
            {visible.map((t) => (
              <TrackCard
                key={t.id}
                track={t}
                active={current?.id === t.id}
                onPress={() => play(t)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
