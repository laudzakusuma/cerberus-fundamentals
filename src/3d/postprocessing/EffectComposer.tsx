import { EffectComposer as R3FEffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface EffectComposerProps {
  bloomStrength?: number;
  bloomRadius?: number;
  bloomThreshold?: number;
  enableFXAA?: boolean;
  enableVignette?: boolean;
}

export function EffectComposer({
  bloomStrength = 1.5,
  bloomRadius = 0.4,
  bloomThreshold = 0.85,
  enableFXAA = true,
  enableVignette = true,
}: EffectComposerProps) {
  return (
    <R3FEffectComposer multisampling={enableFXAA ? 8 : 0}>
      <Bloom
        intensity={bloomStrength}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        radius={bloomRadius}
        mipmapBlur
      />
      
      <Vignette
        offset={enableVignette ? 0.3 : 0}
        darkness={enableVignette ? 0.9 : 0}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </R3FEffectComposer>
  );
}