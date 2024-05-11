



// Error handling with form submission:






document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form'); 
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const errorForEmail = document.getElementById('email-error');
    const errorForPassword = document.getElementById('password-error');

    // This checks that the email (for school) is correct- should not accept otherwise
    email.addEventListener('input', function () {
        let messages = [];
        let emailPattern = /.*@noroff\.no|.*@stud\.noroff\.no$/;

        if (email.value === '' || email.value == null) {
            messages.push('Email is required');
        } else if (!emailPattern.test(email.value)) {
            messages.push('Note- Email must be from "@noroff.no" or "@stud.noroff.no" only, please.');
        }

        errorForEmail.innerText = messages.join(', ');
    });

    // Checks password length for strength etc--
    password.addEventListener('input', function () {
        let messages = [];

        if (password.value.length < 8) {
            messages.push('Password must be at least 8 characters long.');
        }

        if (password.value.length >20) {
            messages.push('Password must be less that twenty characters.')
        }

        if (password.value === 'password' || password.value === 'Password') {
            messages.push('Your password cannot be "Password"- It will be guessed too easily!');
        }

        errorForPassword.innerText = messages.join(', ');
    });



    // Form submission to prevent default submission mechanics
    form.addEventListener('submit', (e) => {
        let emailMessages = [];
        let passwordMessages = [];



        // This bit validates the email
        let emailPattern = /.*@noroff\.no|.*@stud\.noroff\.no$/;
        if (email.value === '' || email.value == null) {
            emailMessages.push('Email is required');
        } else if (!emailPattern.test(email.value)) {
            emailMessages.push('Email must be from "@noroff.no" or "@stud.noroff.no" only, please.');
        }

        // And this validates the password and checks that it is eight characters or more
        if (password.value.length < 8) {
            passwordMessages.push('Password must be at least 8 characters long.');
        }

        // And lastly- this prevents the submission of the form if there are any errors! Hurrah! 
        if (emailMessages.length > 0 || passwordMessages.length > 0) {
            e.preventDefault();
            errorForEmail.innerText = emailMessages.join(', ');
            errorForPassword.innerText = passwordMessages.join(', ');
        } else {
            errorForEmail.innerText = '';
            errorForPassword.innerText = '';
        }
    });
});