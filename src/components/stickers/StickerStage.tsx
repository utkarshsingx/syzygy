import { View, Pressable } from 'react-native';
import { useStickerStore } from '@/stores/useStickerStore';
import { Sticker } from './Sticker';

// Floating sticker overlay. Mounted in GlobalFx so it sits above tabs and modals.
export function StickerStage() {
  const floater = useStickerStore((s) => s.activeFloater);
  const clear = useStickerStore((s) => s.clearFloater);
  if (!floater) return null;

  const position = floater.position ?? 'bottom-right';
  const style =
    position === 'bottom-right'
      ? { bottom: 96, right: 16 }
      : position === 'bottom-center'
        ? { bottom: 96, alignSelf: 'center' as const }
        : { top: '40%' as const, alignSelf: 'center' as const };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <View pointerEvents="box-none" style={{ position: 'absolute', ...style }}>
        <Pressable onLongPress={clear} hitSlop={8}>
          <Sticker
            id={floater.stickerId}
            mode={floater.mode}
            bpm={floater.bpm}
            size={96}
          />
        </Pressable>
      </View>
    </View>
  );
}
