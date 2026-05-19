import type { ComponentType } from 'react';
import type { StickerCharacterProps, StickerId } from './types';
import { Pip } from './characters/Pip';
import { Sunny } from './characters/Sunny';
import { Moonie } from './characters/Moonie';
import { BloomSpirit } from './characters/BloomSpirit';
import { Dev } from './characters/Dev';

const characters: Record<StickerId, ComponentType<StickerCharacterProps>> = {
  Pip,
  Sunny,
  Moonie,
  BloomSpirit,
  Dev,
};

export function getStickerCharacter(id: StickerId): ComponentType<StickerCharacterProps> {
  return characters[id] ?? Pip;
}

export const STICKER_LABELS: Record<StickerId, string> = {
  Pip: 'Pip',
  Sunny: 'Sunny',
  Moonie: 'Moonie',
  BloomSpirit: 'Bloom Spirit',
  Dev: 'Dev',
};
