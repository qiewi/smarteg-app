// AI Prediction Types
export interface PredictionData {
  menuItem: string;
  predictedQuantity: number;
  confidence: number;
  trend: "up" | "down" | "stable";
  historicalAverage: number;
}

export interface HistoricalSalesData {
  date: string;
  menuItem: string;
  quantity: number;
  price: number;
  dayOfWeek: number;
  weather?: string;
}

// Voice Processing Types
export interface VoiceCommand {
  text: string;
  confidence: number;
  timestamp: Date;
  language: string;
}

export interface VoiceSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
  volume: number;
  rate: number;
  pitch: number;
}

export interface ParsedVoiceCommand {
  type: 'stock_record' | 'sales_transaction' | 'menu_ready' | 'end_day' | 'unknown';
  menuItem?: string;
  quantity?: number;
  unit?: string;
  items?: string[];
  text?: string;
  confidence: number;
}

// WebSocket Types
export interface WebSocketMessage {
  type: 'stock' | 'sale' | 'waste' | 'prediction' | 'validation' | 'alert';
  data: any;
  timestamp: string;
  userId?: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

export type WebSocketEventCallback = (data: any) => void;
export type WebSocketStatusCallback = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

// Data Models
export interface UserData {
  user_id: string;
  email: string;
  name: string;
  session_token: string;
  warteg_name: string;
}

export interface StockEntry {
  id?: string;
  menu_name: string;
  initial_quantity: number;
  current_quantity?: number;
  unit: string; // e.g., "potong", "wadah", "porsi"
  price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SalesEntry {
  transaction_id: string;
  items: SalesItem[];
  total_price: number;
  timestamp: string;
  customer_count?: number;
  payment_method?: string;
}

export interface SalesItem {
  menu: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface WasteReport {
  id?: string;
  date: string;
  menu_name: string;
  initial_quantity: number;
  sold_quantity: number;
  remaining_quantity: number;
  waste_quantity: number;
  waste_kg: number;
  reduction_trend?: number;
  reason?: string;
}

export interface MenuAnnouncement {
  id?: string;
  menu_name: string;
  quantity: number;
  ready_time: string;
  suggested_post: string;
  posted?: boolean;
  platform?: 'instagram' | 'whatsapp' | 'facebook';
}

// AI Processing Results
export interface AIValidationResult {
  isValid: boolean;
  confidence: number;
  anomalies: string[];
  suggestions: string[];
  timestamp: string;
}

export interface AIDiscrepancyResult {
  hasDiscrepancy: boolean;
  severity: 'low' | 'medium' | 'high';
  details: string;
  suggestedAction: string;
  timestamp: string;
}

export interface AIWasteAnalysis {
  wasteLevel: 'low' | 'normal' | 'high';
  pattern: string;
  recommendations: string[];
  projectedSavings: number;
  timestamp: string;
}

// React Hook Types
export interface UseVoiceReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  speak: (text: string, options?: Partial<VoiceSettings>) => Promise<void>;
  isSpeaking: boolean;
  clearTranscript: () => void;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  error: string | null;
  connect: (url?: string) => Promise<void>;
  disconnect: () => void;
  sendMessage: (type: WebSocketMessage['type'], data: any) => Promise<void>;
  lastMessage: any;
}

export interface UsePredictionReturn {
  predictions: PredictionData[];
  isLoading: boolean;
  error: string | null;
  generatePredictions: (historicalData: HistoricalSalesData[], menuItems: string[]) => void;
  refreshPredictions: () => void;
}

export interface UseAIReturn {
  voice: UseVoiceReturn;
  webSocket: UseWebSocketReturn;
  prediction: UsePredictionReturn;
  isInitialized: boolean;
  initializeAI: () => Promise<void>;
}

// IndexedDB Schema Types
export interface DBSchema {
  users: UserData;
  stock: StockEntry;
  sales: SalesEntry;
  waste: WasteReport;
  announcements: MenuAnnouncement;
  predictions: PredictionData;
  ai_results: AIValidationResult | AIDiscrepancyResult | AIWasteAnalysis;
}

// Error Types
export interface AIError extends Error {
  code: 'VOICE_NOT_SUPPORTED' | 'WEBSOCKET_FAILED' | 'PREDICTION_FAILED' | 'VALIDATION_FAILED';
  details?: any;
}

// Configuration Types
export interface AIConfig {
  voice: VoiceSettings;
  webSocket: WebSocketConfig;
  prediction: {
    maxHistoryDays: number;
    minDataPoints: number;
    defaultConfidenceThreshold: number;
  };
}

// Export utility type for creating AI service instances
export type AIServiceInstance = {
  voice: typeof import('../services/ai/VoiceProcessor').VoiceProcessor;
  webSocket: import('../services/websocket/WebSocketService').WebSocketService;
  prediction: typeof import('../services/ai/SupplyPrediction').SupplyPredictionService;
}; 