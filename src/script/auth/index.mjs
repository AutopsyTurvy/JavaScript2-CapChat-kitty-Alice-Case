// /src/script/auth/index.mjs

/**
 * Central authentication module that re-exports authentication-related functions 
 * from other modules for easier imports throughout the project/ to wherever they need to be called.
 * 
 * - `login` handles user authentication.
 * - `register` manages new user account creation.
 * - `fetchUserProfile` retrieves user profile details after authentication.
 * - `getApiKey` fetches the user's API key for protected API operations.
 * - `logout` handles session termination.
 *
 * @module auth
 */

export { login } from "./login.mjs";
export { register } from "./register.mjs";
export { fetchUserProfile } from "./register.mjs";
export { getApiKey } from "./api-key.mjs"; 
export { logout } from "./logout.mjs"; 
