import Constants from "expo-constants";

// Helper to determine the backend API URL.
// Defaults to Localhost / Custom IP if `.env` is absent during development,
// but correctly uses EXPO_PUBLIC_API_URL in production / EAS builds.

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://indiaapay.com";

export default API_BASE_URL;
