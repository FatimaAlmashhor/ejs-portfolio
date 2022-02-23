
// Preload images
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
    });
};

// Preload images
const preloadFonts = (id) => {
    return new Promise((resolve) => {
        WebFont.load({
            typekit: {
                id: id
            },
            active: resolve
        });
    });
};

// (function () {
//     var scroll = new LocomotiveScroll({
//         el: document.querySelector('[data-scroll-container]'),
//         smooth: true
//     });
// })();
// -------- toggle sub menus --------
const navLinks = document.querySelectorAll(".nav__link");

navLinks.forEach((link) => link.addEventListener("click", drop));

function drop() {
    const subMenu = this.nextElementSibling;
    if (subMenu) {
        // if sub menu exists
        if (subMenu.style.height == "0px" || subMenu.style.height == "") {
            subMenu.style.height = subMenu.scrollHeight + "px";
            // open side nav
            sideNav.style.width = "14rem";
        } else {
            subMenu.style.height = "0px";
        }
    }
}

// --------- Toggle Side Nav --------
const menuBtn = document.querySelector("#nav-toggle");
const sideNav = document.querySelector("#side-nav");

menuBtn.addEventListener("click", toggleSideNav);

function toggleSideNav() {
    if (sideNav.style.width == "5.6rem" || sideNav.style.width == "") {
        sideNav.style.width = "14rem";
    } else {
        // close side nav
        sideNav.style.width = "5.6rem";
        // close all opened sub menus
        document.querySelectorAll('.nav__drop').forEach(drop => drop.style.height = '0px');

    }
}
