
/* 


// src/script/handlers/register.mjs



import { register } from "../auth/register.mjs";

export function setRegisterFormListener() {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('registerForm');

        if (form) {
            // Ensure event listener is not already added
            if (form.getAttribute('data-listener-added') === 'true') {
                return;
            }
            form.setAttribute('data-listener-added', 'true');

            // To target the form as a whole, name and password inputs
            const name = document.getElementById('name');
            const password = document.getElementById('password');

            // for errors:
            const errorForName = document.getElementById('name-error');
            const errorForPassword = document.getElementById('password-error');
            const generalError = document.createElement('div');  
            generalError.id = 'general-error';
            form.appendChild(generalError);

            // Name input handling
            name.addEventListener('input', function () {
                // This replaces the spaces in the username with underscores, in case of accidental spaces
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
                event.preventDefault(); // <---------- remember that this prevents default form submission
                let nameMessages = [];
                let passwordMessages = [];

                if (!/^[a-zA-Z0-9_]+$/.test(name.value)) {
                    nameMessages.push("Name must only contain letters, numbers, and underscores.");
                }

                if (name.value.trim() === '') {
                    nameMessages.push("We'd like to get to know you and learn your name!");
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
                } else {
                    errorForName.innerText = '';
                    errorForPassword.innerText = '';

                    const form = event.target;
                    const formData = new FormData(form);
                    const profile = Object.fromEntries(formData.entries());

                    const result = await register(profile);

                    // Only logs the registration result directly--
                    if (result && result.id) {
                        console.log(result);

                        // Store user data in localStorage (hopefully)
                        localStorage.setItem('user', JSON.stringify(result));
                        form.removeEventListener('submit', this);
                    } else {
                        // Handle error cases, and thrown inner html error
                        console.error('Registration failed:', result);
                        const errorMsg = result.error?.errors?.[0]?.message || 'Registration failed';
                        if (errorMsg.includes('already exists')) {
                            generalError.innerText = 'Warning: Profile already exists.';
                        } else {
                            generalError.innerText = 'Registration failed: ' + errorMsg;
                        }
                        generalError.style.display = 'block';
                    }
                }
            });
        }
    });
}

*/

