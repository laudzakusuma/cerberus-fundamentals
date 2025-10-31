import { useEffect, useRef } from 'react';

/**
 * Check if device prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Hook untuk disable animations jika user prefers reduced motion
 */
export function useReducedMotion() {
  const prefersReduced = useRef(prefersReducedMotion());

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      prefersReduced.current = mediaQuery.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced.current;
}

/**
 * Calculate optimal frame rate based on device capability
 */
export function getOptimalFrameRate(): number {
  if (typeof window === 'undefined') return 60;
  
  // Check for high refresh rate displays
  const fps = window.screen && 'refreshRate' in window.screen 
    ? (window.screen as any).refreshRate 
    : 60;
    
  return Math.min(fps, 120); // Cap at 120fps
}

/**
 * Throttle function for performance-critical animations
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      inThrottle = true;
      lastResult = func.apply(this, args);
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
    
    return lastResult;
  };
}

/**
 * RAF-based animation loop dengan automatic cleanup
 */
export function useAnimationLoop(
  callback: (deltaTime: number) => void,
  deps: any[] = []
) {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, deps);
}

/**
 * Batch DOM updates untuk better performance
 */
export function batchUpdates(updates: Array<() => void>) {
  requestAnimationFrame(() => {
    updates.forEach((update) => update());
  });
}

/**
 * Apply will-change hint untuk optimization
 */
export function getWillChangeStyle(properties: string[]): React.CSSProperties {
  return {
    willChange: properties.join(', '),
  };
}

/**
 * Check if GPU acceleration is available
 */
export function hasGPUAcceleration(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  return !!gl;
}