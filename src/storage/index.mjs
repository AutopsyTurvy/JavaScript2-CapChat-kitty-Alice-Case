




/**
 * @file Utility functions for interacting with localStorage.
 * 
 * This module provides helper functions to save, retrieve, 
 * and remove data from the browser's localStorage.
 * 
 * These functions ensure proper handling of JSON data 
 * when storing and retrieving values.
 */

/**
 * Saves a value to localStorage.
 *
 * - The value is converted to a JSON string before storing.
 * - Overwrites existing data if the same key already exists.
 *
 * @param {string} key - The key under which the data should be stored.
 * @param {*} value - The value to be stored (can be any type).
 *
 * @example
 * save("userProfile", { name: "Alice", email: "alice@example.com" });
 */
export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Retrieves a value from localStorage.
 *
 * - Parses the stored JSON string back into its original format.
 * - Returns `null` if no data is found for the given key.
 *
 * @param {string} key - The key whose value should be retrieved.
 * @returns {*} The parsed value, or `null` if the key does not exist.
 *
 * @example
 * const userProfile = get("userProfile");
 * console.log(userProfile); // { name: "Alice", email: "alice@example.com" }
 */
export function get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

/**
 * Removes a value from localStorage.
 *
 * - Deletes the key-value pair associated with the given key.
 *
 * @param {string} key - The key to remove from localStorage.
 *
 * @example
 * remove("userProfile");
 * console.log(get("userProfile")); // null
 */
export function remove(key) {
    localStorage.removeItem(key);
}
