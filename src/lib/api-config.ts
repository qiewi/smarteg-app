// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.smarteg.app',
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.smarteg.app',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Endpoints
  ENDPOINTS: {
    // Auth endpoints
    SIGN_TOKEN: '/user/auth/sign-token',
    REFRESH_TOKEN: '/user/auth/refresh-token',
    GOOGLE_AUTH: '/user/auth/google',
    GOOGLE_CALLBACK: '/user/auth/google/callback',
    GOOGLE_LOGOUT: '/user/auth/google/logout',
    GOOGLE_FAILURE: '/user/auth/google/failure',
    
    // Gemini Service endpoints
    GEMINI_TOKEN: '/service/gemini/token',
    
    // Menu Management endpoints
    MENU_READ: '/service/menu/read',
    MENU_CREATE: '/service/menu/create',
    MENU_UPDATE: '/service/menu/update',
    MENU_REMOVE: '/service/menu/remove',

    // User Management endpoints
    USER_READ: '/user/me',
    USER_UPDATE: '/user/me',
    
    // Stock Management endpoints
    STOCK_DAILY: '/service/stock/daily',
    STOCK_DAILY_DATE: '/service/stock/daily', // + /{date}
    STOCK_WEEKLY: '/service/stock/weekly',
    STOCK_MONTHLY: '/service/stock/monthly',
    STOCK_ADD: '/service/stock/add',
    
    // Sales Management endpoints
    SALES_DAILY: '/service/sales/daily',
    SALES_DAILY_DATE: '/service/sales/daily', // + /{date}
    SALES_WEEKLY: '/service/sales/weekly',
    SALES_MONTHLY: '/service/sales/monthly',
    SALES_ADD: '/service/sales/add',
  },
  
  // Request timeout
  TIMEOUT: 10000,
  
  // Default headers
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Helper function untuk membuat full URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.API_BASE_URL}${endpoint}`;
};

// Helper function untuk environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production'; 