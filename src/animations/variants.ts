import type { Variants } from 'framer-motion';
import { easings, durations, springs } from './primitives';

/**
 * Fade variants dengan berbagai directions
 */
export const fadeVariants: Record<string, Variants> = {
  standard: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: durations.base, ease: easings.standard },
    },
    exit: { 
      opacity: 0,
      transition: { duration: durations.fast, ease: easings.sharp },
    },
  },
  
  up: {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: durations.moderate, ease: easings.decelerated },
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: durations.fast, ease: easings.sharp },
    },
  },
  
  down: {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: durations.moderate, ease: easings.decelerated },
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: { duration: durations.fast, ease: easings.sharp },
    },
  },
  
  left: {
    initial: { opacity: 0, x: 20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: durations.moderate, ease: easings.decelerated },
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: durations.fast, ease: easings.sharp },
    },
  },
  
  right: {
    initial: { opacity: 0, x: -20 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: durations.moderate, ease: easings.decelerated },
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: durations.fast, ease: easings.sharp },
    },
  },
};

/**
 * Scale variants untuk modal, tooltips, popovers
 */
export const scaleVariants: Record<string, Variants> = {
  center: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: durations.fast, ease: easings.emphasized },
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: durations.fast, ease: easings.sharp },
    },
  },
  
  spring: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: springs.bouncy,
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: durations.fast },
    },
  },
  
  punch: {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 0.95, 1.02, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.2, 0.4, 0.7, 1],
        ease: easings.emphasized,
      },
    },
  },
};

/**
 * Rotation variants
 */
export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360,
    transition: {
      duration: 1,
      ease: 'linear',
      repeat: Infinity,
    },
  },
  pulse: {
    rotate: [0, 10, -10, 10, 0],
    transition: {
      duration: 0.5,
      ease: easings.emphasized,
    },
  },
};

/**
 * List animation variants dengan stagger
 */
export const listVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const listItemVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: durations.moderate,
      ease: easings.decelerated,
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.sharp,
    },
  },
};

/**
 * Skeleton loading animation
 */
export const skeletonVariants: Variants = {
  initial: {
    backgroundPosition: '200% 0',
  },
  animate: {
    backgroundPosition: '-200% 0',
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

/**
 * Page transition variants
 */
export const pageVariants: Record<string, Variants> = {
  slideLeft: {
    initial: { x: '100%', opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: durations.moderate,
        ease: easings.decelerated,
      },
    },
    exit: { 
      x: '-100%', 
      opacity: 0,
      transition: {
        duration: durations.moderate,
        ease: easings.accelerated,
      },
    },
  },
  
  slideRight: {
    initial: { x: '-100%', opacity: 0 },
    animate: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: durations.moderate,
        ease: easings.decelerated,
      },
    },
    exit: { 
      x: '100%', 
      opacity: 0,
      transition: {
        duration: durations.moderate,
        ease: easings.accelerated,
      },
    },
  },
  
  fade: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: durations.moderate,
      },
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: durations.fast,
      },
    },
  },
};

/**
 * Hover variants untuk interactive elements
 */
export const hoverVariants = {
  lift: {
    rest: { 
      y: 0,
      scale: 1,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    hover: { 
      y: -4,
      scale: 1.02,
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      transition: springs.snappy,
    },
    tap: {
      y: -2,
      scale: 0.98,
    },
  },
  
  scale: {
    rest: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: springs.gentle,
    },
    tap: {
      scale: 0.95,
    },
  },
  
  glow: {
    rest: { 
      boxShadow: '0 0 0 0 rgba(0, 209, 255, 0)',
    },
    hover: { 
      boxShadow: '0 0 20px 4px rgba(0, 209, 255, 0.3)',
      transition: {
        duration: durations.moderate,
      },
    },
  },
};