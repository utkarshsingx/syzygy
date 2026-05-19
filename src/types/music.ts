import type { StickerId } from '@/components/stickers/types';

export type TrackMood = 'soothing' | 'uplifting' | 'energetic' | 'dreamy';

export const TRACK_MOODS: readonly TrackMood[] = [
  'soothing',
  'uplifting',
  'energetic',
  'dreamy',
] as const;

export type Track = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;        // public HTTPS URL to mp3
  coverUrl?: string | null;
  durationMs?: number | null;
  bpm: number;
  mood: TrackMood;
  stickerId: StickerId;
  addedBy: string;
  createdAt: number;
};
