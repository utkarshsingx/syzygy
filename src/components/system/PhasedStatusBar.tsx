import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { colors } from '@/theme/colors';

// Phase-aware StatusBar. The background subtly tracks the current bloom
// phase (a 12% wash over cream), keeping the chrome cohesive with the bloom.
export function PhasedStatusBar() {
  const { phase, accent } = useTheme();
  // Mix a hint of the accent over cream — keep contrast safe for dark icons.
  // Hex `1F` ≈ 12% alpha.
  const tint = `${accent}1F`;
  // Composite cream + tint visually by stacking — but expo-status-bar only
  // accepts one color. The visual result of `accent` at 12% alpha over
  // `cream` is roughly the same as a small blend, which we approximate.
  // For phases that hit dark colors at this saturation, we always show dark icons.
  return (
    <StatusBar
      style="dark"
      translucent={false}
      backgroundColor={blend(colors.cream, accent, 0.08)}
      // The key prop ensures the StatusBar component re-renders cleanly on phase change.
      key={phase}
    />
  );
}

// Blend two hex colors. ratio=0 → a, 1 → b.
function blend(aHex: string, bHex: string, ratio: number): string {
  const a = hexToRgb(aHex);
  const b = hexToRgb(bHex);
  const r = Math.round(a.r + (b.r - a.r) * ratio);
  const g = Math.round(a.g + (b.g - a.g) * ratio);
  const bl = Math.round(a.b + (b.b - a.b) * ratio);
  return `#${[r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}
