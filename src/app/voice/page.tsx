'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, Square, ArrowLeft, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { geminiAPI } from '../../lib/api';
import { AIContextProvider, useAIEngine, useVoiceCommands } from '../../context/AIContextProvider';
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
    error,
    voiceSocialPostResult,
    isGeneratingSocialPost,
    // Report generation states and functions from useVoiceCommands
    generateReport,
    isGeneratingReport,
    reportData,
    reportError
  } = useVoiceCommands();

  // Memoize generateReport to prevent unnecessary re-renders
  const memoizedGenerateReport = useCallback(() => {
    console.log('🚀 Calling generateReport from useVoiceCommands hook...');
    generateReport();
  }, [generateReport]);

  // Popup state management
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [popupType, setPopupType] = useState<'image' | 'pdf' | null>(null);
  const [popupData, setPopupData] = useState<any>(null);
  
  // Track last processed command timestamp to prevent infinite loops
  const lastProcessedRef = useRef<number | null>(null);

  // Auto-start recording when coming from catat button
  useEffect(() => {
    if (autoStart && isInitialized && !isListening) {
      handleStartRecording();
    }
  }, [autoStart, isInitialized]);

  // Clear results when starting a new voice command (only clear popup, keep results visible)
  useEffect(() => {
    if (isListening) {
      // Only close popup, but keep results visible so user can still see previous outputs
      setShowDownloadPopup(false);
    }
  }, [isListening]);

  // Monitor lastCommand to trigger report generation and clear conflicting results
  useEffect(() => {
    if (lastCommand && lastCommand.timestamp && lastCommand.action === 'DAILY_REPORT') {
      const commandId = lastCommand.timestamp;
      
      // Check if this command has already been processed
      if (lastProcessedRef.current === commandId) {
        console.log('⏭️ Command already processed, skipping...');
        return;
      }
      
      console.log('🔄 Daily report command detected, generating report...', { commandId, lastProcessed: lastProcessedRef.current });
      
      // Mark this command as processed
      lastProcessedRef.current = commandId;
      
      // Generate the report using useVoiceCommands hook
      memoizedGenerateReport();
    }
  }, [lastCommand]);

  // Debug reportData changes
  useEffect(() => {
    console.log('📊 Report data changed:', { reportData, isReportLoading: isGeneratingReport, reportError });
  }, [reportData, isGeneratingReport, reportError]);

  // Debug voiceSocialPostResult changes
  useEffect(() => {
    console.log('🖼️ Voice social post result changed:', { voiceSocialPostResult, isGeneratingSocialPost, isProcessing });
  }, [voiceSocialPostResult, isGeneratingSocialPost, isProcessing]);

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

  const handleDownloadImage = () => {
    if (popupData && popupData.imageData) {
      // Create download link for image
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${popupData.imageData}`;
      link.download = `${popupData.menuName || 'menu'}_${popupData.status || 'status'}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Image download initiated');
      setShowDownloadPopup(false);
    }
  };

  const handleDownloadPdf = () => {
    if (popupData && popupData.html) {
      console.log('ℹ️ Preparing PDF download...');
      const element = document.createElement('div');
      element.innerHTML = popupData.html;
      
      // Use html2pdf.js to generate and download the PDF
      // @ts-ignore
      html2pdf(element, {
        margin: 1,
        filename: `daily_report_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      }).then(() => {
        console.log('✅ PDF download initiated.');
        setShowDownloadPopup(false);
      });
    }
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

          {/* Voice Social Post Result Display */}
          {(voiceSocialPostResult || isGeneratingSocialPost) && (() => {
            console.log('🎯 Rendering Voice Social Post section:', { 
              hasResult: !!voiceSocialPostResult, 
              isGenerating: isGeneratingSocialPost,
              resultData: voiceSocialPostResult 
            });
            return true;
          })() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Hasil Gambar</h2>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                {isGeneratingSocialPost ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    <div className="text-green-700">
                      <p className="font-medium">Sedang membuat gambar...</p>
                      <p className="text-sm">Harap tunggu, AI sedang menghasilkan gambar makanan yang menarik</p>
                    </div>
                  </div>
                ) : voiceSocialPostResult && voiceSocialPostResult.imageData ? (
                  <div className="space-y-4">
                    <div className="text-sm text-green-700">
                      <p><strong>Menu:</strong> {voiceSocialPostResult.menuName}</p>
                      <p><strong>Status:</strong> {voiceSocialPostResult.status}</p>
                      <p><strong>Debug:</strong> Image data length: {voiceSocialPostResult.imageData?.length || 0} characters</p>
                    </div>
                    <div className="flex justify-center">
                      <img 
                        src={`data:image/png;base64,${voiceSocialPostResult.imageData}`}
                        alt={`Generated image of ${voiceSocialPostResult.menuName}`}
                        className="w-full max-w-md h-auto rounded-lg shadow-md border"
                        onLoad={() => console.log('✅ Image loaded successfully')}
                        onError={(e) => console.error('❌ Image failed to load:', e)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setPopupType('image');
                          setPopupData(voiceSocialPostResult);
                          setShowDownloadPopup(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity space-x-2"
                      >
                        <Download size={16} />
                        <span>Download Gambar</span>
                      </button>
                    </div>
                  </div>
                ) : voiceSocialPostResult && voiceSocialPostResult.error ? (
                  <div className="bg-red-100 border border-red-300 rounded p-3">
                    <p className="text-red-700 text-sm"><strong>Error:</strong> {voiceSocialPostResult.error}</p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Report Display */}
          {(isGeneratingReport || reportData) && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Laporan Harian</h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                {isGeneratingReport ? (
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <div className="text-blue-700">
                      <p className="font-medium">Sedang membuat laporan harian...</p>
                      <p className="text-sm">Menganalisis data penjualan dan stok</p>
                    </div>
                  </div>
                ) : reportData && reportData.html ? (
                  <div className="space-y-4">
                    <div className="text-sm text-blue-700">
                      <p><strong>Status:</strong> Laporan berhasil dibuat</p>
                      <p><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID')}</p>
                    </div>
                    
                    {/* PDF Ready Indicator */}
                    <div className="bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-lg">✅</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">Laporan Berhasil Dibuat</h4>
                          <p className="text-sm text-gray-600">Laporan harian telah siap untuk diunduh dalam format PDF</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-sm">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Laporan siap diunduh</p>
                          <p className="text-sm text-gray-600">Format PDF - ~{Math.round(reportData.html.length / 1024)} KB</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setPopupType('pdf');
                          setPopupData(reportData);
                          setShowDownloadPopup(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity space-x-2"
                      >
                        <Download size={16} />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                ) : reportError ? (
                  <div className="bg-red-100 border border-red-300 rounded p-3">
                    <p className="text-red-700 text-sm"><strong>Error:</strong> {reportError}</p>
                  </div>
                ) : null}
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
                    <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📊</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">Daily Report</p>
                      <p className="text-gray-600 text-xs">"buat laporan harian"</p>
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

      {/* Download Popup */}
      <AnimatePresence>
        {showDownloadPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDownloadPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-4 sm:p-6 max-w-xs sm:max-w-md w-full mx-4 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {popupType === 'image' ? 'Download Gambar' : 'Download Laporan'}
                </h3>
                <button
                  onClick={() => setShowDownloadPopup(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="mb-4 sm:mb-6">
                {popupType === 'image' && popupData ? (
                  <div className="space-y-3 sm:space-y-4">
                    <img 
                      src={`data:image/png;base64,${popupData.imageData}`}
                      alt={`Generated image of ${popupData.menuName}`}
                      className="w-full h-auto rounded-lg shadow-md border max-h-60 sm:max-h-80 object-cover"
                    />
                    <div className="text-sm text-gray-600">
                      <p><strong>Menu:</strong> {popupData.menuName}</p>
                      <p><strong>Status:</strong> {popupData.status === 'ready' ? 'Siap disajikan' : 'Sold out'}</p>
                    </div>
                  </div>
                ) : popupType === 'pdf' && popupData ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                          <span className="text-lg">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Laporan Harian</p>
                          <p className="text-sm text-gray-600">Siap untuk diunduh dalam format PDF</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <p><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID')}</p>
                        <p><strong>Size:</strong> ~{Math.round(popupData.html.length / 1024)} KB</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowDownloadPopup(false)}
                  className="flex-1 px-4 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm sm:text-base"
                >
                  Tutup
                </button>
                <button
                  onClick={popupType === 'image' ? handleDownloadImage : handleDownloadPdf}
                  className="flex-1 px-4 py-2 sm:py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <Download size={16} className="sm:w-5 sm:h-5" />
                  <span>Download {popupType === 'image' ? 'Gambar' : 'PDF'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
