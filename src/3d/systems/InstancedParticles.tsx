import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  acceleration: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

interface InstancedParticlesProps {
  count?: number;
  radius?: number;
  color1?: string;
  color2?: string;
  speed?: number;
  size?: number;
}

export function InstancedParticles({
  count = 1000,
  radius = 5,
  color1 = '#00D1FF',
  color2 = '#9B59FF',
  speed = 0.5,
  size = 0.05,
}: InstancedParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);

  const particleGeometry = useMemo(() => new THREE.SphereGeometry(size, 8, 8), [size]);
  const particleMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    const particles: Particle[] = [];
    const color1Obj = new THREE.Color(color1);
    const color2Obj = new THREE.Color(color2);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particles.push({
        position: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed
        ),
        acceleration: new THREE.Vector3(0, 0, 0),
        life: Math.random(),
        maxLife: 1,
        size: size * (0.5 + Math.random() * 0.5),
        color: new THREE.Color().lerpColors(color1Obj, color2Obj, Math.random()),
      });
    }

    particlesRef.current = particles;
  }, [count, radius, speed, size, color1, color2]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const particles = particlesRef.current;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];

      particle.life += delta * 0.5;
      if (particle.life > particle.maxLife) {
        particle.life = 0;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * Math.cbrt(Math.random());

        particle.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );

        particle.velocity.set(
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed,
          (Math.random() - 0.5) * speed
        );
      }

      const attraction = new THREE.Vector3().copy(particle.position).normalize().multiplyScalar(-0.1);
      particle.acceleration.copy(attraction);

      particle.velocity.add(particle.acceleration.clone().multiplyScalar(delta));
      particle.velocity.multiplyScalar(0.98);

      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      const distanceFromCenter = particle.position.length();
      if (distanceFromCenter > radius * 1.5) {
        particle.life = particle.maxLife;
      }

      const lifeFactor = 1 - Math.abs((particle.life / particle.maxLife) * 2 - 1);
      const scale = particle.size * lifeFactor;

      tempObject.position.copy(particle.position);
      tempObject.scale.setScalar(scale);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.matrix);

      tempColor.copy(particle.color);
      tempColor.multiplyScalar(lifeFactor);
      meshRef.current.setColorAt(i, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[particleGeometry, particleMaterial, count]}
      frustumCulled={false}
    />
  );
}