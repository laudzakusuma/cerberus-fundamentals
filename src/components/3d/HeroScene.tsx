/**
 * HeroScene Component
 * Interactive 3D hero with procedural geometry and animations
 * Features: breathing animation, mouse tracking, bloom effects
 */

'use client';

import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useDetectGPU } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import * as THREE from 'three';
import { styled } from '@/styles/design-tokens';

// Procedural Cerberus Core - Abstract three-headed representation
function ProceduralCore() {
  const groupRef = useRef<THREE.Group>(null!);
  const head1Ref = useRef<THREE.Mesh>(null!);
  const head2Ref = useRef<THREE.Mesh>(null!);
  const head3Ref = useRef<THREE.Mesh>(null!);
  
  const { viewport, pointer } = useThree();
  
  // Animated materials with emissive glow
  const material1 = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: '#00D1FF',
      emissive: '#00D1FF',
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    }), []);
  
  const material2 = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: '#9B59FF',
      emissive: '#9B59FF',
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2,
    }), []);
  
  const material3 = useMemo(() => 
    new THREE.MeshStandardMaterial({
      color: '#2EE6A6',
      emissive: '#2EE6A6',
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    }), []);

  useFrame((state: RootState, delta: number) => {
    const t = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      // Breathing animation - scale oscillation
      const breathScale = 1 + Math.sin(t * 0.5) * 0.03;
      groupRef.current.scale.setScalar(breathScale);
      
      // Gentle rotation
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
      
      // Mouse tracking - subtle head targeting
      const targetX = pointer.x * 0.3;
      const targetY = pointer.y * 0.3;
      
      groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    }
    
    // Individual head animations
    if (head1Ref.current) {
      head1Ref.current.rotation.y += delta * 0.3;
    }
    if (head2Ref.current) {
      head2Ref.current.rotation.y -= delta * 0.25;
    }
    if (head3Ref.current) {
      head3Ref.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central core */}
      <mesh position={[0, 0, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Head 1 - Right */}
      <mesh ref={head1Ref} position={[1.5, 0.5, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <primitive object={material1} />
      </mesh>
      
      {/* Head 2 - Left */}
      <mesh ref={head2Ref} position={[-1.5, 0.5, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <primitive object={material2} />
      </mesh>
      
      {/* Head 3 - Center Top */}
      <mesh ref={head3Ref} position={[0, 1.8, 0]}>
        <octahedronGeometry args={[0.5, 0]} />
        <primitive object={material3} />
      </mesh>
      
      {/* Connecting rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#00D1FF"
          emissive="#00D1FF"
          emissiveIntensity={0.4}
          metalness={1}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Scene lighting setup
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight position={[5, 5, 5]} intensity={1.5} angle={0.3} penumbra={1} castShadow />
      <spotLight position={[-5, 5, -5]} intensity={1.2} angle={0.3} penumbra={1} color="#9B59FF" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#2EE6A6" />
    </>
  );
}

// Fallback poster for low-end devices
const FallbackPoster = styled('div', {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at center, rgba(0, 209, 255, 0.1) 0%, transparent 70%)',
  
  '& img': {
    maxWidth: '80%',
    maxHeight: '80%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 30px rgba(0, 209, 255, 0.3))',
  },
});

const CanvasContainer = styled('div', {
  width: '100%',
  height: '100%',
  position: 'relative',
  cursor: 'grab',
  
  '&:active': {
    cursor: 'grabbing',
  },
});

interface HeroSceneProps {
  className?: string;
}

export default function HeroScene({ className }: HeroSceneProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  // Detect low-end device
  const GPUTier = useDetectGPU();
  
  useEffect(() => {
    if (GPUTier.tier < 2) {
      setUseFallback(true);
    }
  }, [GPUTier]);
  
  // Show fallback for reduced motion or low-end devices
  if (useFallback || prefersReducedMotion) {
    return (
      <FallbackPoster className={className}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '200px', 
            height: '200px', 
            margin: '0 auto',
            background: 'radial-gradient(circle, rgba(0, 209, 255, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '80px',
          }}>
            🛡️
          </div>
          <p style={{ marginTop: '20px', color: '#9AA4B2' }}>Cerberus Guardian</p>
        </div>
      </FallbackPoster>
    );
  }

  return (
    <CanvasContainer className={className}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ 
          antialias: true,
          alpha: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={50} />
        <SceneLighting />
        
        <Suspense fallback={null}>
          <ProceduralCore />
        </Suspense>
        
        {/* Post-processing effects */}
        {GPUTier.tier >= 2 && (
          <EffectComposer>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.4}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        )}
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </CanvasContainer>
  );
}