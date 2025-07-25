import { API_CONFIG, getApiUrl } from './api-config';

// Base API client class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.API_BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = API_CONFIG.DEFAULT_HEADERS;
  }

  // Get authorization header
  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') {
      return {}; // Return empty headers on server-side
    }
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = getApiUrl(endpoint);
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Specific API services
export const authAPI = {
  // Sign JWT token after OAuth
  signToken: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.SIGN_TOKEN),
  
  // Refresh JWT token
  refreshToken: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.REFRESH_TOKEN),
  
  // Start Google OAuth authentication
  startGoogleAuth: () =>
    window.location.href = getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_AUTH),
  
  // Logout user
  logout: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.GOOGLE_LOGOUT),
};

export const geminiAPI = {
  // Get Gemini ephemeral token
  getToken: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.GEMINI_TOKEN),
};

export const stockAPI = {
  // Get today's stock
  getDailyStock: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.STOCK_DAILY),
  
  // Get stock for specific date
  getStockByDate: (date: string) =>
    apiClient.get(`${API_CONFIG.ENDPOINTS.STOCK_DAILY_DATE}/${date}`),
  
  // Get past week stock data
  getWeeklyStock: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.STOCK_WEEKLY),
  
  // Get past month stock data
  getMonthlyStock: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.STOCK_MONTHLY),
  
  // Add new stock items
  addStock: (stockData: any) =>
    apiClient.put(API_CONFIG.ENDPOINTS.STOCK_ADD, stockData),
};

export const salesAPI = {
  // Get today's sales
  getDailySales: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.SALES_DAILY),
  
  // Get sales for specific date
  getSalesByDate: (date: string) =>
    apiClient.get(`${API_CONFIG.ENDPOINTS.SALES_DAILY_DATE}/${date}`),
  
  // Get past week sales data
  getWeeklySales: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.SALES_WEEKLY),
  
  // Get past month sales data
  getMonthlySales: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.SALES_MONTHLY),
  
  // Record sales (sell stock items)
  recordSales: (salesData: any) =>
    apiClient.put(API_CONFIG.ENDPOINTS.SALES_ADD, salesData),
};

export const menuAPI = {
  // Get menu items
  getMenu: () =>
    apiClient.get(API_CONFIG.ENDPOINTS.MENU_READ),
  
  // Add new menu item
  addMenuItem: (menuData: any) =>
    apiClient.post(API_CONFIG.ENDPOINTS.MENU_CREATE, menuData),
  
  // Update menu item
  updateMenuItem: (id: string, menuData: any) =>
    apiClient.put(`/menu/${id}`, menuData),
  
  // Delete menu item
  deleteMenuItem: (id: string) =>
    apiClient.delete(`/menu/${id}`),
}; 

export interface SalesData {
  sales: number;
  items: any[];
  date: string;
}

export interface DailySalesResponse {
  status: string;
  message: string;
  data: SalesData;
}

export interface WeeklySalesResponse {
  status: string;
  message: string;
  data: {
    weeklySales: SalesData[];
  };
}

export interface MonthlySalesResponse {
  status: string;
  message: string;
  data: {
    monthlySales: SalesData[];
  };
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' }; // Return basic headers on server-side
  }
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
}

export async function getDailySales(): Promise<DailySalesResponse> {
  const response = await fetch('https://api.smarteg.app/service/sales/daily', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch daily sales');
  }
  return response.json();
}

export async function getWeeklySales(): Promise<WeeklySalesResponse> {
  const response = await fetch('https://api.smarteg.app/service/sales/weekly', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch weekly sales');
  }
  return response.json();
}

export async function getMonthlySales(): Promise<MonthlySalesResponse> {
  const response = await fetch('https://api.smarteg.app/service/sales/monthly', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch monthly sales');
  }
  return response.json();
} 