(function(root, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.galry = factory()
}(this, function() {

'use strict';

/**
 * Maximize the given item
 * 
 * @param  {mixed} _item the item itself, or its id
 */
galry.maximize = function (_item) {
    if (typeof _item === 'number') {
        _item = galleryItems[_item];
    }
    var newMaximizedItemId = parseInt(_item.getAttribute('data-id'), 10);
    // remove old classes
    maximizedGalleryItems[currentMaximizedItemId].classList.remove(options.styles.currentMaximizedImageClassName);
    maximizedGalleryItems[getPrevItemId(currentMaximizedItemId)].classList.remove(options.styles.prevMaximizedImageClassName);
    maximizedGalleryItems[getNextItemId(currentMaximizedItemId)].classList.remove(options.styles.nextMaximizedImageClassName);
    // set the new current index
    currentMaximizedItemId = newMaximizedItemId;
    // set new classes
    maximizedGalleryItems[currentMaximizedItemId].classList.add(options.styles.currentMaximizedImageClassName);
    maximizedGalleryItems[getPrevItemId(currentMaximizedItemId)].classList.add(options.styles.prevMaximizedImageClassName);
    maximizedGalleryItems[getNextItemId(currentMaximizedItemId)].classList.add(options.styles.nextMaximizedImageClassName);
    // show maximized layer
    maximizedLayer.classList.remove(options.styles.maximizedLayerHiddenClassName);
    var evnt = new CustomEvent('maximize', {
        detail: {
            currentMaximizedItemId: currentMaximizedItemId
        }
    });
    galleryWrapper.dispatchEvent(evnt);
};

/**
 * Minimize the gallery
 */
galry.minimize = function () {
    maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
};

/**
 * Maximize the next item in line
 */
galry.next = function() {
    if (!maximizedLayer.classList.contains(options.styles.maximizedLayerHiddenClassName)) {
        var nextItem = getNextItemId(currentMaximizedItemId);
        galry.maximize(galleryItems[nextItem]);
        var evnt = new CustomEvent('nextItem', {
            detail: {
                currentMaximizedItemId: nextItem
            }
        });
        galleryWrapper.dispatchEvent(evnt);
    }
};

/**
 * Maximize the previous item in line
 */
galry.prev = function() {
    if (!maximizedLayer.classList.contains(options.styles.maximizedLayerHiddenClassName)) {
        var nextItem = getPrevItemId(currentMaximizedItemId);
        galry.maximize(galleryItems[nextItem]);
        var evnt = new CustomEvent('prevItem', {
            detail: {
                currentMaximizedItemId: nextItem
            }
        });
        galleryWrapper.dispatchEvent(evnt);
    }
};

/**
 * Returns the ID of the currently maximized item
 * 
 * @return {Number} The id
 */
galry.getCurrentItemId = function() {
    return currentMaximizedItemId;
};

/**
 * Get the ID of the next item in line
 * 
 * @param  {Number} _currentItemId The ID of the currently maximized item
 * @return {Number}                The ID of the next item in line
 */
function getNextItemId(_currentItemId) {
    if (_currentItemId + 1 >= galleryItems.length) {
        return 0;
    } else {
        return _currentItemId + 1;
    }
}

/**
 * Get the ID of the previous item in line
 * 
 * @param  {Number} _currentItemId The ID of the currently maximized item
 * @return {Number}                The ID of the previous item in line
 */
function getPrevItemId(_currentItemId) {
    if (_currentItemId <= 0) {
        return galleryItems.length - 1;
    } else {
        return _currentItemId - 1;
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

/**
 * Handler for mouseWheel
 * @param  {event} _event The mousewheel event
 */
function mouseWheelMove(_event) {
    _event.preventDefault();
    if (Math.max(-1, Math.min(1, (_event.wheelDelta || -_event.detail))) > 0) {
        galry.prev();
    } else {
        galry.next();
    }
}
var galleryWrapper,
    galleryItems,
    maximizedGallery,
    maximizedGalleryItems,
    maximizedLayer,
    controlNext,
    controlPrev,
    currentMaximizedItemId,
    options = {
        styles: {
            elementsClassName: 'gal-item',
            maximizedLayerHiddenClassName: 'hidden',
            maximizedLayerClassName: 'gal-maximized-layer',
            currentMaximizedImageClassName: 'gal-current-max',
            nextMaximizedImageClassName: 'gal-next-max',
            prevMaximizedImageClassName: 'gal-prev-max',
            controlNextClassName: 'gal-control-next',
            controlPrevClassName: 'gal-control-prev',
            thumbPanelClassName: 'gal-thumb-panel',
            maximizedGalleryClassName: 'gal-maximized-gallery',
            closeButtonClassName: 'gal-close-button',
            topBarClassName: 'gal-top-bar'
        },
        closeButtonText: 'close',
        showThumbPanel: true,
        activteTouch: true
    };

/**
 * Constructor function
 * 
 * @param  {mixed}  _galleryIdentifier the DOM Node that contains the gallery or its id-string
 * @param  {object} _options           the configuration object
 * @return {Function}                  the api object
 */
function galry(_galleryIdentifier, _options) {
    galry.setOptions(_options);
    galleryWrapper = fetchGalleryElement(_galleryIdentifier);
    initGallery();
    return galry;
}

/**
 * Set custom options. This function will merge your custom options with the default ones
 * 
 * @param {object} _options the option object
 */
galry.setOptions = function(_options) {
    for (var option in _options) {
        if (options[option]) {
            options[option] = _options[option];
        }
    }
};

/**
 * This function destroys the galry instance and cleans up the DOM
 * 
 */
galry.destroy = function() {
    if (options.showThumbPanel && typeof galry.thumbPanel !== 'undefined') {
        galry.thumbPanel.destroy();
    }
    removeEventListeners();
    document.body.removeChild(maximizedLayer);
};

/**
 * Returns the gallery root node
 * 
 * @return {DomNode}
 */
galry.getGalleryDomNode = function() {
    return galleryWrapper;
};

/**
 * Initialize the gallery
 */
function initGallery () {
    maximizedGallery = document.createElement('ul');
    maximizedGalleryItems = [];
    maximizedLayer = document.createElement('div');
    controlNext = document.createElement('a');
    controlPrev = document.createElement('a');
    currentMaximizedItemId = 0;
    // fetch and set up gallery items
    galleryItems = galleryWrapper.getElementsByClassName(options.styles.elementsClassName);
    for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].addEventListener('click', maximizeClick, false);
        galleryItems[i].setAttribute('data-id', i);
        var item = document.createElement('li'),
            image = document.createElement('img');
        maximizedGallery.appendChild(item);
        maximizedGallery.classList.add(options.styles.maximizedGalleryClassName);
        maximizedGalleryItems.push(item);
        item.appendChild(image);
        item.classList.add(options.styles.elementsClassName);
        image.addEventListener('load', setImageDimensions);
        image.src = galleryItems[i].href;
    }
    // create fullscreen layer
    maximizedLayer.classList.add(options.styles.maximizedLayerClassName);
    maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
    document.body.appendChild(maximizedLayer);
    maximizedLayer.appendChild(maximizedGallery);
    // create control elements
    controlNext.classList.add(options.styles.controlNextClassName);
    controlPrev.classList.add(options.styles.controlPrevClassName);
    maximizedLayer.appendChild(controlNext);
    maximizedLayer.appendChild(controlPrev);
    // events
    initEventListeners();
    if (options.showThumbPanel && typeof galry.thumbPanel !== 'undefined') {
        galry.thumbPanel.init();
    }
    if (options.activteTouch && typeof galry.touch !== 'undefined') {
        galry.touch.init();
    }
    var evnt = new CustomEvent('ready');
    galleryWrapper.dispatchEvent(evnt);
}

/**
 * Add a listener for the galry events
 * 
 * @param {string}   eventName the name of the event
 * @param {Function} callback
 */
galry.addEventListener = function(_eventName, _callback) {
    galleryWrapper.addEventListener(_eventName, _callback);
};

galry.removeEventListener = function(_eventName, _callback) {
    galleryWrapper.removeEventListener(_eventName, _callback);
};

/**
 * Set max-width and max-height to the exact dimensions of the image
 * This function should be called through an onLoad listener on the image
 * 
 * @param {event} _event the onLoad event
 */
function setImageDimensions(_event) {
    var image = _event.target;
    image.style.maxHeight = image.naturalHeight + 'px';
    image.style.maxWidth = image.naturalWidth + 'px';
}

/**
 * This function fetches the gallery element by id-string or through
 * the correspponding DOM Node
 * 
 * @param  {[type]} _galleryIdentifier [description]
 * @return {[type]}                    [description]
 */
function fetchGalleryElement(_galleryIdentifier) {
    if (typeof _galleryIdentifier === 'string') {
        return document.getElementById(_galleryIdentifier);
    } else if (typeof _galleryIdentifier === 'object') {
        return _galleryIdentifier;
    } else {
        throw 'Could not find the gallery element. Please provide either an id-string, or the object itself';
    }
}

/**
 * Event Handler for any keydown event
 * 
 * @param  {[type]} _event The keydown event
 */
function handleKeyDownEvents(_event) {
    if (_event.keyCode == 27) {
        galry.minimize();
    } else if (_event.keyCode == 38 || _event.keyCode == 39) {
        galry.next();
    } else if (_event.keyCode == 37 || _event.keyCode == 40) {
        galry.prev();
    }
}

/**
 * Event Handler for clicks on the maximized layer
 * 
 * @param  {[type]} _event The click event
 */
function handleClickOnMaximizedLayer(_event) {
    // check if that the click did not appear on the image
    // to prevent unwanted closing
    if (_event.target.nodeName !== 'IMG' && _event.target.nodeName !== 'A') {
        galry.minimize();
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    document.addEventListener('keydown', handleKeyDownEvents);
    maximizedLayer.addEventListener('DOMMouseScroll', mouseWheelMove);
    maximizedLayer.addEventListener('mousewheel', mouseWheelMove);
    maximizedLayer.addEventListener('click', handleClickOnMaximizedLayer);
    controlNext.addEventListener('click', galry.next);
    controlPrev.addEventListener('click', galry.prev);
}

/**
 * This function removes all event listeners added by this library
 * it serves as a part of the cleanup function
 * 
 */
function removeEventListeners() {
    document.removeEventListener('keydown', handleKeyDownEvents);
    maximizedLayer.removeEventListener('DOMMouseScroll', mouseWheelMove);
    maximizedLayer.removeEventListener('mousewheel', mouseWheelMove);
    maximizedLayer.removeEventListener('click', handleClickOnMaximizedLayer);
}
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
        var maximizedItems = thumbPanel.getElementsByClassName(options.styles.currentMaximizedImageClassName);
        for (var i = maximizedItems.length - 1; i >= 0; i--) {
            maximizedItems[i].classList.remove(options.styles.currentMaximizedImageClassName);
        }
        thumbGalItems[_event.detail.currentMaximizedItemId].classList.add(options.styles.currentMaximizedImageClassName);
    }
})();

/**
 * This module adds the ability to control the gallery via touchevents
 */
galry.touch = {};

(function() {

    var firstTouchPosition,
        topBar,
        closeButton;

    /**
     * Initialize the touch module
     */
    galry.touch.init = function() {
        if (isTouchSupported()) {
            maximizedLayer.addEventListener('touchstart', touchstart);
            maximizedLayer.addEventListener('touchmove', touchmove);
            maximizedLayer.addEventListener('touchend', touchend);
            maximizedLayer.classList.add('touch-supported');
            initTopBar();
            closeButton.addEventListener('click', galry.minimize);
        }
    };

    function initTopBar() {
        topBar = document.createElement('div');
        closeButton = document.createElement('a');
        closeButton.innerText = options.closeButtonText;
        closeButton.classList.add(options.styles.closeButtonClassName);
        topBar.appendChild(closeButton);
        topBar.classList.add(options.styles.topBarClassName);
        maximizedLayer.appendChild(topBar);
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


return galry;
}));