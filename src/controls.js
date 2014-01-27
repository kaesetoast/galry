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