

// src/script/auth/register.mjs 


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

    if (!response.ok) {
       
        if (result.errors && result.errors.some(error => error.message.includes('already exists'))) {
            console.log('Registration Error: Profile already exists.');
            return { error: 'Profile already exists' };
        }
        console.log('Registration Error:', result);
        return { error: result };
    }

    console.log(result);
    return result;
}



// expected URL = https://api.noroff.dev/api/v1/social/auth/register