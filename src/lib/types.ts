export interface TokenData {
    name: string;  // Contains the auth_tokens/... string
}

export interface EphemeralTokenResponse {
    status: string;
    message: string;
    data: TokenData;
}

export interface StockData {
    itemName: string;
    quantity: number;
    unit: string;
}

export interface SaleItem {
    itemName: string;
    quantity: number;
}

export interface TransactionData {
    items: SaleItem[];
    totalPrice?: number;
}

export interface SocialPostData {
    itemName: string;
    status: "ready" | "sold_out";
}

export interface WasteReportData {
    [key: string]: any;
}

export interface HistoricalData {
    [itemName: string]: number;
}

export interface PredictionResult {
    [itemName: string]: number;
}

export interface AIContextType {
    isListening: boolean;
    isSpeaking: boolean;
    isProcessing: boolean;
    transcript: string;
    error: string | null;
    startInteraction: () => void;
    stopInteraction: () => void;
    getSupplyPrediction: () => Promise<PredictionResult | null>;
} 