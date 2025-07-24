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

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts: number = 0;
  private isReconnecting: boolean = false;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private eventCallbacks: Map<string, WebSocketEventCallback[]> = new Map();
  private statusCallbacks: WebSocketStatusCallback[] = [];
  private isConnected: boolean = false;
  private messageQueue: WebSocketMessage[] = [];

  constructor(config?: Partial<WebSocketConfig>) {
    this.config = {
      url: 'wss://temporary-server.com/ws', // Placeholder URL
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000,
      ...config
    };
  }

  /**
   * Connect to WebSocket server
   */
  connect(url?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = url || this.config.url;
        console.log(`Connecting to WebSocket: ${wsUrl}`);
        
        this.notifyStatusChange('connecting');
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected successfully');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.isReconnecting = false;
          this.notifyStatusChange('connected');
          this.startHeartbeat();
          this.processMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event: any) => {
          this.handleMessage(event);
        };

        this.ws.onerror = (error: any) => {
          console.error('WebSocket error:', error);
          this.notifyStatusChange('error');
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = (event: any) => {
          console.log('WebSocket connection closed:', event.code, event.reason);
          this.isConnected = false;
          this.stopHeartbeat();
          this.notifyStatusChange('disconnected');
          
          if (!this.isReconnecting && this.reconnectAttempts < this.config.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    this.isReconnecting = false;
    this.reconnectAttempts = this.config.maxReconnectAttempts;
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    
    this.stopHeartbeat();
    this.isConnected = false;
    this.notifyStatusChange('disconnected');
  }

  /**
   * Send AI request data
   */
  sendAIRequest(type: WebSocketMessage['type'], data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
        userId: this.getUserId()
      };

      if (this.isConnected && this.ws) {
        try {
          this.ws.send(JSON.stringify(message));
          console.log(`Sent AI request: ${type}`, data);
          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        // Queue message for later sending
        this.messageQueue.push(message);
        console.log(`Message queued (not connected): ${type}`);
        resolve();
      }
    });
  }

  /**
   * Register callback for AI responses
   */
  onAIResponse(type: string, callback: WebSocketEventCallback): void {
    if (!this.eventCallbacks.has(type)) {
      this.eventCallbacks.set(type, []);
    }
    this.eventCallbacks.get(type)?.push(callback);
  }

  /**
   * Remove callback for AI responses
   */
  offAIResponse(type: string, callback: WebSocketEventCallback): void {
    const callbacks = this.eventCallbacks.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Register status change callback
   */
  onStatusChange(callback: WebSocketStatusCallback): void {
    this.statusCallbacks.push(callback);
  }

  /**
   * Remove status change callback
   */
  offStatusChange(callback: WebSocketStatusCallback): void {
    const index = this.statusCallbacks.indexOf(callback);
    if (index > -1) {
      this.statusCallbacks.splice(index, 1);
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);

      // Handle heartbeat response
      if (message.type === 'pong') {
        return;
      }

      // Notify registered callbacks
      const callbacks = this.eventCallbacks.get(message.type) || [];
      callbacks.forEach(callback => {
        try {
          callback(message.data);
        } catch (error) {
          console.error('Error in message callback:', error);
        }
      });

    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.isReconnecting || this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      return;
    }

    this.isReconnecting = true;
    this.reconnectAttempts++;

    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect().catch(() => {
        // Reconnection failed, will try again on next close event
        this.isReconnecting = false;
      });
    }, this.config.reconnectInterval);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected && this.ws) {
        try {
          this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
        } catch (error) {
          console.error('Error sending heartbeat:', error);
        }
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Process queued messages when connection is restored
   */
  private processMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.isConnected && this.ws) {
      const message = this.messageQueue.shift();
      if (message) {
        try {
          this.ws.send(JSON.stringify(message));
          console.log(`Sent queued message: ${message.type}`);
        } catch (error) {
          console.error('Error sending queued message:', error);
          // Put message back at the front of the queue
          this.messageQueue.unshift(message);
          break;
        }
      }
    }
  }

  /**
   * Notify status change to callbacks
   */
  private notifyStatusChange(status: 'connecting' | 'connected' | 'disconnected' | 'error'): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  /**
   * Get user ID from local storage or session
   */
  private getUserId(): string | undefined {
    // TODO: Implement user ID retrieval from auth context
    return localStorage.getItem('userId') || undefined;
  }

  /**
   * Send stock data to AI for validation
   */
  async sendStockUpdate(stockData: any): Promise<void> {
    return this.sendAIRequest('stock', stockData);
  }

  /**
   * Send sales data to AI for discrepancy detection
   */
  async sendSaleTransaction(saleData: any): Promise<void> {
    return this.sendAIRequest('sale', saleData);
  }

  /**
   * Send waste data to AI for analysis
   */
  async sendWasteReport(wasteData: any): Promise<void> {
    return this.sendAIRequest('waste', wasteData);
  }

  /**
   * Request prediction data from AI
   */
  async requestPrediction(predictionParams: any): Promise<void> {
    return this.sendAIRequest('prediction', predictionParams);
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService(); 