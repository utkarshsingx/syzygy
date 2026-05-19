import type { SharedValue } from 'react-native-reanimated';

export type StickerId = 'Pip' | 'Sunny' | 'Moonie' | 'BloomSpirit' | 'Dev';

export const STICKER_IDS: readonly StickerId[] = [
  'Pip',
  'Sunny',
  'Moonie',
  'BloomSpirit',
  'Dev',
] as const;

export type StickerMode =
  | 'idle'
  | 'singing'
  | 'dancing'
  | 'hugging'
  | 'sleeping'
  | 'cheering'
  | 'sad';

export type StickerParams = {
  mouthOpen: SharedValue<number>;
  bodyBob: SharedValue<number>;
  headTilt: SharedValue<number>;
  eyeBlink: SharedValue<number>;
  glow: SharedValue<number>;
  scale: SharedValue<number>;
};

export type StickerCharacterProps = {
  size: number;
  params: StickerParams;
  tint?: string;
};

export type FloaterState = {
  stickerId: StickerId;
  mode: StickerMode;
  position?: 'bottom-right' | 'bottom-center' | 'center';
  bpm?: number;
};
