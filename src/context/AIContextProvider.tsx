'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAI, useVoiceCommands } from '../hooks/useAI';
import type { UseAIReturn } from '../types/ai';

// Create the context
const AIContext = createContext<UseAIReturn | null>(null);
const VoiceCommandsContext = createContext<any>(null);

interface AIContextProviderProps {
  children: ReactNode;
  getNewToken: () => Promise<{ name: string }>;
}

// Provider component that encapsulates the AI logic
export function AIContextProvider({ children, getNewToken }: AIContextProviderProps) {
  const ai_logic = useAI();
  const voice_commands = useVoiceCommands(getNewToken);

  return (
    <AIContext.Provider value={ai_logic}>
      <VoiceCommandsContext.Provider value={voice_commands}>
        {children}
      </VoiceCommandsContext.Provider>
    </AIContext.Provider>
  );
}

// Custom hook to access the main AI state and functions
export function useAIEngine(): UseAIReturn {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIEngine must be used within an AIContextProvider');
  }
  return context;
}

// Custom hook to access the voice command processing functions
export function useVoiceController() {
  const context = useContext(VoiceCommandsContext);
  if (!context) {
    throw new Error('useVoiceController must be used within an AIContextProvider');
  }
  return context;
} 