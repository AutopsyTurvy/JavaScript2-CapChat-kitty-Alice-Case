


// General Form Validation for "Name" and "Password" 



document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const name = document.getElementById('name');
    const password = document.getElementById('password');
    const errorForName = document.getElementById('name-error');
    const errorForPassword = document.getElementById('password-error');

    name.addEventListener('input', function () {


        /* The section below should replace any accidental spaces with underscores, 
        but the added tip should be a falsafe :) */


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

    form.addEventListener('submit', (e) => {
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
            e.preventDefault();
            errorForName.innerText = nameMessages.join(', ');
            errorForPassword.innerText = passwordMessages.join(', ');
            console.log('Form Error:', nameMessages.join(', '), passwordMessages.join(', '));
        } else {
            errorForName.innerText = '';
            errorForPassword.innerText = '';
        }
    });
});



