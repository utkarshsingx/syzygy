import { create } from 'zustand';
import type { CoupleDoc, Message } from '@/types';

type PartnerState = {
  couple: CoupleDoc | null;
  messages: Message[];
  loading: boolean;
  setCouple: (couple: CoupleDoc | null) => void;
  setMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
};

export const usePartnerStore = create<PartnerState>((set) => ({
  couple: null,
  messages: [],
  loading: false,
  setCouple: (couple) => set({ couple }),
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
}));
