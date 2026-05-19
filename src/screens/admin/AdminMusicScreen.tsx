import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { useIsAdmin } from '@/auth/useIsAdmin';
import { musicRepo } from '@/data/music.repo';
import { TRACK_MOODS, type Track, type TrackMood } from '@/types/music';
import { STICKER_IDS, type StickerId } from '@/components/stickers/types';
import { Sticker } from '@/components/stickers/Sticker';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

export function AdminMusicScreen() {
  const toast = useToast();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bpmText, setBpmText] = useState('90');
  const [mood, setMood] = useState<TrackMood>('soothing');
  const [stickerId, setStickerId] = useState<StickerId>('Pip');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    const unsub = musicRepo.subscribe(setTracks);
    return unsub;
  }, [isAdmin]);

  async function onSave() {
    if (!user) return;
    const bpm = Number.parseInt(bpmText, 10);
    if (!title.trim() || !artist.trim() || !audioUrl.trim()) {
      toast.show('Title, artist, and audio URL are required.', 'error');
      return;
    }
    if (!Number.isFinite(bpm) || bpm < 30 || bpm > 240) {
      toast.show('BPM must be between 30 and 240.', 'error');
      return;
    }
    setSaving(true);
    try {
      await musicRepo.create({
        title: title.trim(),
        artist: artist.trim(),
        audioUrl: audioUrl.trim(),
        coverUrl: coverUrl.trim() || null,
        durationMs: null,
        bpm,
        mood,
        stickerId,
        addedBy: user.uid,
      });
      toast.show('Track added.', 'success');
      setTitle('');
      setArtist('');
      setAudioUrl('');
      setCoverUrl('');
      setBpmText('90');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  }

  function onDelete(t: Track) {
    Alert.alert('Delete track?', `Remove "${t.title}" from the library?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await musicRepo.delete(t.id);
            toast.show('Removed.', 'info');
          } catch (e) {
            toast.show(e instanceof Error ? e.message : 'Delete failed.', 'error');
          }
        },
      },
    ]);
  }

  if (!isAdmin) {
    return (
      <SafeAreaView className="flex-1" edges={['top']}>
        <Atmosphere intensity="subtle" />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="font-display-medium text-lg text-ink mb-2">Admin only</Text>
          <Text className="font-body text-sm text-ink-100 text-center">
            You don’t have permission to manage the music library.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 26, color: colors.ink }} className="px-2 mb-4">
          Music library
        </Text>

        <Card className="mb-4">
          <Text className="font-display-medium text-base text-ink mb-3">Add a track</Text>
          <Input label="Title" value={title} onChangeText={setTitle} containerClassName="mb-3" />
          <Input label="Artist" value={artist} onChangeText={setArtist} containerClassName="mb-3" />
          <Input
            label="Audio URL"
            value={audioUrl}
            onChangeText={setAudioUrl}
            placeholder="https://.../song.mp3"
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-3"
          />
          <Input
            label="Cover URL (optional)"
            value={coverUrl}
            onChangeText={setCoverUrl}
            placeholder="https://.../cover.jpg"
            autoCapitalize="none"
            autoCorrect={false}
            containerClassName="mb-3"
          />
          <Input
            label="BPM"
            value={bpmText}
            onChangeText={setBpmText}
            keyboardType="number-pad"
            hint="Drives the sticker’s bop. Typical: 60 ambient, 90 mellow, 120 upbeat."
            containerClassName="mb-3"
          />

          <Text className="font-body-medium text-sm text-ink mb-1.5">Mood</Text>
          <View className="flex-row flex-wrap gap-2 mb-3">
            {TRACK_MOODS.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={mood === m ? 'primary' : 'secondary'}
                onPress={() => setMood(m)}
              >
                {m}
              </Button>
            ))}
          </View>

          <Text className="font-body-medium text-sm text-ink mb-1.5">Sticker</Text>
          <View className="flex-row flex-wrap gap-3 mb-4">
            {STICKER_IDS.map((id) => (
              <View
                key={id}
                className={
                  'items-center p-2 rounded-soft border ' +
                  (stickerId === id ? 'border-terracotta' : 'border-paper')
                }
              >
                <View pointerEvents="none">
                  <Sticker id={id} size={56} />
                </View>
                <Button
                  size="sm"
                  variant={stickerId === id ? 'primary' : 'ghost'}
                  onPress={() => setStickerId(id)}
                  className="mt-1"
                >
                  {id}
                </Button>
              </View>
            ))}
          </View>

          <Button onPress={onSave} loading={saving} disabled={saving}>
            Add track
          </Button>
        </Card>

        <Text className="font-display-medium text-base text-ink mb-2 px-2">
          Library ({tracks.length})
        </Text>
        {tracks.length === 0 ? (
          <Text className="font-body text-sm text-ink-100/70 px-2">No tracks yet.</Text>
        ) : (
          tracks.map((t) => (
            <Card key={t.id} className="mb-2">
              <View className="flex-row items-center">
                <Sticker id={t.stickerId} size={48} bpm={t.bpm} mode="idle" />
                <View className="flex-1 ml-3">
                  <Text className="font-body-semibold text-base text-ink">{t.title}</Text>
                  <Text className="font-body text-xs text-ink-100">
                    {t.artist} · {t.bpm} bpm · {t.mood}
                  </Text>
                </View>
                <Button size="sm" variant="ghost" onPress={() => onDelete(t)}>
                  Remove
                </Button>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
