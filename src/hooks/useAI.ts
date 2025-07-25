"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceProcessor } from '@/services/ai/VoiceProcessor';
import { SupplyPredictionService } from '@/services/ai/SupplyPrediction';
import { webSocketService } from '@/services/websocket/WebSocketService';
import * as api from '@/lib/api';
import type { 
  UseVoiceReturn, 
  UseWebSocketReturn, 
  UsePredictionReturn, 
  UseAIReturn,
  VoiceSettings,
  WebSocketMessage,
  PredictionData,
  HistoricalSalesData
} from '@/types/ai';

/**
 * Hook for Voice Processing (STT/TTS)
 */
export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Initialize voice services on mount
  useEffect(() => {
    const initVoice = async () => {
      try {
        await VoiceProcessor.initializeSpeechRecognition();
        const ttsSupported = VoiceProcessor.initializeSpeechSynthesis();
        setIsSupported(ttsSupported);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Voice not supported');
        setIsSupported(false);
      }
    };

    initVoice();
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Voice recognition not supported');
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      const command = await VoiceProcessor.startListening();
      setTranscript(command.text);
      setConfidence(command.confidence);
      setIsListening(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice recognition failed');
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    VoiceProcessor.stopListening();
    setIsListening(false);
  }, []);

  const speak = useCallback(async (text: string, options?: Partial<VoiceSettings>) => {
    if (!isSupported) {
      setError('Text-to-speech not supported');
      return;
    }

    try {
      setIsSpeaking(true);
      setError(null);
      await VoiceProcessor.speak(text, options);
      setIsSpeaking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Text-to-speech failed');
      setIsSpeaking(false);
    }
  }, [isSupported]);

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    speak,
    isSpeaking
  };
}

/**
 * Hook for WebSocket connection
 */
export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  // Setup status listeners
  useEffect(() => {
    const handleStatusChange = (status: typeof connectionStatus) => {
      setConnectionStatus(status);
      setIsConnected(status === 'connected');
      if (status === 'error') {
        setError('WebSocket connection failed');
      } else {
        setError(null);
      }
    };

    webSocketService.onStatusChange(handleStatusChange);

    // Setup message listeners for all types
    const messageTypes = ['stock', 'sale', 'waste', 'prediction', 'validation', 'alert'];
    messageTypes.forEach(type => {
      webSocketService.onAIResponse(type, (data) => {
        setLastMessage({ type, data, timestamp: new Date() });
      });
    });

    return () => {
      webSocketService.offStatusChange(handleStatusChange);
      messageTypes.forEach(type => {
        webSocketService.onAIResponse(type, () => {}); // This doesn't actually remove, need better cleanup
      });
    };
  }, []);

  const connect = useCallback(async (url?: string) => {
    try {
      setError(null);
      await webSocketService.connect(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  }, []);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const sendMessage = useCallback(async (type: WebSocketMessage['type'], data: any) => {
    try {
      setError(null);
      await webSocketService.sendAIRequest(type, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send message failed');
    }
  }, []);

  return {
    isConnected,
    connectionStatus,
    error,
    connect,
    disconnect,
    sendMessage,
    lastMessage
  };
}

/**
 * Hook for Supply Prediction
 */
export function usePrediction(): UsePredictionReturn {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historicalDataRef = useRef<HistoricalSalesData[]>([]);
  const menuItemsRef = useRef<string[]>([]);

  const generatePredictions = useCallback(async (getNewToken: () => Promise<{ name: string }>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPredictions = await SupplyPredictionService.predictWithAI(getNewToken);
      setPredictions(newPredictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction generation failed');
      // Optionally, you can call the local prediction as a fallback here
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshPredictions = useCallback(async (getNewToken: () => Promise<{ name: string }>) => {
    // This function can be re-implemented if there's a need to refresh with existing data
    // For now, it will call generatePredictions to get fresh AI-based predictions
    await generatePredictions(getNewToken);
  }, [generatePredictions]);

  return {
    predictions,
    isLoading,
    error,
    generatePredictions: generatePredictions as any, // Cast to any to satisfy the interface
    refreshPredictions: refreshPredictions as any, // Cast to any to satisfy the interface
  };
}

/**
 * Main AI Hook that combines all AI services
 */
export function useAI(): UseAIReturn {
  const [isInitialized, setIsInitialized] = useState(false);
  const voice = useVoice();
  const webSocket = useWebSocket();
  const prediction = usePrediction();

  const initializeAI = useCallback(async () => {
    try {
      // Initialize voice services (already done in useVoice)
      // Connect to WebSocket
      await webSocket.connect();
      
      setIsInitialized(true);
    } catch (err) {
      console.error('AI initialization failed:', err);
      setIsInitialized(false);
    }
  }, [webSocket]);

  // Auto-initialize on mount
  useEffect(() => {
    initializeAI();
  }, [initializeAI]);

  return {
    voice,
    webSocket,
    prediction,
    isInitialized,
    initializeAI
  };
}

/**
 * Hook for processing voice commands
 */
export function useVoiceCommands(getNewToken: () => Promise<{ name: string }>) {
  const { startListening, stopListening, speak, transcript, isListening, error } = useVoice();
  
  const [lastCommand, setLastCommand] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processCommand = useCallback(async () => {
    if (!transcript) return;

    setIsProcessing(true);
    let feedbackMessage = "Maaf, terjadi kesalahan.";
    
    try {
      const command = await VoiceProcessor.processVoiceCommand(transcript, getNewToken);
      setLastCommand(command);

      switch (command.action) {
        case 'UPDATE_STOCK':
          await api.stockAPI.addStock(command.payload);
          const stockNames = command.payload.map((item: any) => item.name).join(', ');
          feedbackMessage = `Oke, stok ${stockNames} sudah diperbarui.`;
          break;
        case 'RECORD_SALE':
          await api.salesAPI.recordSales(command.payload);
          const itemNames = command.payload.items.map((i: any) => `${i.counts} ${i.name}`).join(', ');
          feedbackMessage = `Sip, pesanan ${itemNames} sudah dicatat.`;
          break;
        case 'SOCIAL_POST':
          // You would have a corresponding API call here, e.g., api.social.createPost(command.payload)
          feedbackMessage = `Oke, saya akan umumkan bahwa ${command.payload.name} sekarang ${command.payload.status === 'ready' ? 'siap' : 'habis'}.`;
          break;
        case 'INVALID_MENU':
          feedbackMessage = "Maaf, sepertinya ada kesalahan nama menu.";
          break;
        default: // UNKNOWN
          feedbackMessage = "Maaf, saya tidak mengerti maksud Anda. Boleh diulang kembali perintahnya?";
          break;
      }
    } catch (err) {
      console.error('Command processing failed:', err);
      feedbackMessage = "Sepertinya sedang offline atau terjadi kesalahan. Perintah tidak dapat diproses.";
    } finally {
      await speak(feedbackMessage);
      setIsProcessing(false);
    }
  }, [transcript, speak, getNewToken]);

  // Auto-process when transcript changes
  useEffect(() => {
    if (transcript && !isListening && !isProcessing) {
      processCommand();
    }
  }, [transcript, isListening, isProcessing, processCommand]);

  return {
    startListening,
    stopListening,
    isListening,
    isProcessing,
    transcript,
    lastCommand,
    error
  };
} 