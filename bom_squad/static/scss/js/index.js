/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("window.onload = function () {\n  // Thanks to StackOverflow user Phil Ricketts https://stackoverflow.com/a/8028584\n  // for this getScrollPercent function.\n  function getScrollPercent() {\n    var h = document.documentElement,\n        b = document.body,\n        st = 'scrollTop',\n        sh = 'scrollHeight';\n    return (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;\n  } // var width = screen.width;\n  // var height = screen.height;\n  //\n  // function onresize(e) {\n  //    width = e.target.outerWidth;\n  //    height = e.target.outerHeight;\n  // }\n  //\n  // window.addEventListener(\"resize\", onresize);\n\n\n  var offcanvasTop = document.getElementById('offcanvasTop');\n  var logoImg = document.getElementById('logo-img-head-static');\n  var headLogo = document.getElementById('head-logo');\n  offcanvasTop.addEventListener('hide.bs.offcanvas', function () {\n    headLogo.classList.remove(\"hide-logo-img\");\n    logoImg.classList.remove(\"hide-logo-img\");\n  });\n  offcanvasTop.addEventListener('show.bs.offcanvas', function () {\n    headLogo.classList.add(\"hide-logo-img\");\n    logoImg.classList.add(\"hide-logo-img\");\n  });\n  window.addEventListener(\"scroll\", function (e) {\n    if (getScrollPercent() > 70) {\n      headLogo.classList.add(\"head-logo-shown\");\n      logoImg.classList.add(\"logo-img-hidden\");\n    } else {\n      headLogo.classList.remove(\"head-logo-shown\");\n      logoImg.classList.remove(\"logo-img-hidden\");\n    }\n  });\n  lax.init(); // Add a driver that we use to control our animations\n\n  lax.addDriver('scrollY', function () {\n    return window.scrollY;\n  });\n  lax.addElements('.logo-img-head-static', {\n    scrollY: {\n      scale: [[0, 'screenHeight/3'], [1, 0.6], {\n        easing: 'easeInOutQuint',\n        inertia: 10\n      }]\n    }\n  });\n  lax.addElements('.head-logo', {\n    scrollY: {\n      scale: [[0, 'screenHeight/3'], [1, 0.6], {\n        easing: 'easeInOutQuint',\n        inertia: 10\n      }]\n    }\n  });\n  lax.addElements('#main-nav', {\n    scrollY: {\n      height: [[0, 'screenHeight/3'], [90, 70], {\n        cssUnit: \"px\",\n        easing: 'easeInOutQuint',\n        inertia: 10\n      }]\n    }\n  });\n  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=\"tooltip\"]'));\n  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {\n    return new bootstrap.Tooltip(tooltipTriggerEl);\n  });\n};\n\n//# sourceURL=webpack://scss/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.js"]();
/******/ 	
/******/ })()
;