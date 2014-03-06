/**
 * Go to the next item in line
 */
galry.next = function() {
    var nextItemId = getNextItemId(currentItemId);
    galry.goTo(galleryItems[nextItemId]);
    fireGalryEvent('nextItem', {currentItemId: nextItemId});
};

/**
 * Go to the previous item in line
 */
galry.prev = function() {
    var nextItemId = getPrevItemId(currentItemId);
    galry.goTo(galleryItems[nextItemId]);
    fireGalryEvent('prevItem', {currentItemId: nextItemId});
};

/**
 * Go to _item
 * @param  {mixed} _item Item id or the DOMNode itself
 */
galry.goTo = function(_item) {
    var newItemId,
        oldItemId = currentItemId;
    if (typeof _item === 'number') {
        newItemId = _item;
        _item = galleryItems[_item];
    } else {
        newItemId = parseInt(_item.getAttribute('data-id'), 10);
    }
    if (galleryItems.length > newItemId) {
        currentItemId = newItemId;
        setItemClassNames();
    }
    fireGalryEvent('changeItem', {
        currentItemId: currentItemId,
        oldItemId: oldItemId
    });
};

/**
 * Returns the ID of the currently maximized item
 * 
 * @return {Number} The id
 */
galry.getCurrentItemId = function() {
    return currentItemId;
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