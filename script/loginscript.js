


// General Form Validation 



document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const name = document.getElementById('name');
    const password = document.getElementById('password');
    const errorForName = document.getElementById('name-error');
    const errorForPassword = document.getElementById('password-error');


    name.addEventListener('input', function () {
        let words = name.value.split(/\s+/).map(word => {
            return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
        });
        name.value = words.join(' ');

        let messages = [];
        if (name.value.trim() === '') {
            messages.push("We'd like to get to know you and learn your name!");
        }
        errorForName.innerText = messages.join(', ');
    });

  
    password.addEventListener('input', function () {
        let messages = [];

        if (password.value.length < 8) {
            messages.push('Password must be at least 8 characters long.');
        }

        if (password.value.length > 20) {
            messages.push('Password must be less than twenty characters.');
        }

        if (password.value === 'password' || password.value === 'Password') {
            messages.push('Your password cannot be "Password" - It will be guessed too easily!');
        }

        errorForPassword.innerText = messages.join(', ');
    });

  
    form.addEventListener('submit', (e) => {
        let nameMessages = [];
        let passwordMessages = [];

        if (name.value.trim() === '') {
            nameMessages.push("We'd like to get to know you and learn your name!");
        }

        if (password.value.length < 8) {
            passwordMessages.push('Password must be at least 8 characters long.');
        }

        if (nameMessages.length > 0 || passwordMessages.length > 0) {
            e.preventDefault();
            errorForName.innerText = nameMessages.join(', ');
            errorForPassword.innerText = passwordMessages.join(', ');
        } else {
            errorForName.innerText = '';
            errorForPassword.innerText = '';
        }
    });
});

