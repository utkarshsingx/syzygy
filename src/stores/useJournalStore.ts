import { create } from 'zustand';
import type { JournalEntry } from '@/types';

type JournalState = {
  entries: JournalEntry[];
  loading: boolean;
  setEntries: (entries: JournalEntry[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useJournalStore = create<JournalState>((set) => ({
  entries: [],
  loading: false,
  setEntries: (entries) => set({ entries }),
  setLoading: (loading) => set({ loading }),
}));
