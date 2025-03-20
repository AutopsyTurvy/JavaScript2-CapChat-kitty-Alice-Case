


// hamburger menu


/**
 * Toggles the visibility of the navigation menu in a slide-in/slide-out effect- one of my favourite menus to date! 
 *
 * - Expands the menu to `250px` width when opened.
 * - Collapses the menu back to `0` width when closed.
 * - Adds or removes the `"change"` class on the `.hamburger-menu-bar` to animate the icon- animation is also added
 * - Ensures smooth interaction for the hamburger menu in mobile or small-screen navigation.
 *
 * @example
 * // Attach to a button with an `onclick` event:
 * <button onclick="toggleMenu()">☰</button>
 *
 * // Or call directly in JavaScript:
 * toggleMenu();
 */
function toggleMenu() {
    var menu = document.getElementById("navMenu");

    // Toggles between open (250px) and closed (0px)
    menu.style.width = menu.style.width === "250px" ? "0" : "250px";

    // Toggles the visual transformation of the hamburger icon
    document.querySelector(".hamburger-menu-bar").classList.toggle("change");
}
