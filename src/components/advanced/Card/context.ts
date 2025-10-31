import { createContext, useContext } from 'react';
import type { CardContextValue } from './types';

const CardContext = createContext<CardContextValue | null>(null);

export const CardProvider = CardContext.Provider;

export function useCardContext() {
  const context = useContext(CardContext);
  
  if (!context) {
    throw new Error(
      'Card compound components must be used within Card.Root. ' +
      'Wrap your Card.Header, Card.Body, etc. with <Card.Root>...</Card.Root>'
    );
  }
  
  return context;
}

export function useOptionalCardContext() {
  return useContext(CardContext);
}