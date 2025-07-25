'use client';

import React, { useState, useEffect } from 'react';
import { geminiAPI } from '../../lib/api';
import { AIContextProvider, useAIEngine, useVoiceCommands } from '../../context/AIContextProvider';
import { GenAIService } from '../../services/ai/GenAIService';
import { preparePdfContent } from '../../lib/utils';
import type { PredictionData } from '../../types/ai';

const getNewToken = async () => {
  const response = await geminiAPI.getToken();
  return (response as any).data;
};

// Test component that uses the AI context
function AITestComponent() {
  const { voice, webSocket, prediction, isInitialized } = useAIEngine();
  const { 
    startListening, 
    stopListening, 
    isListening, 
    isProcessing, 
    transcript, 
    lastCommand, 
    error, 
    voiceSocialPostResult, 
    isGeneratingSocialPost,
    // Report generation states and functions from useVoiceCommands
    generateReport,
    isGeneratingReport,
    reportData,
    reportError
  } = useVoiceCommands();

  const [predictionResult, setPredictionResult] = useState<PredictionData[] | null>(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  
  const [lastProcessedCommand, setLastProcessedCommand] = useState<any>(null);

  // Social Post Generation Test State
  const [socialPostLoading, setSocialPostLoading] = useState(false);
  const [socialPostResult, setSocialPostResult] = useState<string | null>(null);
  const [socialPostError, setSocialPostError] = useState<string | null>(null);
  const [menuName, setMenuName] = useState('rendang');
  const [menuStatus, setMenuStatus] = useState<'ready' | 'sold_out'>('ready');


  // This is now handled by the useVoiceCommands hook
  // useEffect(() => {
  //   if (lastCommand && lastCommand?.timestamp !== lastProcessedCommand?.timestamp && lastCommand?.action === 'DAILY_REPORT') {
  //     console.log('ℹ️ DAILY_REPORT action detected via voice, generating report...');
  //     generateReport();
  //     setLastProcessedCommand(lastCommand);
  //   }
  // }, [lastCommand, generateReport, lastProcessedCommand]);

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

  const handleGenerateSocialPost = async () => {
    setSocialPostLoading(true);
    setSocialPostResult(null);
    setSocialPostError(null);
    
    try {
      const imagePrompt = `Create an appetizing, professional food photography image of ${menuName}, a delicious Indonesian dish. The image should be bright, colorful, and make the food look irresistible. ${menuStatus === 'ready' ? 'Show it as freshly prepared and ready to eat. With text saying "READY TO SERVE!"' : 'Show it with a subtle "sold out" overlay.'}`;
      
      console.log('🖼️ Generating social post image with prompt:', imagePrompt);
      
      const imageData = await GenAIService.generateImage(imagePrompt, getNewToken);
      
      if (imageData) {
        setSocialPostResult(imageData);
        console.log('✅ Social post image generated successfully');
      } else {
        setSocialPostError('No image was generated');
      }
    } catch (err) {
      console.error('❌ Social post generation failed:', err);
      setSocialPostError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setSocialPostLoading(false);
    }
  };
  
  const handlePrintPdf = () => {
    if (reportData?.html) {
      console.log('🖨️ Preparing PDF for printing...');
      
      try {
        // Prepare HTML content with enhanced styling
        const enhancedHtml = preparePdfContent(reportData.html);
        
        console.log('📝 HTML content length:', reportData.html.length);
        console.log('🔍 Opening print window...');
        
        // Create a new window with the content
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(enhancedHtml);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
          printWindow.close();
          
          console.log('✅ Print dialog opened successfully');
        } else {
          throw new Error('Failed to open print window. Please allow popups for this site.');
        }
        
      } catch (error) {
        console.error('❌ Print failed:', error);
        alert('Gagal membuka dialog cetak. Pastikan popup diizinkan untuk situs ini.');
      }
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

          {(voiceSocialPostResult || isGeneratingSocialPost) && (
            <div className="bg-green-50 p-4 rounded border border-green-200">
              <h3 className="font-medium mb-2 text-green-800">
                Voice Social Post Result:
                {isGeneratingSocialPost && (
                  <span className="ml-2 inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-sm font-normal">Generating...</span>
                  </span>
                )}
              </h3>
              
              {voiceSocialPostResult && (
                <div className="space-y-4">
                  <div className="text-sm text-green-700">
                    <p><strong>Menu:</strong> {voiceSocialPostResult.menuName}</p>
                    <p><strong>Status:</strong> {voiceSocialPostResult.status}</p>
                    <p><strong>Generated:</strong> {new Date(voiceSocialPostResult.timestamp).toLocaleString()}</p>
                  </div>
                  
                  {voiceSocialPostResult.error ? (
                    <div className="bg-red-100 border border-red-300 rounded p-3">
                      <p className="text-red-700 text-sm"><strong>Error:</strong> {voiceSocialPostResult.error}</p>
                    </div>
                  ) : voiceSocialPostResult.imageData ? (
                    <div className="space-y-2">
                      <img 
                        src={`data:image/png;base64,${voiceSocialPostResult.imageData}`}
                        alt={`Generated image of ${voiceSocialPostResult.menuName}`}
                        className="max-w-sm h-auto rounded-lg shadow-md border"
                      />
                      <p className="text-xs text-green-600">
                        Image size: {Math.round(voiceSocialPostResult.imageData.length * 0.75 / 1024)} KB
                      </p>
                    </div>
                  ) : isGeneratingSocialPost ? (
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <div className="text-blue-700">
                        <p className="font-medium">Sedang membuat gambar...</p>
                        <p className="text-sm">Harap tunggu, AI sedang menghasilkan gambar makanan yang menarik</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-yellow-700 text-sm">Waiting for image generation to complete...</p>
                  )}
                </div>
              )}
              
              {isGeneratingSocialPost && !voiceSocialPostResult && (
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <div className="text-blue-700">
                    <p className="font-medium">Memulai pembuatan gambar...</p>
                    <p className="text-sm">AI sedang memproses permintaan voice command Anda</p>
                  </div>
                </div>
              )}
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
            <li><strong>Menu Announcement:</strong> "umumkan rendang sudah siap" <em>(generates image!)</em></li>
            <li><strong>Sold Out:</strong> "perkedel habis" <em>(generates image!)</em></li>
            <li><strong>Daily Report:</strong> "buat laporan harian"</li>
            <li><strong>Predictions:</strong> "prediksi stok besok" <em>(if voice command supports PREDICTION action)</em></li>
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

      {/* Daily Report Section */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Report</h2>
        
        <button
          onClick={() => generateReport()}
          disabled={isGeneratingReport || !isInitialized}
          className="px-6 py-2 bg-purple-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGeneratingReport ? 'Generating Report...' : 'Generate Daily Report'}
        </button>

        {reportData && (
          <div className="mt-4 bg-gray-50 p-4 rounded border">
            <h3 className="font-medium mb-2">Report Text:</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {reportData.text}
            </pre>
            <button
              onClick={handlePrintPdf}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded flex items-center space-x-2"
            >
              <span>🖨️</span>
              <span>Cetak PDF</span>
            </button>
          </div>
        )}
        {reportError && (
          <div className="mt-4 text-red-500">
            Error generating report: {reportError}
          </div>
        )}
      </div>

      {/* Social Post Generation Section */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Social Post Generation Test</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Name
              </label>
              <input
                type="text"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., rendang, nasi goreng"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={menuStatus}
                onChange={(e) => setMenuStatus(e.target.value as 'ready' | 'sold_out')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ready">Ready</option>
                <option value="sold_out">Sold Out</option>
              </select>
            </div>
          </div>

                  <button
          onClick={handleGenerateSocialPost}
          disabled={socialPostLoading || !isInitialized || !menuName}
          className="px-6 py-2 bg-orange-500 text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {socialPostLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          )}
          <span>{socialPostLoading ? 'Generating Image...' : 'Generate Social Post Image'}</span>
        </button>
      </div>

      {socialPostLoading && (
        <div className="mt-4 bg-blue-50 p-4 rounded border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div className="text-blue-700">
              <p className="font-medium">Sedang membuat gambar "{menuName}"</p>
              <p className="text-sm">Status: {menuStatus === 'ready' ? 'Siap disajikan' : 'Sold out'}</p>
              <p className="text-xs text-blue-600">Proses ini mungkin memakan waktu 10-30 detik...</p>
            </div>
          </div>
        </div>
      )}

      {socialPostResult && (
        <div className="mt-4 bg-gray-50 p-4 rounded border">
          <h3 className="font-medium mb-2">Generated Social Post Image:</h3>
          <div className="space-y-4">
            <img 
              src={`data:image/png;base64,${socialPostResult}`}
              alt={`Generated image of ${menuName}`}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            <div className="text-xs text-gray-600">
              <p><strong>Menu:</strong> {menuName}</p>
              <p><strong>Status:</strong> {menuStatus === 'ready' ? 'Ready to serve' : 'Sold out'}</p>
              <p><strong>Image Size:</strong> {Math.round(socialPostResult.length * 0.75 / 1024)} KB (base64)</p>
            </div>
          </div>
        </div>
      )}

        {socialPostError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">Generation Error</h3>
            <p className="text-red-700">{socialPostError}</p>
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