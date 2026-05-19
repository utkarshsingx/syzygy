import { Audio, type AVPlaybackStatus, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import type { Track } from '@/types/music';

type StatusCb = (status: { positionMs: number; durationMs: number; playing: boolean; didFinish: boolean }) => void;

class MusicPlayer {
  private sound: Audio.Sound | null = null;
  private currentId: string | null = null;
  private statusCb: StatusCb | null = null;
  private modeReady = false;

  async ensureMode() {
    if (this.modeReady) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      });
      this.modeReady = true;
    } catch (e) {
      if (__DEV__) console.warn('[player.ensureMode]', e);
    }
  }

  onStatus(cb: StatusCb | null) {
    this.statusCb = cb;
  }

  private handleStatus = (s: AVPlaybackStatus) => {
    if (!this.statusCb) return;
    if (!s.isLoaded) {
      this.statusCb({ positionMs: 0, durationMs: 0, playing: false, didFinish: false });
      return;
    }
    this.statusCb({
      positionMs: s.positionMillis ?? 0,
      durationMs: s.durationMillis ?? 0,
      playing: s.isPlaying ?? false,
      didFinish: s.didJustFinish ?? false,
    });
  };

  async loadAndPlay(track: Track) {
    await this.ensureMode();
    if (this.sound && this.currentId !== track.id) {
      try {
        await this.sound.unloadAsync();
      } catch {
        // ignore
      }
      this.sound = null;
    }
    if (!this.sound) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.audioUrl },
        { shouldPlay: true, progressUpdateIntervalMillis: 120 },
        this.handleStatus,
      );
      this.sound = sound;
      this.currentId = track.id;
    } else {
      await this.sound.playAsync();
    }
  }

  async pause() {
    if (this.sound) await this.sound.pauseAsync();
  }

  async resume() {
    if (this.sound) await this.sound.playAsync();
  }

  async seek(ms: number) {
    if (this.sound) await this.sound.setPositionAsync(Math.max(0, ms));
  }

  async stop() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
      } catch {
        // ignore
      }
      this.sound = null;
      this.currentId = null;
    }
  }
}

export const musicPlayer = new MusicPlayer();
