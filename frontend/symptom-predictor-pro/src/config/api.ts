/**
 * API Configuration
 * 
 * IMPORTANT: Replace the placeholder with your actual backend URL before deployment.
 * 
 * Examples:
 * - Local Docker: "http://localhost:10000"
 * - Render Production: "https://your-app-name.onrender.com"
 */

// export const API_BASE_URL = "/* BACKEND_URL_HERE */";

// Uncomment one of the following for development/production:
 export const API_BASE_URL = "http://localhost:8000";
// export const API_BASE_URL = "https://your-render-app.onrender.com";

export const API_ENDPOINTS = {
  symptoms: `${API_BASE_URL}/symptoms`,
  predict: `${API_BASE_URL}/predict`,
} as const;
