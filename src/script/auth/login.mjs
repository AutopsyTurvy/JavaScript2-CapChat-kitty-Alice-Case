




// src/script/auth/login.mjs



console.log("login.mjs loaded and executed");

import * as storage from "../../storage/index.mjs"; 
import { getApiKey } from "./api-key.mjs";
import { API_LOGIN } from "../constants.mjs"; 

const API_DEFAULT_AVATAR = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400";
const API_DEFAULT_BANNER = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=500&w=1500";

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded. Adding login event listener...");

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
        console.error("Login form not found on the page!");
        return;
    }

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

        console.log(` Attempting login with email: ${email}`);

        try {
            console.log(`Logging in with URL: ${API_LOGIN}`);

            const response = await fetch(API_LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            console.log("Login API Response:", result); 

            if (!response.ok) {
                throw new Error(result.errors?.[0]?.message || "Login failed.");
            }

            const { accessToken, name, avatar, banner } = result.data;

            if (!accessToken) {
                throw new Error("No access token received from API.");
            }

            storage.save("Token", accessToken);

            
            const updatedProfile = {
                name,
                email,
                avatar: (!avatar?.url || avatar.url === API_DEFAULT_AVATAR) ? "/assets/defaultavatar.jpg" : avatar.url,
                banner: (!banner?.url || banner.url === API_DEFAULT_BANNER) ? "/assets/defaultbanner.jpg" : banner.url,
            };

            storage.save("Profile", updatedProfile);
            console.log("Profile saved:", updatedProfile); 

            if (!storage.get("ApiKey")) {
                await getApiKey();
            }

            console.log("Login successful! Redirecting...");
            window.location.href = "/pages/index-profile.html";

        } catch (error) {
            console.error("Login failed:", error);
            alert(`Login failed: ${error.message}`); 
        }
    });
});
