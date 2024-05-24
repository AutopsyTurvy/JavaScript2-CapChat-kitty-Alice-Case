


// src/script/auth/register.mjs


import { API_SOCIAL_URL } from "../constants.mjs";

const action = "/auth/register";
const method = "post";

export async function register(profile) {
    const registerURL = API_SOCIAL_URL + action;
    const body = JSON.stringify(profile);

    const response = await fetch(registerURL, {
        headers: {
            "Content-type": "application/json"
        },
        method,
        body
    })

const result = await response.json()
console.log(result)
}

//back to basics, although there was an error in fetching the ID


// expected URL = https://api.noroff.dev/api/v1/social/auth/register