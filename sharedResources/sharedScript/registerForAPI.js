







register.mjs 

import { API_SOCIAL_URL } from "../constants.mjs";

const action = "/auth/register";
const method = "POST";

export async function register(profile){
    const registerURL = API_SOCIAL_URL + action;
    const body = JSON.stringify(profile);


    const Response = await fetch(registerURL, {
        headers: {
            'Content-Type': 'application/json'
        },
        method,
        body
    })

    const response = await Response.json();
    alert('Registration successful');
    console.log(response);
}



//Fetch posts-- Old Code-- 


/* const baseAPIURL = 'https://api.noroff.dev/api/v1';
const registerURL = `${baseAPIURL}/social/auth/register`;
const loginURL = `${baseAPIURL}/social/auth/login`;

const registrationData = {
  name: "kitty_alice_case",
  email: "kitcas53614@stud.noroff.no",
  password: "Noroff3354",
};

async function registerAndLogin() {
  try {
    // Attempts to register the user
    const registerResponse = await fetch(registerURL, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(registrationData),
    });
    const registerData = await registerResponse.json();

  
    if (!registerResponse.ok) {
      console.error('Registration Error- booooooo:', registerData);
      if (registerData.errors && registerData.errors.some(e => e.message === "Profile already exists")) {
       
        console.log('Profile already exists. Attempting to log in...');
      } else {
     
        throw new Error(registerData.errors.map(e => e.message).join('; '));
      }
    } else {
      console.log('Registration Success--hoorah:', registerData);
    }

    // Proceed to log in...
    const loginResponse = await fetch(loginURL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email: registrationData.email, password: registrationData.password }),
    });
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }
    console.log('Login Success:', loginData);

    // Use the access token to fetch posts...
    await fetchPosts(loginData.accessToken);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function fetchPosts(accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  try {
    const response = await fetch(`${baseAPIURL}/social/posts`, options);
    const data = await response.json();
    console.log('Fetched Posts:', data);
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
}

//Execute!
registerAndLogin();  */