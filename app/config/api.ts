// API configuration
export const API_BASE_URL = 'http://127.0.0.1:5000';

// Helper function to build API endpoints
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}; 