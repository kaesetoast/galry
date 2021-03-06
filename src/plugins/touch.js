/**
 * This module adds the ability to control the gallery via touchevents
 */
galry.touch = {};

(function() {

    'use strict';

    var firstTouchPosition,
        closeButton,
        maximizedLayer,
        maximizedGalleryItems;

    /**
     * Initialize the touch module
     */
    galry.touch.init = function() {
        if (isTouchSupported()) {
            maximizedLayer = galry.lightbox.getMaximizedLayer();
            maximizedGalleryItems = galry.lightbox.getMaximizedGalleryItems();
            maximizedLayer.addEventListener('touchstart', touchstart);
            maximizedLayer.addEventListener('touchmove', touchmove);
            maximizedLayer.addEventListener('touchend', touchend);
            maximizedLayer.classList.add('touch-supported');
            initCloseButton();
        }
    };

    function initCloseButton() {
        closeButton = document.createElement('a');
        closeButton.innerText = options.closeButtonText;
        closeButton.classList.add(options.styles.closeButtonClassName);
        maximizedLayer.appendChild(closeButton);
        closeButton.addEventListener('click', galry.minimize);
    }

    function touchstart(_event) {
        firstTouchPosition = _event.changedTouches[0].screenX;
    }

    function touchmove(_event) {
        _event.preventDefault();
        var delta = _event.changedTouches[0].screenX - firstTouchPosition;
        maximizedGalleryItems[galry.getCurrentItemId()].style.webkitTransform = 'translate(' + delta + 'px, 0px)';
    }

    function touchend(_event) {
        maximizedGalleryItems[galry.getCurrentItemId()].style.webkitTransform = '';
        if (firstTouchPosition > _event.changedTouches[0].screenX) {
            galry.next();
        } else {
            galry.prev();
        }
    }

    function isTouchSupported() {
        return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
    }

})();
