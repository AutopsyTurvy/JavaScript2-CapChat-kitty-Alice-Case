




// src/script/auth/login.mjs




import { API_AUTH } from "../constants.mjs";  
import * as storage from "../../storage/index.mjs";

const action = "/login"; 
const method = "POST";

export async function login(profile) {
  const loginURL = API_AUTH + action; 
  const body = JSON.stringify(profile);

  try {
    const response = await fetch(loginURL, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": "your-api-key-here", 
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
      
  
      window.location.href = "/pages/index-profile.html";
    } else {
      throw new Error("No user data returned.");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert("Login failed: " + error.message);
  }
}

