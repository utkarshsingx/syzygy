import { useMemo } from 'react';
import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';

// Procedural noise grain via SkSL. Drawn once, no per-frame animation
// (mirrors the web's CSS-driven grain — compositor-friendly, near-zero cost).
const NOISE_SRC = Skia.RuntimeEffect.Make(`
uniform float opacity;
half4 main(vec2 pos) {
  float n = fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
  return half4(half3(n), half(opacity));
}
`);

type Props = {
  opacity?: number;
};

export function Grain({ opacity = 0.04 }: Props) {
  const effect = useMemo(() => NOISE_SRC, []);
  if (!effect) return null;
  return (
    <Canvas style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
      <Fill>
        <Shader source={effect} uniforms={{ opacity }} />
      </Fill>
    </Canvas>
  );
}
