

// register email validation



document.addEventListener('DOMContentLoaded', function () {
    const email = document.getElementById('email');
    const errorForEmail = document.getElementById('email-error');

    email.addEventListener('input', function () {
        let messages = [];
        
        let emailPattern = /.*@(noroff\.no|stud\.noroff\.no)$/;

        console.log("Email input value:", email.value);
        console.log("Regex test result:", emailPattern.test(email.value));

        if (email.value === '' || email.value === null) {
            messages.push('Email is required');
        } else if (!emailPattern.test(email.value)) {
            messages.push('Note- Email must be from "@noroff.no" or "@stud.noroff.no" only, please.');
        }

        errorForEmail.innerText = messages.join(', ');
    });
});
