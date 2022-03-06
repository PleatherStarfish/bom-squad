window.onload = function () {

    const fullscreenMenu = document.getElementById('fullscreen-menu__container');
    const fullscreenMenuItems = document.getElementsByClassName("fullscreen-menu__item");
    const mainLogoImg = document.getElementById('logo__main');
    const secondaryLogo = document.getElementById('logo__secondary');

    // Bootstrap 5 event listeners for the fullswcreen menu "hide" event
    fullscreenMenu.addEventListener('hide.bs.offcanvas', () => {
        secondaryLogo.classList.remove("logo__secondary--off-canvas");
        mainLogoImg.classList.remove("logo__main--off-canvas");
        const closeBtn = document.getElementById('fullscreen-menu__close-btn');
        closeBtn.style.visibility = 'hidden';

        const itemsLength = fullscreenMenuItems !== null ? fullscreenMenuItems.length : 0;
        for (let i = 0; i < itemsLength; i++) {
            fullscreenMenuItems[i].style.transition = "all .2s cubic-bezier(0.16, 1, 0.3, 1)";
            fullscreenMenuItems[i].classList.remove("fullscreen-menu__item--rotate-in");
        }
    });

    // Bootstrap 5 event listeners for the full screen menu "show" event
    fullscreenMenu.addEventListener('show.bs.offcanvas', () => {
        secondaryLogo.classList.add("logo__secondary--off-canvas");
        mainLogoImg.classList.add("logo__main--off-canvas");
    });

    // Bootstrap 5 event listeners for the fullswcreen menu "shown" event
    fullscreenMenu.addEventListener('shown.bs.offcanvas', () => {

        setTimeout(() => {
            animateCSS('fullscreen-menu__close-btn', "bounceIn");
        }, 1000);

        setTimeout(() => {
            const itemsLength = fullscreenMenuItems !== null ? fullscreenMenuItems.length : 0;
            // fullscreenMenuItems[i].style.transition = "all .2s cubic-bezier(0.55, 0, 1, 0.45)";
            for (let i = 0; i < itemsLength; i++) {
                fullscreenMenuItems[i].classList.add("fullscreen-menu__item--rotate-in");
            }
        }, 600);

    });

};