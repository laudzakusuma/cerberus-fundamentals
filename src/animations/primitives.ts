import type { Transition, Variant, Variants } from 'framer-motion';

/**
 * Reusable easing curves
 * Based on Material Design and iOS motion principles
 */
export const easings = {
  // Standard easing
  standard: [0.4, 0.0, 0.2, 1],
  
  // Emphasized easing (for important elements)
  emphasized: [0.0, 0.0, 0.2, 1],
  decelerated: [0.0, 0.0, 0.2, 1],
  accelerated: [0.4, 0.0, 1, 1],
  
  // Sharp easing (for exiting elements)
  sharp: [0.4, 0.0, 0.6, 1],
  
  // Bouncy easing
  bounce: [0.68, -0.55, 0.265, 1.55],
  
  // Elastic easing
  elastic: [0.5, 1.25, 0.75, 1.25],
} as const;

/**
 * Reusable spring configurations
 */
export const springs = {
  // Gentle spring for smooth transitions
  gentle: {
    type: 'spring' as const,
    stiffness: 120,
    damping: 20,
    mass: 1,
  },
  
  // Snappy spring for quick responses
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  
  // Bouncy spring for playful interactions
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 15,
    mass: 1.2,
  },
  
  // Stiff spring for immediate feedback
  stiff: {
    type: 'spring' as const,
    stiffness: 1000,
    damping: 50,
    mass: 1,
  },
  
  // Wobbly spring for attention-grabbing
  wobbly: {
    type: 'spring' as const,
    stiffness: 180,
    damping: 12,
    mass: 1,
  },
} as const;

/**
 * Duration presets
 */
export const durations = {
  instant: 0,
  fast: 0.15,
  base: 0.25,
  moderate: 0.35,
  slow: 0.5,
  slower: 0.75,
  slowest: 1,
} as const;

/**
 * Stagger configurations untuk sequential animations
 */
export const staggerConfigs = {
  tight: {
    from: 'first' as const,
    amount: 0.05,
  },
  base: {
    from: 'first' as const,
    amount: 0.1,
  },
  loose: {
    from: 'first' as const,
    amount: 0.2,
  },
  center: {
    from: 'center' as const,
    amount: 0.15,
  },
  edges: {
    from: 'edges' as const,
    amount: 0.15,
  },
} as const;

/**
 * Base transition with performance optimizations
 */
export const baseTransition: Transition = {
  duration: durations.base,
  ease: easings.standard,
};

/**
 * Transition presets untuk common patterns
 */
export const transitions = {
  fade: {
    duration: durations.base,
    ease: easings.standard,
  },
  
  scale: {
    duration: durations.fast,
    ease: easings.emphasized,
  },
  
  slide: {
    duration: durations.moderate,
    ease: easings.decelerated,
  },
  
  spring: springs.gentle,
  
  exit: {
    duration: durations.fast,
    ease: easings.sharp,
  },
} as const;