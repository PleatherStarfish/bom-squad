import "../scss/index.scss";
import '../scss/node_modules/bootstrap';
import '../scss/node_modules/animate.css';

import './components/tooltip.js'
// import './components/fullscreen_menu.js'

window.onload = function () {

    // Thanks to StackOverflow user Phil Ricketts
    // for this getScrollPercent function.
    // (https://stackoverflow.com/a/8028584)
    function getScrollPercent() {
        const h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }

    const animateCSS = (element, animation, prefix = 'animate__') =>
      // We create a Promise and return it
      new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        const node = document.getElementById(element);
        node.style.visibility = "visible";

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
          event.stopPropagation();
          node.classList.remove(`${prefix}animated`, animationName);
          resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
      });

    const fullscreenMenu = document.getElementById('fullscreen-menu__container');
    const fullscreenMenuItems = document.getElementsByClassName("fullscreen-menu__item");
    const mainLogoImg = document.getElementById('logo__main');
    const secondaryLogo = document.getElementById('logo__secondary');
    const componentsOffcanvasBtn = document.getElementById('components__offcanvas-button');
    const componentsOffcanvasContainer = document.getElementById('components__offcanvas-container');

    // Bootstrap 5 event listeners for the full screen menu "hide" event
    fullscreenMenu.addEventListener('hide.bs.offcanvas', function () {
        secondaryLogo.classList.remove("logo__secondary--off-canvas");
        mainLogoImg.classList.remove("logo__main--off-canvas");
        const closeBtn = document.getElementById('fullscreen-menu__close-btn');
        closeBtn.style.visibility = 'hidden';

        const itemsLength = fullscreenMenuItems !== null ? fullscreenMenuItems.length : 0;
        for(let i = 0; i < itemsLength; i++) {
            fullscreenMenuItems[i].style.transition = "all .2s cubic-bezier(0.16, 1, 0.3, 1)";
            fullscreenMenuItems[i].classList.remove("fullscreen-menu__item--rotate-in");
        }
    });

    // Bootstrap 5 event listeners for the full screen menu "hidden" event
    fullscreenMenu.addEventListener('hidden.bs.offcanvas', function () {
        componentsOffcanvasBtn.style.visibility = "visible";
        componentsOffcanvasContainer.style.visibility = "visible";
    });

    // Bootstrap 5 event listeners for the fullswcreen menu "show" event
    fullscreenMenu.addEventListener('show.bs.offcanvas', function () {
        secondaryLogo.classList.add("logo__secondary--off-canvas");
        mainLogoImg.classList.add("logo__main--off-canvas");
        componentsOffcanvasBtn.style.visibility = "hidden";
        componentsOffcanvasContainer.style.visibility = "hidden";
    });

    // Bootstrap 5 event listeners for the fullswcreen menu "shown" event
    fullscreenMenu.addEventListener('shown.bs.offcanvas', function () {

        setTimeout(function() {
            animateCSS('fullscreen-menu__close-btn', "bounceIn");
        }, 1000);

        setTimeout(function() {
            const itemsLength = fullscreenMenuItems !== null ? fullscreenMenuItems.length : 0;
            // fullscreenMenuItems[i].style.transition = "all .2s cubic-bezier(0.55, 0, 1, 0.45)";
            for(let i = 0; i < itemsLength; i++) {
                fullscreenMenuItems[i].classList.add("fullscreen-menu__item--rotate-in");
            }
         }, 600);

    });

    // On scroll, we get the scroll percentage and do stuff with it
    window.addEventListener("scroll", function (e) {
        if (getScrollPercent() > 70) {
            secondaryLogo.classList.add("logo__secondary--visible");
            mainLogoImg.classList.add("logo__main--hidden")
        } else {
            secondaryLogo.classList.remove("logo__secondary--visible");
            mainLogoImg.classList.remove("logo__main--hidden")
        }
    });

    lax.init();

    // Add a driver that we use to control our animations
    lax.addDriver('scrollY', function () {
        return window.scrollY
    });

    lax.addElements('.logo__main', {
        scrollY: {
            scale: [[0, 'screenHeight/3'], {767:[], 768: [1, 0.6]}, {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('.logo__secondary', {
        scrollY: {
            scale: [[0, 'screenHeight/3'], {991:[], 992: [1, 0.6]}, {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('.logo__secondary--main-hidden', {
        scrollY: {
            scale: [[0, 'screenHeight/3'], {991:[], 992: [1, 0.7]}, {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('#topnav__main', {
        scrollY: {
            height: [[0, 'screenHeight/3'], {991:[], 992: [90, 70]}, {cssUnit: "px", easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('.module-list__subtitle', {
        scrollY: {
            opacity: [[0, 'screenHeight/6'], [1.0, 0.0], {inertia: 10}]
        }
    });
};