/**
 * GenAI Service
 *
 * This service class encapsulates all interactions with the Google Generative AI API.
 * It provides methods for parsing natural language commands and generating supply predictions.
 * This centralization helps in separating the AI logic from the rest of the application,
 * making it easier to manage, update, and test.
 *
 * References:
 * - Google AI for Developers: https://ai.google.dev/gemini-api/docs/live
 * - Real-time Audio Streaming Guide: https://medium.com/google-cloud/real-time-audio-to-audio-streaming-with-googles-multimodal-live-api-73b54277b022
 */
import { GoogleGenAI, Modality } from "@google/genai";
import { createCommandParserPrompt, createPredictionPrompt } from '@/lib/prompt';
import * as api from '@/lib/api'; 

// Recommended to use the latest models for live and batch processing
const LIVE_MODEL_NAME = 'gemini-2.0-flash-live-001';

export class GenAIService {
  private static genAI: GoogleGenAI | null = null;

  /**
   * Initializes the GoogleGenAI instance with the provided API key.
   * This must be called before any other method.
   * @param apiKey The Google AI API key.
   */
  private static initialize(apiKey: string) {
    if (!this.genAI) {
      this.genAI = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
    }
  }

  /**
   * Establishes a live connection to the GenAI model and processes a prompt.
   * This is used for real-time interactions like command parsing.
   * @param prompt The prompt to send to the model.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves with the accumulated text response from the model.
   */
  private static async getLiveResponse(prompt: string, getNewToken: () => Promise<{ name: string }>): Promise<string> {
    const freshToken = await getNewToken();
    if (!freshToken?.name) {
      throw new Error("Could not get a valid token for processing.");
    }
    this.initialize(freshToken.name);

    return new Promise(async (resolve, reject) => {
      let accumulatedText = '';
      try {
        const session = await this.genAI!.live.connect({
          model: LIVE_MODEL_NAME,
          config: {
            responseModalities: [Modality.TEXT],
          },
          callbacks: {
            onopen: () => console.log('Live session opened.'),
            onmessage: (message) => {
              if (message.text) {
                accumulatedText += message.text;
              }
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
            onclose: () => console.log('Live session closed.'),
          },
        });

        session.sendRealtimeInput({ text: prompt });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Parses a natural language transcript into a structured command using the AI model.
   * @param transcript The user's voice transcript.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves to the parsed command object.
   */
  static async parseCommand(transcript: string, getNewToken: () => Promise<{ name: string }>): Promise<any> {
    // In a real application, you would fetch the menu list from your backend.
    const dummy_menu = [
      { "name": "ayam goreng", "price": 18000 },
      { "name": "rendang", "price": 25000 },
      { "name": "nasi telur", "price": 10000}
    ];
    
    const prompt = createCommandParserPrompt(transcript, dummy_menu);
    const responseText = await this.getLiveResponse(prompt, getNewToken);
    
    // Clean up the response to get a valid JSON string
    const jsonString = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  }

  /**
   * Generates supply predictions based on historical sales data using the AI model.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves to the prediction data.
   */
  static async getSupplyPrediction(getNewToken: () => Promise<{ name: string }>): Promise<any> {
    const historicalData = await api.salesAPI.getMonthlySales();
    const prompt = createPredictionPrompt(historicalData);
    const responseText = await this.getLiveResponse(prompt, getNewToken);
    
    const jsonString = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  }
} 