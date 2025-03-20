

// src/script/constants.mjs

/**
 * @file Constants file containing API endpoints for the Noroff API v2.
 * 
 * This file defines the base API URLs and specific endpoint paths
 * used throughout the application to interact with the Noroff Social API.
 * 
 * Keeping API endpoints centralized here ensures maintainability 
 * and ease of updates when changes occur in the API structure.
 */

/**
 * Base URL for the Noroff API v2.
 * @constant {string}
 */
export const API_V2_BASE_URL = "https://v2.api.noroff.dev";

/**
 * Alternative base API URL (same as `API_V2_BASE_URL`, but defined separately for clarity).
 * @constant {string}
 */
export const API_BASE = "https://v2.api.noroff.dev";

/** 
 * Authentication Endpoints
 * @constant {string} API_AUTH - Base authentication URL.
 * @constant {string} API_REGISTER - Endpoint for user registration.
 * @constant {string} API_LOGIN - Endpoint for user login.
 * @constant {string} API_KEY_URL - Endpoint for creating an API key.
 */
export const API_AUTH = `${API_V2_BASE_URL}/auth`;
export const API_REGISTER = `${API_AUTH}/register`;
export const API_LOGIN = `${API_AUTH}/login`;
export const API_KEY_URL = `${API_AUTH}/create-api-key`;

/** 
 * Social API Endpoints (for posts, profiles, etc.)
 * @constant {string} API_SOCIAL - Base social API URL.
 * @constant {string} API_POSTS - Endpoint for fetching and managing posts.
 * @constant {string} API_PROFILES - Endpoint for fetching and managing user profiles.
 */
export const API_SOCIAL = `${API_V2_BASE_URL}/social`;
export const API_POSTS = `${API_SOCIAL}/posts`;
export const API_PROFILES = `${API_SOCIAL}/profiles`;

