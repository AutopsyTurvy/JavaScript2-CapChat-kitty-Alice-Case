




// src/script/auth/login.mjs




import { API_AUTH } from "../constants.mjs";  
import * as storage from "../../storage/index.mjs";

const action = "/login"; 
const method = "POST";

async function fetchApiKey(accessToken) {
    try {
        const response = await fetch(`${API_AUTH}/create-api-key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ name: "My API Key" }), 
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

export async function login(profile) {
    const loginURL = API_AUTH + action; 
    const body = JSON.stringify(profile);

    try {
        const response = await fetch(loginURL, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.errors?.[0]?.message || "Login failed.");
        }

        if (result.data) {
            storage.save("profile", result.data.name);
            storage.save("token", result.data.accessToken);
            console.log("Token saved:", result.data.accessToken);

            
            await fetchApiKey(result.data.accessToken);

       
            window.location.href = "/pages/index-profile.html";
        } else {
            throw new Error("No user data returned.");
        }
    } catch (error) {
        console.error("Login Error:", error);
        alert("Login failed: " + error.message);
    }
}
