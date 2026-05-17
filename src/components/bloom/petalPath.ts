import { Skia, type SkPath } from '@shopify/react-native-skia';

// Builds a single petal SkPath rooted at (cx, cy), pointing outward at `angle`
// (radians, 0 = +X). `openness` (0..1) controls how far the petal swings away
// from the bud center + how relaxed its curl is. `wilt` (0..1) tilts the tip
// downward (gravity). All math runs inside a Reanimated worklet — keep cheap.
//
// Petal silhouette is two cubic bezier sweeps from the anchor out to the tip
// and back, forming a leaf/teardrop. Control points are positioned so:
//   - fully closed (openness=0): control points hug the center axis → tight bud
//   - fully open  (openness=1): control points splay outward → full bloom
export function buildPetalPath(
  cx: number,
  cy: number,
  angle: number,
  ringRadius: number,
  petalWidth: number,
  openness: number,
  wilt: number,
): SkPath {
  'worklet';
  const path = Skia.Path.Make();

  // Tip position — radial distance scaled by openness; gravity pulls it down.
  const reach = ringRadius * (0.55 + 0.45 * openness);
  const tipX = cx + Math.cos(angle) * reach;
  const tipY = cy + Math.sin(angle) * reach + wilt * ringRadius * 0.18;

  // Perpendicular unit vector for petal width.
  const perpX = -Math.sin(angle);
  const perpY = Math.cos(angle);

  // Side-anchor offsets at the base (where petal meets the bud center).
  // Smaller when closed (tight bud), wider when open.
  const baseSpread = petalWidth * (0.35 + 0.65 * openness);
  const sideAX = cx + perpX * baseSpread;
  const sideAY = cy + perpY * baseSpread;
  const sideBX = cx - perpX * baseSpread;
  const sideBY = cy - perpY * baseSpread;

  // Mid-side control points — bow the petal outward as it opens.
  const midReach = reach * 0.55;
  const midSpread = petalWidth * (0.65 + 0.85 * openness);
  const midAX = cx + Math.cos(angle) * midReach + perpX * midSpread;
  const midAY = cy + Math.sin(angle) * midReach + perpY * midSpread;
  const midBX = cx + Math.cos(angle) * midReach - perpX * midSpread;
  const midBY = cy + Math.sin(angle) * midReach - perpY * midSpread;

  // Near-tip control points — pinch back toward the tip for a pointed silhouette.
  const tipBackReach = reach * 0.85;
  const tipBackSpread = petalWidth * 0.22 * (1 - openness * 0.5);
  const tipBackAX = cx + Math.cos(angle) * tipBackReach + perpX * tipBackSpread;
  const tipBackAY = cy + Math.sin(angle) * tipBackReach + perpY * tipBackSpread;
  const tipBackBX = cx + Math.cos(angle) * tipBackReach - perpX * tipBackSpread;
  const tipBackBY = cy + Math.sin(angle) * tipBackReach - perpY * tipBackSpread;

  // Path: start at side A → bow out to tip → bow back to side B → close.
  path.moveTo(sideAX, sideAY);
  path.cubicTo(midAX, midAY, tipBackAX, tipBackAY, tipX, tipY);
  path.cubicTo(tipBackBX, tipBackBY, midBX, midBY, sideBX, sideBY);
  path.close();
  return path;
}
