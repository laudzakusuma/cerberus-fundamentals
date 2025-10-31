import { useRef, useMemo } from 'react';
import { Canvas, useFrame, type RootState } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { InstancedParticles } from '../systems/InstancedParticles';
import { EffectComposer } from '../postprocessing/EffectComposer';
import { createHolographicMaterial } from '../shaders/holographic';

function HolographicCore() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef1 = useRef<THREE.Mesh>(null);
  const meshRef2 = useRef<THREE.Mesh>(null);
  const meshRef3 = useRef<THREE.Mesh>(null);

  const holographicMat = useMemo(() => createHolographicMaterial({
    color1: new THREE.Color(0x00d1ff),
    color2: new THREE.Color(0x9b59ff),
    distortionAmount: 0.15,
    scanlineIntensity: 0.4,
    glitchAmount: 0.03,
    fresnelPower: 3.0,
  }), []);

  useFrame((state: RootState, delta: number) => {
    const time = state.clock.getElapsedTime();

    if (holographicMat.uniforms) {
      holographicMat.uniforms.time.value = time;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }

    if (meshRef1.current) {
      meshRef1.current.rotation.x = time * 0.3;
      meshRef1.current.rotation.y = time * 0.2;
    }

    if (meshRef2.current) {
      meshRef2.current.rotation.x = time * -0.2;
      meshRef2.current.rotation.z = time * 0.15;
    }

    if (meshRef3.current) {
      meshRef3.current.rotation.y = time * -0.25;
      meshRef3.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef1} position={[0, 0, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <primitive object={holographicMat} attach="material" />
      </mesh>

      <mesh ref={meshRef2} position={[0, 0, 0]} scale={1.3}>
        <octahedronGeometry args={[1, 0]} />
        <primitive object={holographicMat} attach="material" />
      </mesh>

      <mesh ref={meshRef3} position={[0, 0, 0]} scale={1.6}>
        <octahedronGeometry args={[1, 0]} />
        <primitive object={holographicMat} attach="material" />
      </mesh>
    </group>
  );
}

function Scene() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const cameraGroupRef = useRef<THREE.Group>(null);

  useFrame((state: RootState) => {
    if (cameraGroupRef.current) {
      cameraGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.x,
        mousePosition.current.y * 0.1,
        0.05
      );
      cameraGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        cameraGroupRef.current.rotation.y,
        mousePosition.current.x * 0.1,
        0.05
      );
    }
  });

  const handlePointerMove = (event: PointerEvent) => {
    mousePosition.current = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1,
    };
  };

  return (
    <>
      <group ref={cameraGroupRef}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
      </group>

      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00D1FF" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9B59FF" />

      <HolographicCore />
      
      <InstancedParticles
        count={2000}
        radius={8}
        color1="#00D1FF"
        color2="#9B59FF"
        speed={0.3}
        size={0.02}
      />

      <EffectComposer
        bloomStrength={1.8}
        bloomRadius={0.5}
        bloomThreshold={0.8}
        enableFXAA={true}
        enableVignette={true}
        enableChromaticAberration={false}
      />
    </>
  );
}

export function AdvancedHeroScene() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#0B0F14' }}>
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}