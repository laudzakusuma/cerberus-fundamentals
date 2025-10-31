/**
 * Motion Presets for Cerberus
 * Consistent animation variants using Framer Motion
 */

import { Variants, Transition } from 'framer-motion';

// Transition presets
export const transitions = {
  fast: {
    type: 'spring',
    stiffness: 300,
    damping: 25,
  } as Transition,
  
  base: {
    type: 'spring',
    stiffness: 200,
    damping: 20,
  } as Transition,
  
  smooth: {
    duration: 0.36,
    ease: [0.22, 0.9, 0.3, 1],
  } as Transition,
  
  slow: {
    duration: 0.6,
    ease: [0.22, 0.9, 0.3, 1],
  } as Transition,
};

// Fade animations
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.smooth,
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// Slide up animations
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
  exit: { 
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

// Scale animations
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: transitions.base,
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Hover lift effect
export const hoverLift: Variants = {
  initial: { y: 0 },
  hover: { 
    y: -6,
    transition: { duration: 0.18, ease: [0.22, 0.9, 0.3, 1] },
  },
};

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Page transition variants
export const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.98,
  },
  enter: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.36,
      ease: [0.22, 0.9, 0.3, 1],
    },
  },
  exit: { 
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
    },
  },
};

// Modal variants
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalContentVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.base,
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};

// Card hover animation
export const cardHoverVariants: Variants = {
  initial: { 
    y: 0,
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  hover: { 
    y: -6,
    boxShadow: '0 8px 32px rgba(0, 209, 255, 0.2)',
    transition: { duration: 0.18, ease: [0.22, 0.9, 0.3, 1] },
  },
};

// Notification slide in
export const notificationVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 100,
    scale: 0.9,
  },
  visible: { 
    opacity: 1,
    x: 0,
    scale: 1,
    transition: transitions.base,
  },
  exit: { 
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// Pulse animation for real-time indicators
export const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};
