import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { PressScale } from '@/components/motion/PressScale';
import { Button } from '@/components/ui/Button';
import { Sticker } from '@/components/stickers/Sticker';
import { useMusicStore } from '@/stores/useMusicStore';
import { MusicPlayer, type MusicPlayerHandle } from './MusicPlayer';
import { colors } from '@/theme/colors';

export function MiniPlayer() {
  const currentTrack = useMusicStore((s) => s.currentTrack);
  const playing = useMusicStore((s) => s.playing);
  const toggle = useMusicStore((s) => s.toggle);
  const openCounter = useMusicStore((s) => s.openPlayerCounter);
  const playerRef = useRef<MusicPlayerHandle>(null);

  useEffect(() => {
    if (openCounter > 0) {
      playerRef.current?.open();
    }
  }, [openCounter]);

  return (
    <>
      {currentTrack ? (
        <View
          pointerEvents="box-none"
          style={{ position: 'absolute', left: 12, right: 12, bottom: 78 }}
        >
          <PressScale onPress={() => playerRef.current?.open()}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.paper,
                borderRadius: 24,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: `${colors.ink}1A`,
              }}
            >
              <Sticker
                id={currentTrack.stickerId}
                mode={playing ? 'singing' : 'idle'}
                bpm={currentTrack.bpm}
                size={42}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text className="font-body-semibold text-sm text-ink" numberOfLines={1}>
                  {currentTrack.title}
                </Text>
                <Text className="font-body text-xs text-ink-100" numberOfLines={1}>
                  {currentTrack.artist}
                </Text>
              </View>
              <Button size="sm" variant="ghost" onPress={toggle}>
                {playing ? 'Pause' : 'Play'}
              </Button>
            </View>
          </PressScale>
        </View>
      ) : null}
      <MusicPlayer ref={playerRef} />
    </>
  );
}
