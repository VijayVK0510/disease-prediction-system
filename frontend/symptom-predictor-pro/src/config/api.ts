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

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  symptoms: `${API_BASE_URL}/symptoms`,
  predict: `${API_BASE_URL}/predict`,
} as const;



