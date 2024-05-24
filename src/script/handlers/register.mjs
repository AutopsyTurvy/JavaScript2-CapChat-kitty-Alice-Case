

// src/script/handlers/register.mjs



import { register } from "../auth/register.mjs";

export function setRegisterFormListener() { 
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('registerForm');
    
        if (form) {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
    
                const formData = new FormData(form);
                const profile = Object.fromEntries(formData.entries());

                profile.name = profile.name.replace(/[^a-zA-Z0-9 _]/g, ''); 

                console.log('Sanitized Profile:', profile);

            
                profile.email = profile.email.replace('@', `+${Date.now()}@`);

                register(profile);
            });
        }
    });
}