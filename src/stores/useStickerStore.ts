import { create } from 'zustand';
import type { FloaterState } from '@/components/stickers/types';

type StickerState = {
  activeFloater: FloaterState | null;
  setFloater: (f: FloaterState | null) => void;
  clearFloater: () => void;
};

export const useStickerStore = create<StickerState>((set) => ({
  activeFloater: null,
  setFloater: (activeFloater) => set({ activeFloater }),
  clearFloater: () => set({ activeFloater: null }),
}));
