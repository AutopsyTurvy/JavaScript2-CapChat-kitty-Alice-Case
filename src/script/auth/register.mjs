

// src/script/auth/register.mjs 





import { API_REGISTER, API_AUTH, API_PROFILES, API_LOGIN } from "../constants.mjs";
import * as storage from "../../storage/index.mjs";
import { getApiKey } from "./api-key.mjs"; 

/**
 * Logs in a user immediately after registration is complete:
 *
 * @async
 * @param {string} email - The email address of the newly registered user- has to be a Noroff email.
 * @param {string} password - The password of the user.
 * @returns {Promise<string|null>} This promise returns the access token if successful.
 *
 * @example
 * const token = await loginAfterRegistration("user@noroff.no", "securepassword");
 * console.log(token); // "eyJhbGciOiJI..."
 */
async function loginAfterRegistration(email, password) {
    try {
        console.log("Logging in immediately after registration...");
        
        const response = await fetch(`${API_AUTH}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();
        console.log("Login API Response:", result);

        if (!response.ok) {
            throw new Error(result.errors?.[0]?.message || "Login failed.");
        }

        const { accessToken } = result.data;

        if (!accessToken) {
            throw new Error("No access token received after login.");
        }

        console.log("Access Token Received:", accessToken);
        storage.save("Token", accessToken);

        return accessToken;
    } catch (error) {
        console.error("Error logging in after registration:", error);
        return null;
    }
}





/**
 * Fetches the user profile data from the API.
 *
 * @async
 * @param {string} username - The username of the profile to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user profile data if successful, otherwise null.
 *
 * @example
 * const userProfile = await fetchUserProfile("JohnDoe");
 * console.log(userProfile);
 */
export async function fetchUserProfile(username) {
    try {
        const apiKey = storage.get("ApiKey");
        const token = storage.get("Token");

        if (!token) {
            throw new Error("No token found. User might not be authenticated.");
        }

        const response = await fetch(`${API_PROFILES}/${username}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": apiKey || "",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user profile.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}












document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");








   /**
 * Handles the user registration form submission, sending the user data to the API.
 * Automatically logs in the user after registration, retrieves an API key, and fetches the user profile.
 *
 * @async
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} A promise that resolves when the registration process completes.
 *
 * @example
 * document.getElementById("registerForm").addEventListener("submit", registerUser);
 */
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const bannerUrl = document.getElementById("banner").value.trim();
        const avatarUrl = document.getElementById("avatar").value.trim();

        if (!name || !email || !password) {
            alert("Please fill out all required fields.");
            return;
        }

        const payload = { name, email, password };

        if (avatarUrl) payload.avatar = { url: avatarUrl, alt: "User avatar" };
        if (bannerUrl) payload.banner = { url: bannerUrl, alt: "User banner" };

        try {
            console.log("Sending registration request...");

            // Sends registration request to the API
            const response = await fetch(API_REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log("Raw API Response:", result);



            // Handls a possible failed registration
            if (!response.ok) {
                throw new Error(result.errors?.[0]?.message || `Registration failed: ${response.status}`);
            }

            console.log("Registration successful:", result);

           // Attempts to log in automatically after registration is done
            const token = await loginAfterRegistration(email, password);

            if (!token) {
                console.error("Could not retrieve access token after login.");
                alert("Registration failed: Could not retrieve access token.");
                return;
            }

             // Fetches API key for the user
            await getApiKey();



         // Retrieves and updates the user profile data
            const userProfile = await fetchUserProfile(result.data.name);
            console.log("Fetched Profile:", userProfile);
        // Saves the updated profile data locally:
            const updatedProfile = {
                name: userProfile?.name || result.data.name,
                email: userProfile?.email || result.data.email,
                avatar: userProfile?.avatar?.url || "/assets/defaultavatar.jpg",
                banner: userProfile?.banner?.url || "/assets/defaultbanner.jpg",
            };

            storage.save("Profile", updatedProfile);
            console.log("Updated Profile Saved:", updatedProfile);


            // Alerts the user that their registration was successful and redirects them to their profile page
            // where their information will be rendered in the inner html.
            alert("Registration successful! Redirecting to your profile...");
            window.location.href = "/pages/index-profile.html";
        } catch (error) {
            console.error("Error registering user:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
