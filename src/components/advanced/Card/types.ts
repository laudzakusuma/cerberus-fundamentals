import type { ReactNode, CSSProperties } from 'react';
import type { CSS } from '@stitches/react';

export interface CardContextValue {
  variant: CardVariant;
  size: CardSize;
  interactive: boolean;
  disabled: boolean;
  elevation: number;
  blur: boolean;
}

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'ghost';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardRootProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  disabled?: boolean;
  elevation?: number;
  blur?: boolean;
  css?: CSS;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
  asChild?: boolean;
}

export interface CardHeaderProps {
  children: ReactNode;
  action?: ReactNode;
  css?: CSS;
}

export interface CardBodyProps {
  children: ReactNode;
  scrollable?: boolean;
  maxHeight?: string | number;
  css?: CSS;
}

export interface CardFooterProps {
  children: ReactNode;
  justify?: 'start' | 'center' | 'end' | 'between';
  css?: CSS;
}

export interface CardActionsProps {
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  spacing?: number;
  css?: CSS;
}