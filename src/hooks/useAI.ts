"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceProcessor } from '@/services/ai/VoiceProcessor';
import { SupplyPredictionService } from '@/services/ai/SupplyPrediction';
import { webSocketService } from '@/services/websocket/WebSocketService';
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

  const generatePredictions = useCallback((historicalData: HistoricalSalesData[], menuItems: string[]) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Store data for refresh
      historicalDataRef.current = historicalData;
      menuItemsRef.current = menuItems;
      
      // Generate predictions using frontend algorithm
      const newPredictions = SupplyPredictionService.predictSupply(historicalData, menuItems);
      
      // Adjust for current day of week
      const today = new Date();
      const dayOfWeek = today.getDay();
      const adjustedPredictions = newPredictions.map(pred => 
        SupplyPredictionService.adjustForDayOfWeek(pred, dayOfWeek, historicalData)
      );
      
      setPredictions(adjustedPredictions);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction generation failed');
      setIsLoading(false);
    }
  }, []);

  const refreshPredictions = useCallback(() => {
    if (historicalDataRef.current.length > 0 && menuItemsRef.current.length > 0) {
      generatePredictions(historicalDataRef.current, menuItemsRef.current);
    }
  }, [generatePredictions]);

  return {
    predictions,
    isLoading,
    error,
    generatePredictions,
    refreshPredictions
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
export function useVoiceCommands() {
  const { startListening, stopListening, speak, transcript, isListening, error } = useVoice();
  const { sendMessage } = useWebSocket();
  
  const [lastCommand, setLastCommand] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processCommand = useCallback(async () => {
    if (!transcript) return;

    setIsProcessing(true);
    
    try {
      // Process the voice command
      const parsedCommand = VoiceProcessor.processVoiceCommand(transcript);
      setLastCommand(parsedCommand);
      
      // Send to AI for validation if connected
      if (parsedCommand.type !== 'unknown') {
        await sendMessage('validation', {
          command: parsedCommand,
          timestamp: new Date().toISOString()
        });
        
        // Provide voice feedback
        const feedback = generateVoiceFeedback(parsedCommand);
        await speak(feedback);
      } else {
        await speak("Perintah tidak dikenali. Silakan ulangi.");
      }
      
    } catch (err) {
      console.error('Command processing failed:', err);
      await speak("Terjadi kesalahan saat memproses perintah.");
    } finally {
      setIsProcessing(false);
    }
  }, [transcript, sendMessage, speak]);

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

/**
 * Generate voice feedback based on parsed command
 */
function generateVoiceFeedback(command: any): string {
  switch (command.type) {
    case 'stock_record':
      return `Mencatat stok ${command.menuItem} sebanyak ${command.quantity} ${command.unit || 'porsi'}.`;
    case 'sales_transaction':
      return `Mencatat penjualan: ${command.items?.join(', ')}.`;
    case 'menu_ready':
      return `${command.menuItem} sudah siap sebanyak ${command.quantity} porsi.`;
    case 'end_day':
      return 'Memulai proses penutupan hari.';
    default:
      return 'Perintah berhasil diproses.';
  }
} 