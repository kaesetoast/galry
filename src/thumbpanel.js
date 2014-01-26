/**
 * This module displays a panel with clickable thumbnails in fullscreen mode
 */
galry.thumbPanel = {};

(function() {
    var thumbPanel,
        thumbGalItems;

    /**
     * Initialize the thumbPanel
     */
    galry.thumbPanel.init = function() {
        thumbPanel = galleryWrapper.cloneNode(true);
        // unset the id
        thumbPanel.id = '';
        thumbPanel.classList.add(options.styles.thumbPanelClassName);
        maximizedLayer.appendChild(thumbPanel);
        thumbGalItems = thumbPanel.getElementsByClassName(options.styles.elementsClassName);
        for (var i = thumbGalItems.length - 1; i >= 0; i--) {
            thumbGalItems[i].addEventListener('click', maximizeClick, false);
        }
        // register eventlistener to set the current item
        galry.addEventListener('maximize', setCurrentItem);
    };

    /**
     * Set the currently maximized item
     * this function gets called by the galry maximize event
     * @param {event} _event The maximize event
     */
    function setCurrentItem(_event) {
        var maximizedItems = thumbPanel.getElementsByClassName(options.styles.currentMaximizedImageClassName);
        for (var i = maximizedItems.length - 1; i >= 0; i--) {
            maximizedItems[i].classList.remove(options.styles.currentMaximizedImageClassName);
        }
        thumbGalItems[_event.detail.currentMaximizedItemId].classList.add(options.styles.currentMaximizedImageClassName);
    }
})();
