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

export class VoiceProcessor {
  private static recognition: any = null;
  private static synthesis: SpeechSynthesis | null = null;
  private static isListening: boolean = false;
  private static settings: VoiceSettings = {
    language: 'id-ID', // Indonesian by default
    continuous: false,
    interimResults: true,
    volume: 1.0,
    rate: 1.0,
    pitch: 1.0
  };

  /**
   * Initialize Speech Recognition (STT)
   */
  static initializeSpeechRecognition(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('Speech Recognition not supported in this browser'));
        return;
      }

      try {
        // @ts-ignore - Browser compatibility
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.lang = this.settings.language;
        this.recognition.continuous = this.settings.continuous;
        this.recognition.interimResults = this.settings.interimResults;
        
        console.log('Speech Recognition initialized successfully');
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Initialize Speech Synthesis (TTS)
   */
  static initializeSpeechSynthesis(): boolean {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported in this browser');
      return false;
    }

    this.synthesis = window.speechSynthesis;
    console.log('Speech Synthesis initialized successfully');
    return true;
  }

  /**
   * Start listening for voice input
   */
  static startListening(): Promise<VoiceCommand> {
    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech Recognition not initialized'));
        return;
      }

      if (this.isListening) {
        reject(new Error('Already listening'));
        return;
      }

      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const command: VoiceCommand = {
            text: result[0].transcript,
            confidence: result[0].confidence,
            timestamp: new Date(),
            language: this.settings.language
          };
          this.isListening = false;
          resolve(command);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        reject(new Error(`Speech Recognition error: ${event.error}`));
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    });
  }

  /**
   * Stop listening
   */
  static stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Speak text using TTS
   */
  static speak(text: string, options?: Partial<VoiceSettings>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech Synthesis not initialized'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply settings
      utterance.lang = options?.language || this.settings.language;
      utterance.volume = options?.volume || this.settings.volume;
      utterance.rate = options?.rate || this.settings.rate;
      utterance.pitch = options?.pitch || this.settings.pitch;

      utterance.onend = () => resolve();
      utterance.onerror = (event: any) => reject(new Error(`Speech Synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  /**
   * Process voice command and extract intent
   */
  static processVoiceCommand(text: string): any {
    const lowercaseText = text.toLowerCase();
    
    // Stock recording patterns
    if (lowercaseText.includes('stok') || lowercaseText.includes('stock')) {
      return this.parseStockCommand(text);
    }

    // Sales patterns
    if (lowercaseText.includes('jual') || lowercaseText.includes('order') || lowercaseText.includes('beli')) {
      return this.parseSalesCommand(text);
    }

    // Menu ready patterns
    if (lowercaseText.includes('ready') || lowercaseText.includes('siap')) {
      return this.parseMenuReadyCommand(text);
    }

    // End of day patterns
    if (lowercaseText.includes('tutup') || lowercaseText.includes('selesai') || lowercaseText.includes('end day')) {
      return this.parseEndDayCommand(text);
    }

    return {
      type: 'unknown',
      text: text,
      confidence: 0.1
    };
  }

  /**
   * Parse stock recording command
   */
  private static parseStockCommand(text: string) {
    // Example: "Ayam Goreng 20 potong" or "Nasi 50 porsi"
    const patterns = [
      /(\w+\s*\w*)\s+(\d+)\s*(potong|porsi|wadah|pcs)/i,
      /stok\s+(\w+\s*\w*)\s+(\d+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          type: 'stock_record',
          menuItem: match[1].trim(),
          quantity: parseInt(match[2]),
          unit: match[3] || 'porsi',
          confidence: 0.8
        };
      }
    }

    return {
      type: 'stock_record',
      text: text,
      confidence: 0.3
    };
  }

  /**
   * Parse sales command
   */
  private static parseSalesCommand(text: string) {
    // Example: "Nasi, ayam, tempe" or "Order 2 nasi ayam"
    const items = text.split(',').map(item => item.trim());
    
    return {
      type: 'sales_transaction',
      items: items,
      confidence: 0.7
    };
  }

  /**
   * Parse menu ready command
   */
  private static parseMenuReadyCommand(text: string) {
    // Example: "Rendang ready 15 porsi"
    const match = text.match(/(\w+\s*\w*)\s+ready\s+(\d+)/i);
    
    if (match) {
      return {
        type: 'menu_ready',
        menuItem: match[1].trim(),
        quantity: parseInt(match[2]),
        confidence: 0.8
      };
    }

    return {
      type: 'menu_ready',
      text: text,
      confidence: 0.4
    };
  }

  /**
   * Parse end of day command
   */
  private static parseEndDayCommand(text: string) {
    return {
      type: 'end_day',
      text: text,
      confidence: 0.9
    };
  }

  /**
   * Update voice settings
   */
  static updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    if (this.recognition) {
      this.recognition.lang = this.settings.language;
      this.recognition.continuous = this.settings.continuous;
      this.recognition.interimResults = this.settings.interimResults;
    }
  }

  /**
   * Get current settings
   */
  static getSettings(): VoiceSettings {
    return { ...this.settings };
  }

  /**
   * Check if currently listening
   */
  static getIsListening(): boolean {
    return this.isListening;
  }
} 