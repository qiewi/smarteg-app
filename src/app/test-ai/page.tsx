'use client';

import React, { useState, useEffect } from 'react';
import { geminiAPI } from '../../lib/api';
import { AIContextProvider, useAIEngine, useVoiceController } from '../../context/AIContextProvider';
import type { PredictionData } from '../../types/ai';

// Test component that uses the AI context
function AITestComponent() {
  const { voice, webSocket, prediction, isInitialized } = useAIEngine();
  const { startListening, stopListening, isListening, isProcessing, transcript, lastCommand, error } = useVoiceController();

  const [predictionResult, setPredictionResult] = useState<PredictionData[] | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);

  const handleStartInteraction = async () => {
    console.log('🎤 Starting voice interaction...');
    try {
      await startListening();
      console.log('✅ Voice interaction started successfully');
    } catch (err) {
      console.error('❌ Failed to start voice interaction:', err);
    }
  };

  const handleStopInteraction = () => {
    console.log('🛑 Stopping voice interaction...');
    try {
      stopListening();
      console.log('✅ Voice interaction stopped successfully');
    } catch (err) {
      console.error('❌ Failed to stop voice interaction:', err);
    }
  };

  const handleGetPrediction = async () => {
    setPredictionLoading(true);
    setPredictionResult(null);
    try {
      // The generatePredictions function now requires the getNewToken function
      const getNewToken = async () => {
        const response = await geminiAPI.getToken();
        return (response as any).data;
      };
      await (prediction.generatePredictions as any)(getNewToken);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setPredictionLoading(false);
    }
  };
  
  // Update local state when prediction data changes
  useEffect(() => {
    if (prediction.predictions) {
      setPredictionResult(prediction.predictions);
    }
  }, [prediction.predictions]);


  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isProcessing) return 'text-yellow-500';
    if (isListening) return 'text-green-500';
    if (voice.isSpeaking) return 'text-blue-500';
    return 'text-gray-500';
  };

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isProcessing) return 'Processing Command...';
    if (isListening) return 'Listening...';
    if (voice.isSpeaking) return 'Speaking...';
    if (!isInitialized) return 'Initializing...';
    return 'Ready';
  };

  // Log state changes for debugging
  useEffect(() => {
    console.log('🔄 AI State changed:', {
      isInitialized,
      isListening,
      isSpeaking: voice.isSpeaking,
      isProcessing,
      hasError: !!error,
      transcript: transcript?.substring(0, 50) + (transcript?.length > 50 ? '...' : ''),
      lastCommand,
      webSocketStatus: webSocket.connectionStatus,
    });
  }, [isInitialized, isListening, voice.isSpeaking, isProcessing, error, transcript, lastCommand, webSocket.connectionStatus]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">SmartegAI Test Page</h1>
      
      {/* Status Section */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">AI Status</h2>
        <div className={`text-lg font-medium ${getStatusColor()}`}>
          Status: {getStatusText()}
        </div>
        
        <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className={`p-2 rounded ${isListening ? 'bg-green-200' : 'bg-gray-200'}`}>
            Listening: {isListening ? 'ON' : 'OFF'}
          </div>
          <div className={`p-2 rounded ${voice.isSpeaking ? 'bg-blue-200' : 'bg-gray-200'}`}>
            Speaking: {voice.isSpeaking ? 'ON' : 'OFF'}
          </div>
          <div className={`p-2 rounded ${isProcessing ? 'bg-yellow-200' : 'bg-gray-200'}`}>
            Processing: {isProcessing ? 'ON' : 'OFF'}
          </div>
          <div className={`p-2 rounded ${error ? 'bg-red-200' : 'bg-gray-200'}`}>
            Error: {error ? 'YES' : 'NO'}
          </div>
        </div>
      </div>

      {/* Voice Interaction Section */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Voice Interaction Test</h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={handleStartInteraction}
              disabled={isListening || !isInitialized}
              className="px-6 py-2 bg-green-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isListening ? 'Listening...' : 'Start Voice Interaction'}
            </button>
            
            <button
              onClick={handleStopInteraction}
              disabled={!isListening}
              className="px-6 py-2 bg-red-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Stop Interaction
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded border min-h-[100px]">
            <h3 className="font-medium mb-2">Live Transcript:</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {transcript || 'No transcript yet...'}
            </p>
          </div>
          
          {lastCommand && (
            <div className="bg-gray-50 p-4 rounded border">
              <h3 className="font-medium mb-2">Last Parsed Command:</h3>
              <pre className="text-sm text-gray-700 overflow-x-auto">
                {JSON.stringify(lastCommand, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Test Commands Section */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Commands (Voice)</h2>
        <div className="space-y-2 text-sm">
          <h3 className="font-medium">Try saying these commands:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li><strong>Stock Management:</strong> "tambah stok ayam goreng 20 potong"</li>
            <li><strong>Sales Recording:</strong> "catat pesanan 2 nasi telur sama 1 es teh"</li>
            <li><strong>Menu Announcement:</strong> "umumkan rendang sudah siap"</li>
            <li><strong>Sold Out:</strong> "perkedel habis"</li>
          </ul>
        </div>
      </div>

      {/* Supply Prediction Section */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Supply Prediction Test</h2>
        
        <button
          onClick={handleGetPrediction}
          disabled={prediction.isLoading || !isInitialized}
          className="px-6 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {prediction.isLoading ? 'Getting Prediction...' : 'Get Supply Prediction'}
        </button>

        {predictionResult && (
          <div className="mt-4 bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Prediction Result:</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {JSON.stringify(predictionResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Debug Info */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
        
        <div className="text-xs text-gray-600 space-y-1">
          <p>WebSocket Status: {webSocket.connectionStatus}</p>
          <p>Make sure you have:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Microphone permissions enabled</li>
            <li>Valid API token</li>
            <li>Internet connection for API calls</li>
            <li>Browser support for Web Speech API</li>
          </ul>
          <p className="mt-2 font-medium">Check the browser console for detailed logs.</p>
        </div>
      </div>
    </div>
  );
}

// Main page component with token management
export default function TestAIPage() {
  const [tokenLoading, setTokenLoading] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Function to get a fresh token (for single-use ephemeral tokens)
  const getNewToken = async (): Promise<{ name: string }> => {
    try {
        const response = await geminiAPI.getToken();
        return (response as any).data;
    } catch (error) {
        console.error("Failed to get new token:", error);
        throw error;
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      console.log('🔑 Verifying initial AI token...');
      try {
        setTokenLoading(true);
        await getNewToken(); // This will throw if it fails
        console.log('✅ Initial AI token verified successfully');
        setTokenError(null);
      } catch (err) {
        console.error('❌ Failed to get initial token:', err);
        setTokenError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setTokenLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Verifying AI token...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Failed to initialize AI</p>
          <p className="mb-4">Error: {tokenError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AIContextProvider getNewToken={getNewToken}>
      <div className="min-h-screen bg-gray-100">
        <AITestComponent />
      </div>
    </AIContextProvider>
  );
} 