import { create } from 'zustand';
import type { Track } from '@/types/music';
import { musicPlayer } from '@/audio/player';

type MusicState = {
  tracks: Track[];
  currentTrack: Track | null;
  playing: boolean;
  positionMs: number;
  durationMs: number;
  openPlayerCounter: number;
  setTracks: (t: Track[]) => void;
  play: (t: Track) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  toggle: () => Promise<void>;
  seek: (ms: number) => Promise<void>;
  stop: () => Promise<void>;
  requestPlayerOpen: () => void;
  _setStatus: (s: { positionMs: number; durationMs: number; playing: boolean }) => void;
};

export const useMusicStore = create<MusicState>((set, get) => {
  musicPlayer.onStatus((s) => {
    get()._setStatus({ positionMs: s.positionMs, durationMs: s.durationMs, playing: s.playing });
    if (s.didFinish) {
      set({ playing: false, positionMs: 0 });
    }
  });

  return {
    tracks: [],
    currentTrack: null,
    playing: false,
    positionMs: 0,
    durationMs: 0,
    openPlayerCounter: 0,
    setTracks: (tracks) => set({ tracks }),
    requestPlayerOpen: () =>
      set((s) => ({ openPlayerCounter: s.openPlayerCounter + 1 })),
    play: async (track) => {
      set((s) => ({
        currentTrack: track,
        playing: true,
        openPlayerCounter: s.openPlayerCounter + 1,
      }));
      await musicPlayer.loadAndPlay(track);
    },
    pause: async () => {
      set({ playing: false });
      await musicPlayer.pause();
    },
    resume: async () => {
      set({ playing: true });
      await musicPlayer.resume();
    },
    toggle: async () => {
      const { playing, currentTrack } = get();
      if (!currentTrack) return;
      if (playing) {
        set({ playing: false });
        await musicPlayer.pause();
      } else {
        set({ playing: true });
        await musicPlayer.resume();
      }
    },
    seek: async (ms) => {
      await musicPlayer.seek(ms);
    },
    stop: async () => {
      set({ currentTrack: null, playing: false, positionMs: 0, durationMs: 0 });
      await musicPlayer.stop();
    },
    _setStatus: (s) => set(s),
  };
});
