"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { VoiceProcessor } from '@/services/ai/VoiceProcessor';
import { SupplyPredictionService } from '@/services/ai/SupplyPrediction';
import { GenAIService } from '@/services/ai/GenAIService';
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
  VoiceCommand
} from '@/types/ai';

/**
 * Hook for Voice Processing (STT/TTS)
 */
export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Function to clear the transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
    setFinalTranscript('');
  }, []);

  // Initialize voice services on mount
  useEffect(() => {
    const initVoice = async () => {
      try {
        const { recognition, synthesis } = await VoiceProcessor.initialize();
        recognitionRef.current = recognition;
        setIsSupported(!!synthesis);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Voice not supported');
        setIsSupported(false);
      }
    };

    initVoice();

    return () => {
      if (recognitionRef.current) {
        VoiceProcessor.stopListening(recognitionRef.current);
      }
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      setError('Voice recognition not initialized');
      return;
    }

    try {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setFinalTranscript('');
      
      await VoiceProcessor.startListening(
        recognitionRef.current,
        (interim: string) => {
          setTranscript(interim);
        },
        (final: VoiceCommand) => {
          setFinalTranscript(final.text);
          setConfidence(final.confidence);
          setIsListening(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice recognition failed');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      VoiceProcessor.stopListening(recognitionRef.current);
      setIsListening(false);
    }
  }, []);

  const speak = useCallback(async (text: string, options?: Partial<VoiceSettings>) => {
    try {
      setIsSpeaking(true);
      setError(null);
      await VoiceProcessor.speak(text, options);
      setIsSpeaking(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Text-to-speech failed');
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    finalTranscript,
    confidence,
    error,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    clearTranscript
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
      // WebSocket connection is optional - don't block initialization if it fails
      try {
        await webSocket.connect();
      } catch (err) {
        console.warn('WebSocket connection failed, continuing without it:', err);
      }
      
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
  const { speak, error } = useVoice();
  
  const [lastCommand, setLastCommand] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  
  // Social post results from voice commands
  const [voiceSocialPostResult, setVoiceSocialPostResult] = useState<{
    imageData: string | null;
    menuName: string;
    status: string;
    timestamp: number;
    error?: string;
  } | null>(null);
  const [isGeneratingSocialPost, setIsGeneratingSocialPost] = useState(false);

  // Report generation state
  const [reportData, setReportData] = useState<{
    text: string;
    html: string;
  } | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const { recognition } = await VoiceProcessor.initialize();
        recognitionRef.current = recognition;
      } catch (e) {
        console.error("Failed to initialize recognition in useVoiceCommands:", e);
      }
    };
    init();

    return () => {
      if (recognitionRef.current) {
        VoiceProcessor.stopListening(recognitionRef.current);
      }
    };
  }, []);

  // Generate daily report function
  const generateReport = useCallback(async () => {
    setIsGeneratingReport(true);
    setReportError(null);
    setReportData(null);
    try {
      const report = await GenAIService.generateDailyReport(getNewToken);
      console.log('Daily report generated:', report);
      setReportData(report);
      return report;
    } catch (err) {
      console.error('Failed to generate report:', err);
      setReportError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setIsGeneratingReport(false);
      console.log('✅ isGeneratingReport set to false');
      // Reset isProcessing immediately after generation completes
      setIsProcessing(false);
      console.log('⚡ isProcessing reset to FALSE after report generation');
    }
  }, [getNewToken]);

  // Generate predictions function
  const generatePredictions = useCallback(async () => {
    try {
      const predictions = await SupplyPredictionService.predictWithAI(getNewToken);
      console.log('Predictions generated:', predictions);
      // The predictions are generated and logged. You can extend this to:
      // - Save to local state
      // - Show in UI
      // - Send via WebSocket
      // - Store in database via API call
    } catch (err) {
      console.error('Failed to generate predictions:', err);
    }
  }, [getNewToken]);

  // Generate social post with image
  const generateSocialPost = useCallback(async (payload: any) => {
    console.log('🖼️ Starting social post generation for:', payload.name);
    setIsGeneratingSocialPost(true);
    
    try {
      const menuName = payload.name;
      const status = payload.status; // 'ready' or 'sold_out'
      
      // Set initial loading state
      setVoiceSocialPostResult({
        imageData: null,
        menuName,
        status,
        timestamp: Date.now()
      });
      
      // Create image prompt based on menu item and status
      const imagePrompt = `Create an appetizing, professional food photography image of ${menuName}, a delicious Indonesian dish. The image should be bright, colorful, and make the food look irresistible. ${status === 'ready' ? 'Show it as freshly prepared and ready to eat. With text saying "READY TO SERVE!"' : 'Show it with a subtle "sold out" overlay.'}`;
      
      console.log('🖼️ Generating social post image via voice command for:', menuName);
      const imageData = await GenAIService.generateImage(imagePrompt);
      
      // Store results for UI display
      setVoiceSocialPostResult({
        imageData,
        menuName,
        status,
        timestamp: Date.now(),
        error: imageData ? undefined : 'No image generated'
      });
      
      if (imageData) {
        console.log('✅ Social post image generated for:', menuName);
        // You can extend this to:
        // - Send image to backend via REST API
        // - Post to social media
        // - Save locally
        // - Display in UI
      } else {
        console.log('❌ No image generated for social post');
      }
    } catch (err) {
      console.error('❌ Failed to generate social post image:', err);
      // Store error for UI display
      setVoiceSocialPostResult({
        imageData: null,
        menuName: payload.name || 'Unknown',
        status: payload.status || 'unknown',
        timestamp: Date.now(),
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    } finally {
      setIsGeneratingSocialPost(false);
      console.log('✅ isGeneratingSocialPost set to false');
      // Reset isProcessing immediately after generation completes
      setIsProcessing(false);
      console.log('⚡ isProcessing reset to FALSE after social post generation');
    }
  }, []);

  const processCommand = useCallback(async (commandText: string) => {
    if (!commandText) return;

    console.log('🚀 processCommand started with:', commandText, {
      isProcessing: isProcessing,
      isGeneratingReport: isGeneratingReport,
      isGeneratingSocialPost: isGeneratingSocialPost
    });

    // Immediately stop listening to prevent interference from new speech
    if (recognitionRef.current && isListening) {
      console.log('🛑 Stopping voice recognition to process command');
      VoiceProcessor.stopListening(recognitionRef.current);
      setIsListening(false);
    }
    
    setIsProcessing(true);
    console.log('⚡ isProcessing set to TRUE');
    // Clear transcripts to prevent confusion
    setTranscript("");
    setFinalTranscript("");
    
    let feedbackMessage = "Maaf, terjadi kesalahan.";
    
    try {
      const command = await VoiceProcessor.processVoiceCommand(commandText, getNewToken);
      setLastCommand({ ...command, timestamp: new Date().getTime() });

      // Clear previous results based on the new command type
      if (command.action === 'DAILY_REPORT') {
        // Clear social post results when generating report
        setVoiceSocialPostResult(null);
        setIsGeneratingSocialPost(false);
      } else if (command.action === 'SOCIAL_POST') {
        // Clear report results when generating social post
        setReportData(null);
        setReportError(null);
        setIsGeneratingReport(false);
      }

      switch (command.action) {
        case 'UPDATE_STOCK':
          await api.stockAPI.addStock(command.payload);
          const stockNames = command.payload.map((item: any) => item.name).join(', ');
          feedbackMessage = `Oke, stok ${stockNames} sudah diperbarui.`;
          break;
        case 'RECORD_SALE':
          await api.salesAPI.recordSales(command.payload);
          const itemNames = command.payload.map((i: any) => `${i.counts} ${i.name}`).join(', ');
          feedbackMessage = `Sip, pesanan ${itemNames} sudah dicatat.`;
          break;
        case 'DAILY_REPORT':
          feedbackMessage = "Oke, laporan harian sedang dibuat. Mohon tunggu sebentar.";
          console.log('🔄 Starting daily report generation...', { isProcessing: isProcessing });
          const reportResult = await generateReport();
          console.log('✅ Daily report generation completed:', !!reportResult, { isProcessing: isProcessing });
          break;
        case 'PREDICTION':
          feedbackMessage = "Oke, prediksi stok sedang dibuat. Mohon tunggu sebentar.";
          await generatePredictions();
          break;
        case 'SOCIAL_POST':
          feedbackMessage = `Oke, saya akan umumkan bahwa ${command.payload.name} sekarang ${command.payload.status === 'ready' ? 'siap' : 'habis'}.`;
          console.log('🖼️ Starting social post generation...', { isProcessing: isProcessing });
          await generateSocialPost(command.payload);
          console.log('✅ Social post generation completed', { isProcessing: isProcessing });
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
      console.log('🏁 About to speak feedback and clear processing state...');
      await speak(feedbackMessage);
      console.log('🏁 Speech feedback completed');
      // isProcessing might already be false from individual generation functions
      if (isProcessing) {
        console.log('🏁 Setting isProcessing to false (if not already reset)...');
        setIsProcessing(false);
        console.log('⚡ isProcessing set to FALSE in finally block');
      } else {
        console.log('ℹ️ isProcessing already false, skipping reset');
      }
      console.log('🏁 Processing state cleared, scheduling transcript cleanup...');
      // Clear any remaining transcripts and add small delay to ensure clean state
      setTimeout(() => {
        setTranscript("");
        setFinalTranscript("");
        console.log('🧹 Transcripts cleaned up');
      }, 100);
    }
<<<<<<< HEAD
  }, [getNewToken, speak, isListening, generateReport, generatePredictions, generateSocialPost]);
=======
  }, [getNewToken, speak, generateReport, generatePredictions, generateSocialPost, isListening, isProcessing, isGeneratingReport, isGeneratingSocialPost]);
>>>>>>> 3669eb593a3161bde948c71e96fe8d1a22f7bcd8

  useEffect(() => {
    if (finalTranscript && !isProcessing && finalTranscript.trim().length > 0) {
      console.log('🎯 Processing voice command:', finalTranscript);
      processCommand(finalTranscript);
    }
  }, [finalTranscript, isProcessing, processCommand]);

  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      console.error('Recognition not initialized');
      return;
    }

    if (isProcessing) {
      console.log('⏳ Cannot start listening: currently processing a command');
      return;
    }

    // Stop any existing recognition first to prevent conflicts
    try {
      if (recognitionRef.current) {
        VoiceProcessor.stopListening(recognitionRef.current);
      }
    } catch (e) {
      console.log('⚠️ Cleanup existing recognition (this is normal)');
    }

    try {
      console.log('🎤 Starting voice recognition...');
      setIsListening(true);
      setTranscript("");
      setFinalTranscript("");
      
      await VoiceProcessor.startListening(
        recognitionRef.current,
        (interim: string) => {
          console.log('Interim transcript:', interim);
          setTranscript(interim);
        },
        (final: VoiceCommand) => {
          console.log('Final transcript:', final.text);
          setIsListening(false);
          setFinalTranscript(final.text);
        }
      );
    } catch (e) {
      console.error("Error during listening:", e);
      setIsListening(false);
      // Force cleanup and retry once
      setTimeout(() => {
        setIsListening(false);
        setTranscript("");
        setFinalTranscript("");
      }, 500);
    }
  }, [isProcessing]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      VoiceProcessor.stopListening(recognitionRef.current);
    }
    setIsListening(false);
  }, []);

  return {
    startListening,
    stopListening,
    isListening,
    isProcessing,
    transcript: finalTranscript || transcript,
    lastCommand,
    error,
    voiceSocialPostResult,
    isGeneratingSocialPost,
    // Report generation states and functions
    generateReport,
    isGeneratingReport,
    reportData,
    reportError,
  };
} 