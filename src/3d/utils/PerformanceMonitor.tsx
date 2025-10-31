import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { styled } from '@/styles/design-tokens';

const StatsPanel = styled('div', {
  position: 'fixed',
  top: '$4',
  right: '$4',
  padding: '$3',
  backgroundColor: 'rgba(11, 15, 20, 0.9)',
  backdropFilter: 'blur(12px)',
  border: '1px solid $border',
  borderRadius: '$md',
  fontSize: '$xs',
  fontFamily: '$mono',
  color: '$text',
  zIndex: 1000,
  minWidth: '200px',
});

const StatRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '$2',
  
  '&:last-child': {
    marginBottom: 0,
  },
});

const StatLabel = styled('span', {
  color: '$textMuted',
});

const StatValue = styled('span', {
  color: '$accent',
  fontWeight: '$semibold',
  
  variants: {
    status: {
      good: { color: '$success' },
      warning: { color: '$warning' },
      critical: { color: '$danger' },
    },
  },
});

interface PerformanceStats {
  fps: number;
  frameTime: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  programs: number;
}

export function PerformanceMonitor() {
  const { gl } = useThree();
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    programs: 0,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());

  useFrame(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    frameTimesRef.current.push(deltaTime);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    const avgFrameTime =
      frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
    const fps = 1000 / avgFrameTime;

    const info = gl.info;

    setStats({
      fps: Math.round(fps),
      frameTime: Math.round(avgFrameTime * 10) / 10,
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
      geometries: info.memory.geometries,
      textures: info.memory.textures,
      programs: info.programs?.length || 0,
    });
  });

  const getFPSStatus = (fps: number): 'good' | 'warning' | 'critical' => {
    if (fps >= 55) return 'good';
    if (fps >= 30) return 'warning';
    return 'critical';
  };

  return (
    <StatsPanel>
      <StatRow>
        <StatLabel>FPS</StatLabel>
        <StatValue status={getFPSStatus(stats.fps)}>{stats.fps}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Frame Time</StatLabel>
        <StatValue>{stats.frameTime}ms</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Draw Calls</StatLabel>
        <StatValue>{stats.drawCalls}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Triangles</StatLabel>
        <StatValue>{stats.triangles.toLocaleString()}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Geometries</StatLabel>
        <StatValue>{stats.geometries}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Textures</StatLabel>
        <StatValue>{stats.textures}</StatValue>
      </StatRow>
      <StatRow>
        <StatLabel>Programs</StatLabel>
        <StatValue>{stats.programs}</StatValue>
      </StatRow>
    </StatsPanel>
  );
}