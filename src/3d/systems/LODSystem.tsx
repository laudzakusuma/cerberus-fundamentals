import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface LODLevel {
  distance: number;
  geometry: THREE.BufferGeometry;
}

interface LODMeshProps {
  levels: LODLevel[];
  material: THREE.Material;
  position?: [number, number, number];
}

export function LODMesh({ levels, material, position = [0, 0, 0] }: LODMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const currentLevelRef = useRef(0);

  const sortedLevels = useMemo(
    () => [...levels].sort((a, b) => a.distance - b.distance),
    [levels]
  );

  useFrame(() => {
    if (!meshRef.current) return;

    const distance = camera.position.distanceTo(meshRef.current.position);

    let newLevel = 0;
    for (let i = sortedLevels.length - 1; i >= 0; i--) {
      if (distance >= sortedLevels[i].distance) {
        newLevel = i;
        break;
      }
    }

    if (newLevel !== currentLevelRef.current) {
      currentLevelRef.current = newLevel;
      meshRef.current.geometry = sortedLevels[newLevel].geometry;
    }
  });

  return (
    <mesh ref={meshRef} position={position} material={material} geometry={sortedLevels[0].geometry} />
  );
}

export function createLODLevels(baseGeometry: THREE.BufferGeometry): LODLevel[] {
  const highDetail = baseGeometry.clone();
  
  const mediumDetail = new THREE.BufferGeometry();
  const highPositions = baseGeometry.attributes.position.array;
  const mediumPositions = new Float32Array(Math.floor(highPositions.length / 2));
  
  for (let i = 0; i < mediumPositions.length; i++) {
    mediumPositions[i] = highPositions[i * 2];
  }
  
  mediumDetail.setAttribute(
    'position',
    new THREE.BufferAttribute(mediumPositions, 3)
  );
  
  const lowDetail = new THREE.BufferGeometry();
  const lowPositions = new Float32Array(Math.floor(highPositions.length / 4));
  
  for (let i = 0; i < lowPositions.length; i++) {
    lowPositions[i] = highPositions[i * 4];
  }
  
  lowDetail.setAttribute(
    'position',
    new THREE.BufferAttribute(lowPositions, 3)
  );

  if (baseGeometry.attributes.normal) {
    mediumDetail.computeVertexNormals();
    lowDetail.computeVertexNormals();
  }

  return [
    { distance: 0, geometry: highDetail },
    { distance: 10, geometry: mediumDetail },
    { distance: 30, geometry: lowDetail },
  ];
}