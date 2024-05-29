

// src/script/auth/login.mjs


import { API_SOCIAL_URL } from "../constants.mjs";
import * as storage from "../../storage/index.mjs";

const action = "/auth/login";
const method = "post";

export async function login(profile) {
  const loginURL = API_SOCIAL_URL + action;
  const body = JSON.stringify(profile);

  const response = await fetch(loginURL, {
    headers: {
      "Content-Type": "application/json",
    },
    method,
    body,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error("Error logging in");
  } else {
    storage.save("profile", result.name);
    storage.save("token", result.accessToken);
    console.log("token", result.accessToken);
  }

  console.log(result);
}


