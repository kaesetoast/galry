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
        // register eventlistener to set the current item
        galry.addEventListener('changeItem', setCurrentItem);
        galry.addHook(galry.GALLERY_READY_HOOK, initElements);
    };

    galry.thumbPanel.destroy = function() {
        galry.lightbox.getMaximizedLayer().removeChild(thumbWrapper);
        galry.removeEventListener('changeItem', setCurrentItem);
    };

    galry.thumbPanel.getThumbPanelDomNode = function() {
        return thumbWrapper;
    };

    function initElements() {
        thumbPanel = galleryWrapper.cloneNode(true);
        thumbPanel.className = '';
        // unset the id
        thumbPanel.id = '';
        thumbWrapper.classList.add(options.styles.thumbPanelClassName);
        galry.lightbox.getMaximizedLayer().appendChild(thumbWrapper);
        thumbWrapper.appendChild(thumbPanel);
        thumbGalItems = thumbPanel.getElementsByClassName(options.styles.elementsClassName);
        for (var i = thumbGalItems.length - 1; i >= 0; i--) {
            thumbGalItems[i].addEventListener('click', maximizeClick, false);
        }
    }

    /**
     * Set the currently maximized item
     * this function gets called by the galry changeItem event
     * @param {event} _event The changeItem event
     */
    function setCurrentItem(_event) {
        var maximizedItems = thumbPanel.getElementsByClassName(options.styles.currentItemClassName),
            currentThumbItem = thumbGalItems[_event.detail.currentItemId];
        for (var i = maximizedItems.length - 1; i >= 0; i--) {
            maximizedItems[i].classList.remove(options.styles.currentItemClassName);
        }
        currentThumbItem.classList.add(options.styles.currentItemClassName);
        if (currentThumbItem.offsetLeft + currentThumbItem.clientWidth > window.innerWidth) {
            delta = window.innerWidth - currentThumbItem.offsetLeft - currentThumbItem.clientWidth;
            setTransform(delta);
        } else if (currentThumbItem.offsetLeft + delta < 0) {
            setTransform(0);
            delta = 0;
        }
    }

    /**
     * Click handler for maximizing items
     * 
     * @param {event}   The click event
     */
    function maximizeClick (_event) {
        _event.preventDefault();
        galry.maximize(_event.currentTarget);
    }

    function setTransform(delta) {
        thumbPanel.style.webkitTransform = thumbPanel.style.MozTransform = thumbPanel.style.msTransform = thumbPanel.style.OTransform = thumbPanel.style.transform = 'translate('+delta+'px,0)';
    }

})();
