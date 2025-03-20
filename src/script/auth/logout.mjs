


// src/script/auth/logout.mjs



/**
 * Logs out the user by clearing all stored session data in local storage and redirecting to the homepage (register page).
 *
 * - Removes all stored data from `localStorage`, including authentication tokens and user profile information.
 * - Redirects the user to the `/index.html` page after logout.
 * - Ensures a clean session state upon logout.
 *
 * @example
 * logout(); // Clears local storage and redirects the user.
 */
export function logout() {
    localStorage.clear();
    console.log("User logged out. Redirecting...");
    window.location.href = "/index.html";
}

/**
 * Adds event listeners to all elements with the `.logout-button` class to trigger the logout process.
 *
 * - Prevents the default link behavior when clicking a logout button.
 * - Calls the `logout()` function to clear session data and redirect the user.
 * - Ensures proper logout functionality when buttons are dynamically added to the DOM.
 *
 * @listens DOMContentLoaded - Ensures event listeners are attached once the DOM is fully loaded.
 *
 * @example
 * <button class="logout-button">Logout</button>
 */
document.addEventListener("DOMContentLoaded", () => {
    const logoutButtons = document.querySelectorAll(".logout-button");

    logoutButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            logout();
        });
    });
});
