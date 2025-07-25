'use client';

import React, { createContext, useContext } from 'react';
import { useSmartegAI } from '../hooks/useSmartegAI';

// Create the context
const AIContext = createContext(null);

// Provider component that encapsulates the AI logic
export function AIContextProvider({ children, token, getNewToken }) {
  // The useSmartegAI hook contains all the state and logic.
  const ai_logic = useSmartegAI({ token, getNewToken });

  return (
    <AIContext.Provider value={ai_logic}>
      {children}
    </AIContext.Provider>
  );
}

// Custom hook to access the AI state and functions
export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIContextProvider');
  }
  return context;
}
