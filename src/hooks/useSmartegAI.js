// src/hooks/useSmartegAI.js
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Corrected package name and added Modality
import { GoogleGenAI, Modality } from "@google/genai";
import { createCommandParserPrompt, createPredictionPrompt } from '../lib/prompt';
import * as api from '../lib/api';

// Use a specific model for the live connection as per the docs
const LIVE_MODEL_NAME = 'gemini-2.0-flash-live-001'; // Recommended to use latest models
const BATCH_MODEL_NAME = 'gemini-2.5-flash-lite';


// A polyfill for browsers that use the prefixed webkitSpeechRecognition
// Only initialize on client-side to avoid SSR issues
const getSpeechRecognition = () => {
    if (typeof window !== 'undefined') {
        return window.SpeechRecognition || window.webkitSpeechRecognition;
    }
    return null;
};

/**
 * A hook to manage all AI interactions for the Smarteg application.
 * This version uses the browser's built-in SpeechRecognition and SpeechSynthesis APIs
 * for a simpler and more robust implementation.
 * @param {{ getNewToken: () => Promise<{ name:string}> }} props
 */
export function useSmartegAI({ getNewToken }) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    // Ref to hold the SpeechRecognition instance
    const recognitionRef = useRef(null);
    const transcriptRef = useRef('');


    const speak = useCallback((text) => {
        if (!text || typeof window === 'undefined') return;
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'id-ID';
            utterance.onstart = () => setIsSpeaking(true);
            utterance.onend = () => setIsSpeaking(false);
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.error("Speech synthesis failed:", e);
            setIsSpeaking(false);
        }
    }, []);

    const processFinalTranscript = useCallback(async (finalTranscript) => {
        if (!finalTranscript.trim()) return;
        setIsProcessing(true);
        setError(null);
        let feedbackMessage = "Maaf, terjadi kesalahan.";

        try {
            const freshToken = await getNewToken();
            if (!freshToken?.name) throw new Error("Could not get a valid token for processing.");
            
            const genAI = new GoogleGenAI({ apiKey: freshToken.name, httpOptions: { apiVersion: 'v1alpha' } });
            const prompt = createCommandParserPrompt(finalTranscript);

            // This function wraps the live session in a Promise
            const getLiveResponse = () => new Promise(async (resolve, reject) => {
                let accumulatedText = '';
                
                try {
                    const session = await genAI.live.connect({
                        model: LIVE_MODEL_NAME,
                        config: {
                            responseModalities: [Modality.TEXT],
                        },
                        callbacks: {
                            onopen: () => {
                                console.log('Live session opened.');
                                // Don't send input here - session object isn't available yet
                            },
                            onmessage: (message) => {
                                // Accumulate text from streamed messages
                                if (message.text) {
                                    accumulatedText += message.text;
                                }
                                // When the turn is complete, resolve the promise
                                if (message.serverContent?.turnComplete) {
                                    console.log('Live session turn complete.');
                                    session.close();
                                    resolve(accumulatedText);
                                }
                            },
                            onerror: (e) => {
                                console.error('Live session error:', e);
                                reject(e);
                            },
                            onclose: () => {
                                console.log('Live session closed.');
                            },
                        },
                    });
                    
                    // Now the session is established, send the input
                    console.log("Prompt to send: ", prompt);
                    session.sendRealtimeInput({ text: prompt });
                    
                } catch (e) {
                    reject(e);
                }
            });

            const responseText = await getLiveResponse();
            
            const jsonString = responseText.replace(/```json|```/g, '').trim();
            const command = JSON.parse(jsonString);
            
            console.log("✅ Parsed Command:", command);

            switch (command.action) {
                case 'UPDATE_STOCK':
                    await api.updateStock(command.payload);
                    feedbackMessage = `Oke, stok ${command.payload.itemName} sudah diperbarui.`;
                    break;
                case 'RECORD_SALE':
                    await api.recordSale(command.payload);
                    const itemNames = command.payload.items.map(i => `${i.quantity} ${i.itemName}`).join(', ');
                    feedbackMessage = `Sip, pesanan ${itemNames} sudah dicatat.`;
                    break;
                default:
                    feedbackMessage = "Maaf, saya tidak mengerti maksud Anda.";
                    break;
            }
        } catch (e) {
            console.error("❌ Failed to process command:", e);
            feedbackMessage = "Sepertinya sedang offline atau terjadi kesalahan. Perintah tidak dapat diproses.";
        } finally {
            speak(feedbackMessage);
            setIsProcessing(false);
        }
    }, [getNewToken, speak]);

    const startInteraction = useCallback(() => {
        const SpeechRecognition = getSpeechRecognition();
        
        if (isListening || !SpeechRecognition) {
            setError("Speech recognition is not supported by this browser.");
            return;
        }

        setError(null);
        setTranscript('');

        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.lang = 'id-ID';
        recognition.interimResults = true; // Get results as the user speaks
        recognition.continuous = false; // Stop after a pause

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(interimTranscript || finalTranscript);
            transcriptRef.current = interimTranscript || finalTranscript;
            if (finalTranscript) {
                console.log(`Final transcript: "${finalTranscript}"`);
                processFinalTranscript(finalTranscript.trim());
            }
        };

        recognition.onstart = () => {
            console.log("🎤 Speech recognition started.");
            setIsListening(true);
        };

        recognition.onend = () => {
            console.log("🛑 Speech recognition ended.");
            setIsListening(false);
            if (!transcriptRef.current.trim()) {
                speak("Maaf, saya tidak mendeteksi ucapan apa pun.");
            }
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setError(`Speech recognition error: ${event.error}`);
            setIsListening(false);
        };
        
        recognition.start();

    }, [isListening, processFinalTranscript, speak]);

    const stopInteraction = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            if (typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Function for non-streaming, text-based prediction task
    const getSupplyPrediction = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const freshToken = await getNewToken();
            if (!freshToken?.name) throw new Error("Could not get a valid token for processing.");

            // This function uses the standard non-streaming API which is correct for this task
            const genAI = new GoogleGenAI({ apiKey: freshToken.name, httpOptions: { apiVersion: 'v1alpha' } });
            const model = genAI.getGenerativeModel({ model: BATCH_MODEL_NAME });

            const historicalData = await api.getHistoricalData();
            const prompt = createPredictionPrompt(historicalData);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const responseText = response.text();

            const jsonString = responseText.replace(/```json|```/g, '').trim();
            return JSON.parse(jsonString);
        } catch(e) {
            console.error("Failed to get supply prediction:", e);
            setError("Gagal mendapatkan prediksi pasokan.");
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        isListening,
        isSpeaking,
        isProcessing,
        transcript,
        error,
        startInteraction,
        stopInteraction,
        getSupplyPrediction,
    };
}
