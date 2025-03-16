


// src/script/auth/logout.mjs



function logoutUser() {
   
    localStorage.removeItem("profile");
    localStorage.removeItem("token");
    localStorage.removeItem("apiKey");

    
    window.location.href = "/index.html";
}


document.addEventListener("DOMContentLoaded", () => {
    const logoutLinks = document.querySelectorAll(".logout-button");

    logoutLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 
            logoutUser();
        });
    });
});
