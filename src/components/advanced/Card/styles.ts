import { styled } from '@/styles/design-tokens';
import type { CardVariant, CardSize } from './types';

export const StyledCardRoot = styled('div', {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '$lg',
  transition: 'all $base',
  willChange: 'transform',
  
  // Disable selection on interactive cards
  '&[data-interactive="true"]': {
    cursor: 'pointer',
    userSelect: 'none',
    
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  
  '&[data-disabled="true"]': {
    opacity: 0.6,
    pointerEvents: 'none',
    cursor: 'not-allowed',
  },
  
  // Focus visible for accessibility
  '&:focus-visible': {
    outline: '2px solid $accent',
    outlineOffset: '2px',
  },
  
  variants: {
    variant: {
      default: {
        backgroundColor: '$bgCard',
        border: '1px solid $border',
      },
      elevated: {
        backgroundColor: '$bgCard',
        border: 'none',
        boxShadow: '$lg',
      },
      outlined: {
        backgroundColor: 'transparent',
        border: '2px solid $border',
      },
      ghost: {
        backgroundColor: 'transparent',
        border: 'none',
      },
    },
    
    size: {
      sm: {
        padding: '$3',
      },
      md: {
        padding: '$5',
      },
      lg: {
        padding: '$8',
      },
    },
    
    blur: {
      true: {
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      },
    },
    
    elevation: {
      0: { boxShadow: 'none' },
      1: { boxShadow: '$sm' },
      2: { boxShadow: '$md' },
      3: { boxShadow: '$lg' },
    },
  },
  
  // Compound variants for complex interactions
  compoundVariants: [
    {
      variant: 'default',
      blur: true,
      css: {
        backgroundColor: 'rgba(19, 25, 32, 0.7)',
      },
    },
    {
      variant: 'elevated',
      blur: true,
      css: {
        backgroundColor: 'rgba(19, 25, 32, 0.8)',
      },
    },
  ],
  
  defaultVariants: {
    variant: 'default',
    size: 'md',
    elevation: 0,
  },
});

export const StyledCardHeader = styled('header', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '$4',
  
  variants: {
    size: {
      sm: {
        marginBottom: '$2',
      },
      md: {
        marginBottom: '$4',
      },
      lg: {
        marginBottom: '$6',
      },
    },
  },
});

export const StyledCardBody = styled('div', {
  flex: 1,
  
  variants: {
    scrollable: {
      true: {
        overflowY: 'auto',
        overflowX: 'hidden',
        
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        
        '&::-webkit-scrollbar-thumb': {
          background: '$border',
          borderRadius: '$sm',
          
          '&:hover': {
            background: '$borderAccent',
          },
        },
      },
    },
  },
});

export const StyledCardFooter = styled('footer', {
  display: 'flex',
  alignItems: 'center',
  marginTop: '$4',
  paddingTop: '$4',
  borderTop: '1px solid $border',
  
  variants: {
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
    
    size: {
      sm: {
        marginTop: '$2',
        paddingTop: '$2',
      },
      md: {
        marginTop: '$4',
        paddingTop: '$4',
      },
      lg: {
        marginTop: '$6',
        paddingTop: '$6',
      },
    },
  },
  
  defaultVariants: {
    justify: 'between',
  },
});

export const StyledCardActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  
  variants: {
    align: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
    },
    
    spacing: {
      1: { gap: '$1' },
      2: { gap: '$2' },
      3: { gap: '$3' },
      4: { gap: '$4' },
    },
  },
  
  defaultVariants: {
    align: 'end',
    spacing: 2,
  },
});