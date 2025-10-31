import { forwardRef, useMemo, useRef, useEffect, useCallback } from 'react';
import type { ElementRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CardProvider, useCardContext } from './context';
import {
  StyledCardRoot,
  StyledCardHeader,
  StyledCardBody,
  StyledCardFooter,
  StyledCardActions,
} from './styles';
import type {
  CardRootProps,
  CardHeaderProps,
  CardBodyProps,
  CardFooterProps,
  CardActionsProps,
  CardContextValue,
} from './types';

const CardRoot = forwardRef<ElementRef<typeof StyledCardRoot>, CardRootProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      interactive = false,
      disabled = false,
      elevation = 0,
      blur = false,
      onClick,
      onHover,
      css,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const contextValue = useMemo<CardContextValue>(
      () => ({
        variant,
        size,
        interactive,
        disabled,
        elevation,
        blur,
      }),
      [variant, size, interactive, disabled, elevation, blur]
    );

    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness: 300, damping: 30 };
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

    useEffect(() => {
      if (!interactive || disabled) return;

      const card = cardRef.current;
      if (!card) return;

      const handleMouseMove = (e: MouseEvent) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / rect.width;
        const deltaY = (e.clientY - centerY) / rect.height;
        
        mouseX.set(deltaX);
        mouseY.set(deltaY);
        
        if (onHover) onHover();
      };

      const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
      };

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [interactive, disabled, mouseX, mouseY, onHover]);

    const mergeRefs = useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node;
        
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const Component = interactive && !disabled ? motion(StyledCardRoot) : StyledCardRoot;

    const motionProps = interactive && !disabled
      ? {
          style: {
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d' as const,
          },
          whileHover: {
            scale: 1.02,
            transition: { duration: 0.2 },
          },
          whileTap: {
            scale: 0.98,
          },
        }
      : {};

    return (
      <CardProvider value={contextValue}>
        <Component
          ref={mergeRefs}
          variant={variant}
          size={size}
          elevation={elevation}
          blur={blur}
          data-interactive={interactive}
          data-disabled={disabled}
          onClick={disabled ? undefined : onClick}
          className={className}
          css={css}
          tabIndex={interactive && !disabled ? 0 : undefined}
          role={interactive ? 'button' : undefined}
          aria-disabled={disabled}
          {...motionProps}
          {...props}
        >
          {children}
        </Component>
      </CardProvider>
    );
  }
);

CardRoot.displayName = 'Card.Root';

const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(
  ({ children, action, css, ...props }, ref) => {
    const { size } = useCardContext();

    return (
      <StyledCardHeader ref={ref} size={size} css={css} {...props}>
        <div style={{ flex: 1 }}>{children}</div>
        {action && <div>{action}</div>}
      </StyledCardHeader>
    );
  }
);

CardHeader.displayName = 'Card.Header';

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, scrollable = false, maxHeight, css, ...props }, ref) => {
    const computedCss = useMemo(() => {
      const baseCss = css || {};
      return maxHeight
        ? { ...baseCss, maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }
        : baseCss;
    }, [css, maxHeight]);

    return (
      <StyledCardBody
        ref={ref}
        scrollable={scrollable}
        css={computedCss}
        {...props}
      >
        {children}
      </StyledCardBody>
    );
  }
);

CardBody.displayName = 'Card.Body';

const CardFooter = forwardRef<HTMLElement, CardFooterProps>(
  ({ children, justify = 'between', css, ...props }, ref) => {
    const { size } = useCardContext();

    return (
      <StyledCardFooter
        ref={ref}
        justify={justify}
        size={size}
        css={css}
        {...props}
      >
        {children}
      </StyledCardFooter>
    );
  }
);

CardFooter.displayName = 'Card.Footer';

const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(
  ({ children, align = 'end', spacing = 2, css, ...props }, ref) => {
    return (
      <StyledCardActions
        ref={ref}
        align={align}
        spacing={spacing}
        css={css}
        {...props}
      >
        {children}
      </StyledCardActions>
    );
  }
);

CardActions.displayName = 'Card.Actions';

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
  Actions: CardActions,
};