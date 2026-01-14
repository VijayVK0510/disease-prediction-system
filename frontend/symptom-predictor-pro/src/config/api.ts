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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

export const API_ENDPOINTS = {
  symptoms: `${API_BASE_URL}/symptoms`,
  predict: `${API_BASE_URL}/predict`,
} as const;

