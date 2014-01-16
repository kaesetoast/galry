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
    // remove old classes
    maximizedGalleryItems[currentMaximizedItemId].classList.remove(options.styles.currentMaximizedImageClassName);
    maximizedGalleryItems[getPrevItemId(currentMaximizedItemId)].classList.remove(options.styles.prevMaximizedImageClassName);
    maximizedGalleryItems[getNextItemId(currentMaximizedItemId)].classList.remove(options.styles.nextMaximizedImageClassName);
    // set the new current index
    currentMaximizedItemId = parseInt(_item.getAttribute('data-id'), 10);
    // set new classes
    maximizedGalleryItems[currentMaximizedItemId].classList.add(options.styles.currentMaximizedImageClassName);
    maximizedGalleryItems[getPrevItemId(currentMaximizedItemId)].classList.add(options.styles.prevMaximizedImageClassName);
    maximizedGalleryItems[getNextItemId(currentMaximizedItemId)].classList.add(options.styles.nextMaximizedImageClassName);
    // show maximized layer
    maximizedLayer.classList.remove(options.styles.maximizedLayerHiddenClassName);
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
 * @return {[type]}   [description]
 */
function maximizeClick (e) {
    e.preventDefault();
    galry.maximize(e.currentTarget);
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
    maximizedGallery = document.createElement('ul'),
    maximizedGalleryItems = [],
    maximizedLayer = document.createElement('div'),
    currentMaximizedItemId = 0,
    options = {
        styles: {
            elementsClassName: 'gal-item',
            maximizedLayerHiddenClassName: 'hidden',
            maximizedLayerClassName: 'gal-maximized-layer',
            currentMaximizedImageClassName: 'gal-current-max',
            nextMaximizedImageClassName: 'gal-next-max',
            prevMaximizedImageClassName: 'gal-prev-max'
        }
    };

/**
 * Constructor function
 * 
 * @param  {mixed}  _galleryIdentifier the DOM Node that contains the gallery or its id-string
 * @param  {object} _options           the configuration object
 * @return {Function}                    the api object
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

galry.destroy = function() {
    removeEventListeners();
    document.body.removeChild(maximizedLayer);
};

galry.getGalleryDomNode = function() {
    return galleryWrapper;
};

/**
 * Initialize the gallery
 */
function initGallery () {
    // fetch and set up gallery items
    galleryItems = galleryWrapper.getElementsByClassName(options.styles.elementsClassName);
    for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].addEventListener('click', maximizeClick, false);
        galleryItems[i].setAttribute('data-id', i);
        var item = document.createElement('li'),
            image = document.createElement('img');
        maximizedGallery.appendChild(item);
        maximizedGalleryItems.push(item);
        item.appendChild(image);
        item.classList.add(options.styles.elementsClassName);
        image.addEventListener('load', setImageMaxDimensions);
        image.src = galleryItems[i].href;
    }
    // create fullscreen layer
    maximizedLayer.classList.add(options.styles.maximizedLayerClassName);
    maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
    document.body.appendChild(maximizedLayer);
    maximizedLayer.appendChild(maximizedGallery);
    // events
    initEventListeners();
}

/**
 * Add a listener for the galry events
 * 
 * @param {string}   eventName the name of the event
 * @param {Function} callback
 */
galry.addEventListener = function(eventName, callback) {
    galleryWrapper.addEventListener(eventName, callback);
};

/**
 * Set max-width and max-height to the exact dimensions of the image
 * This function should be called through an onLoad listener on the image
 * 
 * @param {event} _event the onLoad event
 */
function setImageMaxDimensions(_event) {
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

function handleKeyDownEvents(_event) {
    if (_event.keyCode == 27) {
        galry.minimize();
    } else if (_event.keyCode == 38 || _event.keyCode == 39) {
        galry.next();
    } else if (_event.keyCode == 37 || _event.keyCode == 40) {
        galry.prev();
    }
}

function handleClickOnMaximizedLayer(_event) {
    // check if that the click did not appear on the image
    // to prevent unwanted closing
    if (_event.target.nodeName !== 'IMG') {
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
}

function removeEventListeners() {
    document.removeEventListener('keydown', handleKeyDownEvents);
    maximizedLayer.removeEventListener('DOMMouseScroll', mouseWheelMove);
    maximizedLayer.removeEventListener('mousewheel', mouseWheelMove);
    maximizedLayer.removeEventListener('click', handleClickOnMaximizedLayer);
}

return galry;
}));