

// src/script/auth/register.mjs 



import { API_REGISTER } from "../constants.mjs";  

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const bannerUrl = document.getElementById("banner").value.trim();
        const avatarUrl = document.getElementById("avatar").value.trim();

        
        if (!name || !email || !password) {
            alert("Please fill out all required fields.");
            return;
        }

       
        const emailPattern = /^[\w\-.]+@(stud\.)?noroff\.no$/;
        if (!emailPattern.test(email)) {
            alert("Invalid email format. Use a 'stud.noroff.no' or 'noroff.no' email.");
            return;
        }

        
        const namePattern = /^[a-zA-Z0-9_]+$/;
        if (!namePattern.test(name)) {
            alert("Username can only contain letters, numbers, and underscores.");
            return;
        }

        
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

       
        const payload = {
            name,
            email,
            password,
            avatar: avatarUrl ? { url: avatarUrl, alt: "User avatar" } : null,
            banner: bannerUrl ? { url: bannerUrl, alt: "User banner" } : null
        };

        try {
            const response = await fetch(API_REGISTER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Registration successful! Redirecting to your new profile!...");
                window.location.href = "/pages/index-profile.html";

            } else {
                alert(`Registration failed: ${result.errors?.[0]?.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error registering user:", error);
            alert("An error occurred. Please try again.");
        }
    });
});
