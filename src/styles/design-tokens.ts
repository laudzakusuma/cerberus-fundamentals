/**
 * Cerberus Design System Tokens
 * Dark futuristic theme with neon accents
 * Using Stitches for CSS-in-JS with performance-optimized design tokens
 */

import { createStitches } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  theme,
  keyframes,
  getCssText,
  config,
} = createStitches({
  theme: {
    colors: {
      // Base colors
      bg: '#0B0F14',
      bgElevated: '#131920',
      bgCard: 'rgba(19, 25, 32, 0.7)',
      bgOverlay: 'rgba(11, 15, 20, 0.95)',
      
      // Accent colors
      accent: '#00D1FF',
      accent2: '#9B59FF',
      accentHover: '#00E5FF',
      
      // Status colors
      success: '#2EE6A6',
      warning: '#FFB547',
      danger: '#FF6B6B',
      info: '#5B9CFF',
      
      // Text colors
      text: '#E8EEF2',
      textMuted: '#9AA4B2',
      textDim: '#6B7280',
      
      // Border & UI
      border: 'rgba(255, 255, 255, 0.08)',
      borderAccent: 'rgba(0, 209, 255, 0.3)',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
    
    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
    },
    
    fontSizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
      '5xl': '48px',
    },
    
    fonts: {
      body: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
    },
    
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    
    radii: {
      sm: '6px',
      md: '8px',
      lg: '14px',
      xl: '20px',
      full: '9999px',
    },
    
    shadows: {
      sm: '0 2px 8px rgba(0, 0, 0, 0.15)',
      md: '0 4px 16px rgba(0, 0, 0, 0.25)',
      lg: '0 8px 32px rgba(0, 0, 0, 0.35)',
      glow: '0 0 20px rgba(0, 209, 255, 0.3)',
      glowPurple: '0 0 20px rgba(155, 89, 255, 0.3)',
    },
    
    transitions: {
      fast: '180ms cubic-bezier(0.22, 0.9, 0.3, 1)',
      base: '360ms cubic-bezier(0.22, 0.9, 0.3, 1)',
      slow: '600ms cubic-bezier(0.22, 0.9, 0.3, 1)',
    },
    
    zIndices: {
      base: '0',
      dropdown: '1000',
      sticky: '1100',
      fixed: '1200',
      overlay: '1300',
      modal: '1400',
      toast: '1500',
    },
  },
  
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
    motion: '(prefers-reduced-motion: no-preference)',
    hover: '(hover: hover)',
  },
  
  utils: {
    // Margin utilities
    m: (value: any) => ({
      margin: value,
    }),
    mt: (value: any) => ({
      marginTop: value,
    }),
    mb: (value: any) => ({
      marginBottom: value,
    }),
    ml: (value: any) => ({
      marginLeft: value,
    }),
    mr: (value: any) => ({
      marginRight: value,
    }),
    mx: (value: any) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: any) => ({
      marginTop: value,
      marginBottom: value,
    }),
    
    // Padding utilities
    p: (value: any) => ({
      padding: value,
    }),
    pt: (value: any) => ({
      paddingTop: value,
    }),
    pb: (value: any) => ({
      paddingBottom: value,
    }),
    pl: (value: any) => ({
      paddingLeft: value,
    }),
    pr: (value: any) => ({
      paddingRight: value,
    }),
    px: (value: any) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: any) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    
    // Size utilities
    size: (value: any) => ({
      width: value,
      height: value,
    }),
  },
});

// Global styles
export const globalStyles = globalCss({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },
  
  'html, body': {
    margin: 0,
    padding: 0,
    backgroundColor: '$bg',
    color: '$text',
    fontFamily: '$body',
    fontSize: '$base',
    lineHeight: '$normal',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  
  'h1, h2, h3, h4, h5, h6': {
    margin: 0,
    fontWeight: '$semibold',
  },
  
  'p': {
    margin: 0,
  },
  
  'a': {
    color: 'inherit',
    textDecoration: 'none',
  },
  
  'button': {
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  
  // Focus visible styles for accessibility
  '*:focus-visible': {
    outline: '2px solid $accent',
    outlineOffset: '2px',
  },
  
  // Scrollbar styling
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  
  '::-webkit-scrollbar-track': {
    background: '$bgElevated',
  },
  
  '::-webkit-scrollbar-thumb': {
    background: '$textDim',
    borderRadius: '$sm',
    
    '&:hover': {
      background: '$textMuted',
    },
  },
});

// Animation keyframes
export const fadeIn = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

export const slideUp = keyframes({
  from: { transform: 'translateY(20px)', opacity: 0 },
  to: { transform: 'translateY(0)', opacity: 1 },
});

export const pulse = keyframes({
  '0%, 100%': { opacity: 1 },
  '50%': { opacity: 0.5 },
});

export const breathe = keyframes({
  '0%, 100%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.03)' },
});
