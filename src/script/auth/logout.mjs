


// src/script/auth/logout.mjs



export function logout() {
    localStorage.clear(); 
    console.log("User logged out. Redirecting...");
    window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButtons = document.querySelectorAll(".logout-button");

    logoutButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            logout();
        });
    });
});
