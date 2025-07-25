import { GenAIService } from './GenAIService';
import type { PredictionData, HistoricalSalesData } from '@/types/ai';

export class SupplyPredictionService {

  /**
   * Predict supply needs using the GenAI service.
   * This provides more accurate, context-aware predictions.
   * @param getNewToken A function to get a fresh authentication token.
   * @returns A promise that resolves to the prediction data.
   */
  static async predictWithAI(getNewToken: () => Promise<{ name: string }>): Promise<PredictionData[]> {
    try {
      const predictions = await GenAIService.getSupplyPrediction(getNewToken);
      // Here you might want to format the AI's response to fit your PredictionData interface
      return predictions;
    } catch (error) {
      console.error("AI prediction failed:", error);
      // Fallback to local prediction
      return this.predictLocally([], []);
    }
  }

  /**
   * Predict supply needs using weighted moving average algorithm
   * This runs entirely in the frontend to reduce latency
   */
  static predictLocally(
    historicalData: HistoricalSalesData[], 
    menuItems: string[]
  ): PredictionData[] {
    const predictions: PredictionData[] = [];
    
    for (const menuItem of menuItems) {
      const itemData = historicalData
        .filter(data => data.menuItem === menuItem)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      if (itemData.length === 0) {
        predictions.push({
          menuItem,
          predictedQuantity: 10, // Default fallback
          confidence: 0.1,
          trend: "stable",
          historicalAverage: 0
        });
        continue;
      }
      
      const weights = [0.5, 0.3, 0.2]; // Recent days get higher weight
      const recentData = itemData.slice(-3);
      const prediction = this.calculateWeightedAverage(
        recentData.map(d => d.quantity),
        weights.slice(0, recentData.length)
      );
      
      const average = itemData.reduce((sum, d) => sum + d.quantity, 0) / itemData.length;
      const trend = this.calculateTrend(itemData.slice(-5));
      const confidence = this.calculateConfidence(itemData);
      
      predictions.push({
        menuItem,
        predictedQuantity: Math.round(prediction),
        confidence,
        trend,
        historicalAverage: Math.round(average)
      });
    }
    
    return predictions;
  }
  
  /**
   * Calculate weighted moving average
   */
  static calculateWeightedAverage(data: number[], weights: number[]): number {
    if (data.length === 0 || weights.length === 0) return 0;
    
    const minLength = Math.min(data.length, weights.length);
    const adjustedData = data.slice(-minLength);
    const adjustedWeights = weights.slice(0, minLength);
    
    // Normalize weights
    const totalWeight = adjustedWeights.reduce((sum, w) => sum + w, 0);
    const normalizedWeights = adjustedWeights.map(w => w / totalWeight);
    
    return adjustedData.reduce((sum, value, index) => {
      return sum + (value * normalizedWeights[index]);
    }, 0);
  }
  
  /**
   * Calculate trend based on recent data
   */
  private static calculateTrend(recentData: HistoricalSalesData[]): "up" | "down" | "stable" {
    if (recentData.length < 2) return "stable";
    
    const firstHalf = recentData.slice(0, Math.floor(recentData.length / 2));
    const secondHalf = recentData.slice(Math.floor(recentData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, d) => sum + d.quantity, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, d) => sum + d.quantity, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    const threshold = firstAvg * 0.1; // 10% threshold
    
    if (difference > threshold) return "up";
    if (difference < -threshold) return "down";
    return "stable";
  }
  
  /**
   * Calculate confidence based on data consistency
   */
  private static calculateConfidence(data: HistoricalSalesData[]): number {
    if (data.length < 3) return 0.3;
    
    const values = data.map(d => d.quantity);
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher confidence
    const coefficient = stdDev / mean;
    const confidence = Math.max(0.1, Math.min(0.9, 1 - coefficient));
    
    return Math.round(confidence * 100) / 100;
  }
  
  /**
   * Adjust prediction based on day of week patterns
   */
  static adjustForDayOfWeek(
    prediction: PredictionData, 
    targetDayOfWeek: number,
    historicalData: HistoricalSalesData[]
  ): PredictionData {
    const itemData = historicalData.filter(d => d.menuItem === prediction.menuItem);
    const dayData = itemData.filter(d => d.dayOfWeek === targetDayOfWeek);
    
    if (dayData.length === 0) return prediction;
    
    const dayAverage = dayData.reduce((sum, d) => sum + d.quantity, 0) / dayData.length;
    const overallAverage = itemData.reduce((sum, d) => sum + d.quantity, 0) / itemData.length;
    
    const dayFactor = overallAverage > 0 ? dayAverage / overallAverage : 1;
    
    return {
      ...prediction,
      predictedQuantity: Math.round(prediction.predictedQuantity * dayFactor)
    };
  }
} 