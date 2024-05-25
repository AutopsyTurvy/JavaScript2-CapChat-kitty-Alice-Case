

// src/script/handlers/register.mjs



import { register } from "../auth/register.mjs";

// We weren't recommended to work through each individually, but it is what worked best for me.
export function setRegisterFormListener() {
    document.addEventListener('DOMContentLoaded', function () {

        // To target form as a whole, name and password inputs
        const form = document.getElementById('registerForm');
        const name = document.getElementById('name');
        const password = document.getElementById('password');

        // for errors:
        const errorForName = document.getElementById('name-error');
        const errorForPassword = document.getElementById('password-error');
        const generalError = document.createElement('div'); 
        generalError.id = 'general-error';
        form.appendChild(generalError);

        // Name input handling
        if (form) {
            name.addEventListener('input', function () {
                
                name.value = name.value.replace(/\s+/g, '_');

                let messages = [];
                if (!/^[a-zA-Z0-9_]+$/.test(name.value)) {
                    messages.push("Name must only contain letters, numbers, and underscores.");
                }
                if (name.value.trim() === '') {
                    messages.push("We'd like to get to know you and learn your name!");
                }
                errorForName.innerText = messages.join(', ');
                console.log('Name Error:', messages.join(', '));
            });

            // password input handling
            password.addEventListener('input', function () {
                let messages = [];

                if (password.value.length < 8) {
                    messages.push('Password must be at least 8 characters long.');
                }

                if (password.value.length > 20) {
                    messages.push('Password must be less than twenty characters.');
                }

                if (password.value.toLowerCase() === 'password') {
                    messages.push('Your password cannot be "Password" - It will be guessed too easily!');
                }

                errorForPassword.innerText = messages.join(', ');
                console.log('Password Error:', messages.join(', '));
            });

            // Throwing errors for name and password/ user help
            form.addEventListener("submit", async (event) => {
                event.preventDefault();
                let nameMessages = [];
                let passwordMessages = [];

                if (!/^[a-zA-Z0-9_]+$/.test(name.value)) {
                    nameMessages.push("Name must only contain letters, numbers, and underscores");
                }

                if (name.value.trim() === '') {
                    nameMessages.push("we'd like to get to know you and learn your name!");
                }

                if (password.value.length < 8) {
                    passwordMessages.push('Password must be at least 8 characters long.');
                }

                if (password.value.length > 20) {
                    passwordMessages.push('Password must be less than twenty characters.');
                }

                if (nameMessages.length > 0 || passwordMessages.length > 0) {
                    errorForName.innerText = nameMessages.join(', ');
                    errorForPassword.innerText = passwordMessages.join(', ');
                    console.log('Form Error:', nameMessages.join(', '), passwordMessages.join(', '));

                // If registration succeeds or fails
                } else {
                    errorForName.innerText = '';
                    errorForPassword.innerText = '';

                    const form = event.target;
                    const formData = new FormData(form);
                    const profile = Object.fromEntries(formData.entries());

                    const result = await register(profile);

                    console.log('Registration Result:', result);

                    if (result.error) {
                        if (result.error === 'Profile already exists') {
                            generalError.innerText = 'Oh no! This profile already exists- Please enter another!';
                            generalError.style.display = 'block'; 
                        } else {
                            generalError.innerText = 'Registration failed: ' + result.error;
                            generalError.style.display = 'block'; 
                        }
                    } else if (result && result.id) {
                        console.log('Registration successful:', result);
                        generalError.innerText = '';  
                        generalError.style.display = 'none'; 
                        
                        localStorage.setItem('user', JSON.stringify(result));
                        window.location.href = '/profile.html';
                    } else {
                        generalError.innerText = 'Registration failed. Please try again.';
                        generalError.style.display = 'block'; 
                    }
                }
            });
        }
    });
}




