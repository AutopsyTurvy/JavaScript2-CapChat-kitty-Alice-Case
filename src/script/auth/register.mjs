

// src/script/auth/register.mjs (step 2)


import { API_SOCIAL_URL } from "../constants.mjs";

const action = "/auth/register";
const method = "post";

export async function register(profile) {
    const registerURL = API_SOCIAL_URL + action;
    const body = JSON.stringify(profile);

    console.log(registerURL);

    const response = await fetch(registerURL, {
        headers: {
            "Content-Type": "application/json" 
        },
        method, 
        body
    });

    const result = await response.json();
    console.log(result);
}

// expected URL = https://api.noroff.dev/api/v1/social/auth/register