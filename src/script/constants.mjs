

// src/script/constants.mjs

// Base API URL for Noroff API v2
export const API_V2_BASE_URL = "https://v2.api.noroff.dev";



// Authentication Endpoints
export const API_AUTH = `${API_V2_BASE_URL}/auth`;
export const API_REGISTER = `${API_AUTH}/register`;
export const API_LOGIN = `${API_AUTH}/login`;
export const API_KEY_URL = `${API_AUTH}/create-api-key`;

// Social Endpoints (Posts, Profiles, etc.)
export const API_SOCIAL = `${API_V2_BASE_URL}/social`;
export const API_POSTS = `${API_SOCIAL}/posts`;
export const API_PROFILES = `${API_SOCIAL}/profiles`;



