

// src/script/auth/api-key.mjs




import * as storage from "../../storage/index.mjs";
import { API_AUTH } from "../constants.mjs";

export async function getApiKey() {
    try {
        console.log("getApiKey() function called..."); 

        const token = storage.get("Token");
        if (!token) {
            console.error("No token found for API key request.");
            return;
        }

        console.log("Token found, sending API Key request...");

        const response = await fetch(`${API_AUTH}/create-api-key`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ name: "CapChat API Key" }),
        });

        console.log("API Key request sent to:", `${API_AUTH}/create-api-key`);

        if (!response.ok) {
            throw new Error(`API Key request failed: ${response.statusText}`);
        }

        const data = await response.json();
        storage.save("ApiKey", data.data.key);
        console.log("API Key Retrieved Successfully:", data.data.key); 

    } catch (error) {
        console.error("Error fetching API Key:", error);
    }
}
