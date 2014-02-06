/**
 * This module displays a panel with clickable thumbnails in fullscreen mode
 */
galry.thumbPanel = {};

(function() {
    var thumbWrapper,
        thumbPanel,
        thumbGalItems,
        delta = 0;

    /**
     * Initialize the thumbPanel
     */
    galry.thumbPanel.init = function() {
        thumbWrapper = document.createElement('div');
        thumbPanel = galleryWrapper.cloneNode(true);
        // unset the id
        thumbPanel.id = '';
        thumbWrapper.classList.add(options.styles.thumbPanelClassName);
        maximizedLayer.appendChild(thumbWrapper);
        thumbWrapper.appendChild(thumbPanel);
        thumbGalItems = thumbPanel.getElementsByClassName(options.styles.elementsClassName);
        for (var i = thumbGalItems.length - 1; i >= 0; i--) {
            thumbGalItems[i].addEventListener('click', maximizeClick, false);
        }
        // register eventlistener to set the current item
        galry.addEventListener('maximize', setCurrentItem);
    };

    galry.thumbPanel.destroy = function() {
        maximizedLayer.removeChild(thumbPanel);
        galry.removeEventListener('maximize', setCurrentItem);
    };

    /**
     * Set the currently maximized item
     * this function gets called by the galry maximize event
     * @param {event} _event The maximize event
     */
    function setCurrentItem(_event) {
        var maximizedItems = thumbPanel.getElementsByClassName(options.styles.currentMaximizedImageClassName),
            currentThumbItem = thumbGalItems[_event.detail.currentMaximizedItemId];
        for (var i = maximizedItems.length - 1; i >= 0; i--) {
            maximizedItems[i].classList.remove(options.styles.currentMaximizedImageClassName);
        }
        currentThumbItem.classList.add(options.styles.currentMaximizedImageClassName);
        console.log(currentThumbItem.offsetLeft, delta);
        if (currentThumbItem.offsetLeft + currentThumbItem.clientWidth > window.innerWidth) {
            delta = window.innerWidth - currentThumbItem.offsetLeft - currentThumbItem.clientWidth;
            setTransform(delta);
        } else if (currentThumbItem.offsetLeft + delta < 0) {
            setTransform(0);
            delta = 0;
        }
    }

    function setTransform(delta) {
        thumbPanel.style.webkitTransform = thumbPanel.style.MozTransform = thumbPanel.style.msTransform = thumbPanel.style.OTransform = thumbPanel.style.transform = 'translate('+delta+'px,0)';
    }

})();
