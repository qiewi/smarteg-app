'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, Square, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiAPI } from '../../lib/api';
import { AIContextProvider, useAIEngine, useVoiceController } from '../../context/AIContextProvider';
import BottomNav from '../../components/common/BottomNav';
import Link from 'next/link';

// Voice Recording Component
function VoiceRecordingComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';
  
  const { voice, isInitialized } = useAIEngine();
  const { 
    startListening, 
    stopListening, 
    isListening, 
    isProcessing, 
    transcript, 
    lastCommand, 
    error 
  } = useVoiceController();

  // Auto-start recording when coming from catat button
  useEffect(() => {
    if (autoStart && isInitialized && !isListening) {
      handleStartRecording();
    }
  }, [autoStart, isInitialized]);

  const handleStartRecording = async () => {
    try {
      console.log('🎤 Starting voice recording...');
      await startListening();
    } catch (err) {
      console.error('❌ Failed to start recording:', err);
    }
  };

  const handleStopRecording = () => {
    try {
      console.log('🛑 Stopping voice recording...');
      stopListening();
    } catch (err) {
      console.error('❌ Failed to stop recording:', err);
    }
  };

  const handleBackToHome = () => {
    if (isListening) {
      handleStopRecording();
    }
    router.push('/home');
  };

  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (isProcessing) return 'Memproses...';
    if (isListening) return 'Mendengarkan...';
    if (voice.isSpeaking) return 'Berbicara..';
    if (!isInitialized) return 'Menyiapkan...';
    return 'Siap melayani';
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col" style={{ backgroundImage: 'url(/bg-cta.jpg)' }}>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header Section */}
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center space-x-4">
            <button onClick={handleBackToHome} className="inline-flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-md text-white hover:bg-white/30 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Asisten Cerdas</h1>
              <p className="text-white/80">Atur penjualan dan stok dengan suara</p>
            </div>
          </div>

          {/* Status Indicator
          <div className="text-center mt-8">
            <div className={`text-lg font-medium text-white`}>
              Status: {getStatusText()}
            </div>
          </div> */}

          {/* Recording Status Visual */}
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-md h-32 bg-none rounded-lg p-4 flex items-center justify-center text-white">
              {isListening ? (
                <div className="text-center">
                  <div className="relative">
                    <Mic size={48} className="text-white mx-auto mb-2" />
                    {/* Pulsing animation */}
                    <div className="absolute inset-0 animate-ping">
                      <Mic size={48} className="text-accent opacity-75" />
                    </div>
                  </div>
                  <p className="text-white font-medium">Sedang mendengarkan..</p>
                </div>
              ) : (
                <div className="text-white text-center">
                  <p>Tekan tombol di bawah untuk mulai bicara</p>
                </div>
              )}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex justify-center mt-8">
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={handleStopRecording}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative"
                >
                  {/* Gradient Background Circle */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl transition-all duration-300">
                    {/* Inner Circle */}
                    <div className="w-[72px] h-[72px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Square size={32} className="text-white" fill="currentColor" />
                    </div>
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  key="start"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  onClick={handleStartRecording}
                  disabled={!isInitialized}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative"
                >
                  {/* Gradient Background Circle */}
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                    !isInitialized 
                      ? "bg-gradient-to-br from-gray-400 to-gray-500" 
                      : "bg-gradient-to-br from-primary to-accent"
                  }`}>
                    {/* Inner Circle */}
                    <div className="w-[72px] h-[72px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Mic size={32} className="text-white" />
                    </div>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Content - White background with rounded top corners */}
        <div className="flex-1 bg-white rounded-t-3xl px-6 pb-32 pt-6">
          {/* Separator above content */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-1 bg-gray-200 rounded-full"></div>
          </div>

          {/* Live Transcript */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Kata-Kata Anda</h2>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto border border-gray-200">
              {transcript ? (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {transcript}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  Bicara agar dapat ditangkap...
                </p>
              )}
              
              {isProcessing && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-500">Sedang memahami...</span>
                </div>
              )}
            </div>
          </div>

          {/* Parsed Command Result */}
          {lastCommand && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Perintah Anda</h2>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(lastCommand, null, 2)}
                </pre>
              </div>
            </motion.div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Usage Instructions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Panduan Penggunaan</h2>
            <div className="space-y-4">
              <p className="text-gray-600 font-medium">Coba sebut perintah berikut:</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📦</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Stock Management</p>
                      <p className="text-gray-600 text-xs">"tambah stok ayam goreng 20 potong"</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📝</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Sales Recording</p>
                      <p className="text-gray-600 text-xs">"catat pesanan 2 nasi telur sama 1 es teh"</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📢</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Menu Announcement</p>
                      <p className="text-gray-600 text-xs">"umumkan rendang sudah siap"</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-400/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">❌</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Sold Out</p>
                      <p className="text-gray-600 text-xs">"perkedel habis"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

// Main Voice Page Component
export default function VoicePage() {
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
      console.log('🔑 Verifying AI token for voice page...');
      try {
        setTokenLoading(true);
        await getNewToken();
        console.log('✅ AI token verified successfully');
        setTokenError(null);
      } catch (err) {
        console.error('❌ Failed to get token:', err);
        setTokenError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setTokenLoading(false);
      }
    };

    verifyToken();
  }, []);

  if (tokenLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing AI...</p>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Failed to initialize AI</p>
          <p className="mb-4">Error: {tokenError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AIContextProvider getNewToken={getNewToken}>
      <VoiceRecordingComponent />
    </AIContextProvider>
  );
}
