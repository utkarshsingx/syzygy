import { create } from 'zustand';

// Ephemeral UI effect state (not persisted). Lives at the app root so
// celebrations survive modal dismissal.
type FxState = {
  burstCounter: number;
  fireBurst: () => void;
};

export const useFxStore = create<FxState>((set) => ({
  burstCounter: 0,
  fireBurst: () => set((s) => ({ burstCounter: s.burstCounter + 1 })),
}));
