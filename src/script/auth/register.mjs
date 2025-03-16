

// src/script/auth/register.mjs 



import { API_REGISTER, API_AUTH } from "../constants.mjs";
import * as storage from "../../storage/index.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

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

        const payload = {
            name,
            email,
            password,
            avatar: avatarUrl ? { url: avatarUrl, alt: "User avatar" } : null,
            banner: bannerUrl ? { url: bannerUrl, alt: "User banner" } : null
        };

        try {
            console.log("Sending registration request:", payload);
        
            const response = await fetch(API_REGISTER, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
        
            const result = await response.json();
        
            console.log("API Response Data:", result.data);  
        
            if (!response.ok) {
                throw new Error(result.errors?.[0]?.message || "Registration failed.");
            }
        
            console.log("Saving profile:", result.data?.name);  
            console.log("Saving token:", result.data?.accessToken);  
        
           
            if (result.data?.name && result.data?.accessToken) {
                storage.save("profile", result.data.name);
                storage.save("token", result.data.accessToken);
                console.log("User data saved to storage.");
            } else {
                console.error("Missing data in API response:", result);
                alert("Registration failed: Missing data from server.");
                return;
            }
        
            await fetchApiKey(result.data.accessToken);
        
            console.log("Redirecting to profile page...");  
            window.location.href = "/pages/index-profile.html";
        
        } catch (error) {
            console.error("Error registering user:", error);
            alert("An error occurred: " + error.message);
        }
    });
});

async function fetchApiKey(accessToken) {
    try {
        const response = await fetch(`${API_AUTH}/create-api-key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name: "The API Key" }), 
        });

        if (!response.ok) {
            throw new Error(`API Key request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const apiKey = data.data.key;
        storage.save("apiKey", apiKey);

        console.log("API Key:", apiKey);
    } catch (error) {
        console.error("Error fetching API Key:", error);
    }
}
