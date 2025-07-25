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
import {
  createCommandParserPrompt,
  createPredictionPrompt,
  createDailyReportPrompt,
  createWasteAnalysisPrompt
} from '@/lib/prompt';
import * as api from '@/lib/api';

// Recommended to use the latest models for live and batch processing
const LIVE_MODEL_NAME = 'gemini-2.0-flash-live-001';
const IMAGE_MODEL_NAME = 'gemini-2.0-flash-preview-image-generation';

export class GenAIService {
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

    // Create a new instance for each call with the fresh token
    const genAI = new GoogleGenAI({ apiKey: freshToken.name, httpOptions: { apiVersion: 'v1alpha' } });

    return new Promise(async (resolve, reject) => {
      let accumulatedText = '';
      try {
        const session = await genAI.live.connect({
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
                console.log('✅ Live session turn complete.');
                session.close();
                resolve(accumulatedText);
              }
            },
            onerror: (e: Event) => {
              console.error('❌ Live session error event:', e);
              reject(e);
            },
            onclose: (closeEvent: CloseEvent) => {
              console.log('ℹ️ Live session closed.', { code: closeEvent.code, reason: closeEvent.reason, wasClean: closeEvent.wasClean });
            },
          },
        });

        console.log('ℹ️ Sending prompt to live session:', prompt.slice(0, 100));
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

    const menu_list = await api.menuAPI.getMenu();

    console.log("Menu_list", (menu_list as any).data);

    const prompt = createCommandParserPrompt(transcript, ((menu_list as any).data as any)?.menu?.length >= 1 ? ((menu_list as any).data as any).menu : dummy_menu);
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

  /**
   * Generates a daily report by fetching sales and stock data and using the AI model.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves to the report data, containing text and LaTeX formats.
   */
  static async generateDailyReport(getNewToken: () => Promise<{ name: string }>): Promise<any> {
    // Fetch the daily data from your backend
    const [dailySales, dailyStock] = await Promise.all([
      api.salesAPI.getDailySales(),
      api.stockAPI.getDailyStock()
    ]);

    const prompt = createDailyReportPrompt(dailySales, dailyStock);
    const responseText = await this.getLiveResponse(prompt, getNewToken);

    const jsonString = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  }

  /**
   * Generates waste analysis and sustainability recommendations using the AI model.
   * @param wasteData Array of waste data for each menu item.
   * @param salesData Sales data from the API.
   * @param stockData Stock data from the API.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves to the waste analysis data.
   */
  static async getWasteAnalysis(
    wasteData: any[], 
    salesData: any, 
    stockData: any, 
    getNewToken: () => Promise<{ name: string }>
  ): Promise<any> {
    const prompt = createWasteAnalysisPrompt(wasteData, salesData, stockData);
    const responseText = await this.getLiveResponse(prompt, getNewToken);

    const jsonString = responseText.replace(/```json|```/g, '').trim();
    return JSON.parse(jsonString);
  }

  /**
   * Generates an image based on the provided prompt using the image generation model.
   * @param prompt The prompt for image generation.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves to the generated image data as base64 string.
   */
  static async generateImage(prompt: string, getNewToken: () => Promise<{ name: string }>): Promise<string | null> {
    // const freshToken = await getNewToken();
    // if (!freshToken?.name) {
    //   throw new Error("Could not get a valid token for image generation.");
    // }

    const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

    try {
      const response = await genAI.models.generateContent({
        model: IMAGE_MODEL_NAME,
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      // Extract image data from response
      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            return part.inlineData.data; // Return base64 image data
          }
        }
      }

      return null; // No image generated
    } catch (error) {
      console.error('Image generation failed:', error);
      throw error;
    }
  }
} 