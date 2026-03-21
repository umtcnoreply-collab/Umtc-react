/**
 * API Configuration
 * Centralized API endpoint configuration
 */

const API_BASE_URL = 'https://api.umtcapply.com';

export const apiConfig = {
  // Base URL for all API calls
  baseURL: API_BASE_URL,

  // Auth endpoints
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    verifyOtp: `${API_BASE_URL}/api/auth/verify-otp`,
    forgotPassword: `${API_BASE_URL}/api/auth/forgot-password`,
    setPassword: `${API_BASE_URL}/api/auth/set-password`,
    resetPassword: `${API_BASE_URL}/api/auth/reset-password`,
    resendOtp: `${API_BASE_URL}/api/auth/resend-otp`,
  },

  // Application endpoints
  application: {
    getApplication: `${API_BASE_URL}/api/application/get-application`,
    submitApplication: `${API_BASE_URL}/api/application/submit`,
    updateBasicDetails: `${API_BASE_URL}/api/application/basic-details`,
    uploadDocuments: `${API_BASE_URL}/api/application/documents`,
  },
};

/**
 * Helper function to build API URLs with parameters
 * @param endpoint - The API endpoint
 * @param params - Optional path parameters
 * @returns Full API URL
 */
export const getApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = endpoint;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

/**
 * Helper function to get full URL for relative paths
 * @param path - Relative path (e.g., '/uploads/photo.jpg')
 * @returns Full URL
 */
export const getFullUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
};
