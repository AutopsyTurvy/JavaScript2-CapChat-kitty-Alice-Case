


// hamburger menu


function toggleMenu() {
    var menu = document.getElementById("navMenu");
    menu.style.width = menu.style.width === "250px" ? "0" : "250px";
    document.querySelector(".hamburger-menu-bar").classList.toggle("change");
}