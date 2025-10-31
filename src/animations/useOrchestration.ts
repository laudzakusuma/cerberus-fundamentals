import { useAnimation, type AnimationControls } from 'framer-motion';
import { useEffect, useRef, useCallback } from 'react';

export interface OrchestrationStep {
  id: string;
  controls: AnimationControls;
  variants: string | string[];
  delay?: number;
  duration?: number;
}

export interface OrchestrationConfig {
  steps: OrchestrationStep[];
  mode: 'sequence' | 'parallel' | 'stagger';
  staggerDelay?: number;
  loop?: boolean;
  onComplete?: () => void;
}

export function useOrchestration(config: OrchestrationConfig) {
  const { steps, mode, staggerDelay = 0.1, loop = false, onComplete } = config;
  const isPlayingRef = useRef(false);
  const loopCountRef = useRef(0);

  const play = useCallback(async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    try {
      if (mode === 'sequence') {
        for (const step of steps) {
          const delay = step.delay ?? 0;
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay * 1000));
          }

          if (Array.isArray(step.variants)) {
            for (const variant of step.variants) {
              await step.controls.start(variant);
            }
          } else {
            await step.controls.start(step.variants);
          }
        }
      } else if (mode === 'parallel') {
        const promises = steps.map(async (step) => {
          const delay = step.delay ?? 0;
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay * 1000));
          }

          if (Array.isArray(step.variants)) {
            for (const variant of step.variants) {
              await step.controls.start(variant);
            }
          } else {
            await step.controls.start(step.variants);
          }
        });

        await Promise.all(promises);
      } else if (mode === 'stagger') {
        const promises = steps.map(async (step, index) => {
          const stepDelay = step.delay ?? 0;
          const delay = stepDelay + index * staggerDelay;
          
          if (delay > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay * 1000));
          }

          if (Array.isArray(step.variants)) {
            for (const variant of step.variants) {
              await step.controls.start(variant);
            }
          } else {
            await step.controls.start(step.variants);
          }
        });

        await Promise.all(promises);
      }

      loopCountRef.current += 1;

      if (loop) {
        isPlayingRef.current = false;
        play();
      } else {
        isPlayingRef.current = false;
        if (onComplete) onComplete();
      }
    } catch (error) {
      isPlayingRef.current = false;
      console.error('Animation orchestration error:', error);
    }
  }, [steps, mode, staggerDelay, loop, onComplete]);

  const stop = useCallback(() => {
    isPlayingRef.current = false;
    steps.forEach((step) => {
      step.controls.stop();
    });
  }, [steps]);

  const reset = useCallback(() => {
    stop();
    loopCountRef.current = 0;
    steps.forEach((step) => {
      step.controls.set('initial');
    });
  }, [steps, stop]);

  return {
    play,
    stop,
    reset,
    isPlaying: isPlayingRef.current,
    loopCount: loopCountRef.current,
  };
}

export function useGestureAnimation() {
  const controls = useAnimation();

  const handlers = {
    onPanStart: () => {
      controls.start({
        scale: 1.05,
        transition: { duration: 0.1 },
      });
    },

    onPan: (_event: any, info: any) => {
      controls.set({
        x: info.offset.x,
        y: info.offset.y,
      });
    },

    onPanEnd: (_event: any, info: any) => {
      const velocity = Math.abs(info.velocity.x) + Math.abs(info.velocity.y);
      
      if (velocity > 500) {
        controls.start({
          x: info.offset.x + info.velocity.x * 0.2,
          y: info.offset.y + info.velocity.y * 0.2,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20,
          },
        });
      } else {
        controls.start({
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
          },
        });
      }
    },
  };

  return { controls, handlers };
}

export function useScrollAnimation(threshold = 0.1) {
  const controls = useAnimation();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('animate');
        } else {
          controls.start('initial');
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [controls, threshold]);

  return { ref, controls };
}

export function useReducedMotion() {
  const prefersReduced = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      prefersReduced.current = mediaQuery.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReduced.current;
}