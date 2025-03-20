



// src/script/auth/login.mjs




console.log("login.mjs loaded and executed");

import * as storage from "../../storage/index.mjs"; 
import { getApiKey } from "./api-key.mjs";
import { API_LOGIN } from "../constants.mjs"; 

const API_DEFAULT_AVATAR = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";
const API_DEFAULT_BANNER = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";

/**
 * Initializes the login event listener when the DOM is fully loaded/ complete.
 * - Attaches a "submit event" listener to the login form.
 * - Validates input fields before making a login request.
 * - Handles API authentication and redirects the user upon a successful login.
 *
 * @listens DOMContentLoaded - Ensures the login form is interactive after the DOM has loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded. Adding login event listener...");

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
        console.error("Login form not found on the page!");
        return;
    }

    /**
     * Handles the login form submission.
     * - Prevents default form behavior.
     * - Validates input fields and handles errors.
     * - Sends credentials to the API for authentication.
     * - Stores authentication token and user profile in local storage.
     * - Redirects user to their profile page upon successful login.
     *
     * @async
     * @param {Event} event - The form submission event/ authentication.
     * @returns {Promise<void>} Resolves when login is completed/ successful.
     *
     * @example
     * document.getElementById("loginForm").addEventListener("submit", loginUser);
     */
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Login form submitted!");

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        if (!emailInput || !passwordInput) {
            console.error("Email or password input not found!");
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            console.error("Missing email or password. Please enter both.");
            alert("Please enter both email and password.");
            return;
        }

        console.log(`Attempting login with email: ${email}`);

        try {
            console.log(`Logging in with URL: ${API_LOGIN}`);

            // Sends a login request to API
            const response = await fetch(API_LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            console.log("Login API Response:", result); 

            // Handles possible authentication failure
            if (!response.ok) {
                throw new Error(result.errors?.[0]?.message || "Login failed.");
            }

            const { accessToken, name, avatar, banner } = result.data;

            if (!accessToken) {
                throw new Error("No access token received from API.");
            }

            // Stores the access token securely in local storage:
            storage.save("Token", accessToken);

            // Updates user profile with avatar and banner (or applies default images) the same as the registration form
            const updatedProfile = {
                name,
                email,
                avatar: (!avatar?.url || avatar.url === API_DEFAULT_AVATAR) ? "/assets/defaultavatar.jpg" : avatar.url,
                banner: (!banner?.url || banner.url === API_DEFAULT_BANNER) ? "/assets/defaultbanner.jpg" : banner.url,
            };

            storage.save("Profile", updatedProfile);
            console.log("Profile saved:", updatedProfile); 

            // Fetches API key if there is not one already stored
            if (!storage.get("ApiKey")) {
                await getApiKey();
            }



            // redirects to the profile page and displays the user's info in much the same way as registration does:
            console.log("Login successful! Redirecting...");
            window.location.href = "/pages/index-profile.html";



            // catch error- just in case!
        } catch (error) {
            console.error("Login failed:", error);
            alert(`Login failed: ${error.message}`); 
        }
    });
});