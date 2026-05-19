import { useStickerAnimation } from './useStickerAnimation';
import { getStickerCharacter } from './registry';
import type { StickerId, StickerMode } from './types';

type Props = {
  id: StickerId;
  mode?: StickerMode;
  size?: number;
  bpm?: number;
  tint?: string;
};

export function Sticker({ id, mode = 'idle', size = 96, bpm = 90, tint }: Props) {
  const params = useStickerAnimation(mode, bpm);
  const Character = getStickerCharacter(id);
  return <Character size={size} params={params} tint={tint} />;
}
