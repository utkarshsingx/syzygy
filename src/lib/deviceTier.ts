import * as Device from 'expo-device';
import { useUserStore } from '@/stores/useUserStore';

// Best-effort heuristic for "is this a low-end Android?" — used to auto-select
// the Skia bloom's quality tier so we don't choke on Pixel-3-era devices.
// User can override in Settings.
export function autoDetectBloomQuality(): void {
  const current = useUserStore.getState().bloomQuality;
  if (current !== 'auto') return; // user picked a tier explicitly

  const yearClass = Device.deviceYearClass ?? 2018;
  const ramMB =
    typeof Device.totalMemory === 'number' ? Math.round(Device.totalMemory / (1024 * 1024)) : 0;

  // Heuristic: low if older than 2019 OR < 3GB RAM.
  const low = yearClass < 2019 || (ramMB > 0 && ramMB < 3072);
  useUserStore.getState().setBloomQuality(low ? 'low' : 'high');
}
