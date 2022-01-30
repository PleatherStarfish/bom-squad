import "./index.scss";
import 'bootstrap'

window.onload = function () {

    // Thanks to StackOverflow user Phil Ricketts
    // for this getScrollPercent function.
    // (https://stackoverflow.com/a/8028584)
    function getScrollPercent() {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }

    var fullscreenMenu = document.getElementById('fullscreen-menu__container');
    var mainLogoImg = document.getElementById('logo__main');
    var secondaryLogo = document.getElementById('logo__secondary');

    fullscreenMenu.addEventListener('hide.bs.offcanvas', function () {
        secondaryLogo.classList.remove("logo__secondary--off-canvas");
        mainLogoImg.classList.remove("logo__main--off-canvas");
    });
    fullscreenMenu.addEventListener('show.bs.offcanvas', function () {
        secondaryLogo.classList.add("logo__secondary--off-canvas");
        mainLogoImg.classList.add("logo__main--off-canvas");
    });

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
            scale: [[0, 'screenHeight/3'], [1, 0.6], {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('.logo__secondary', {
        scrollY: {
            scale: [[0, 'screenHeight/3'], [1, 0.6], {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('.logo__secondary--main-hidden', {
        scrollY: {
            scale: [[0, 'screenHeight/3'], [1, 0.7], {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('#topnav__main', {
        scrollY: {
            height: [[0, 'screenHeight/3'], [90, 70], {cssUnit: "px", easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('.module-list__subtitle', {
        scrollY: {
            opacity: [[0, 'screenHeight/6'], [1.0, 0.0], {inertia: 10}]
        }
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
};