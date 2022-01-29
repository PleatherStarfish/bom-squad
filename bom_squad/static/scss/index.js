import "./index.scss";
import 'bootstrap'

window.onload = function () {

    // Thanks to StackOverflow user Phil Ricketts https://stackoverflow.com/a/8028584
    // for this getScrollPercent function.
    function getScrollPercent() {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
    }

    var offcanvasTop = document.getElementById('offcanvasTop');
    var mainLogoImg = document.getElementById('logo__main');
    var headLogo = document.getElementById('head-logo');

    offcanvasTop.addEventListener('hide.bs.offcanvas', function () {
        headLogo.classList.remove("hide-logo-img");
        mainLogoImg.classList.remove("hide-logo-img");
    });
    offcanvasTop.addEventListener('show.bs.offcanvas', function () {
        headLogo.classList.add("hide-logo-img");
        mainLogoImg.classList.add("hide-logo-img");
    });

    window.addEventListener("scroll", function (e) {
        if (getScrollPercent() > 70) {
            headLogo.classList.add("head-logo-shown");
            mainLogoImg.classList.add("logo-img-hidden")
        } else {
            headLogo.classList.remove("head-logo-shown");
            mainLogoImg.classList.remove("logo-img-hidden")
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

    lax.addElements('.head-logo', {
        scrollY: {
            scale: [[0, 'screenHeight/3'], [1, 0.6], {easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    lax.addElements('#main-nav', {
        scrollY: {
            height: [[0, 'screenHeight/3'], [90, 70], {cssUnit: "px", easing: 'easeInOutQuint', inertia: 10}]
        }
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
};