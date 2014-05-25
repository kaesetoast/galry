var galleryWrapper,
    galleryItems,
    currentItemId,
    // TODO: each module should manage its own options
    options = {
        styles: {
            elementsClassName: 'gal-item',
            maximizedLayerHiddenClassName: 'hidden',
            maximizedLayerClassName: 'gal-maximized-layer',
            currentItemClassName: 'gal-current-item',
            nextItemClassName: 'gal-next-item',
            prevItemClassName: 'gal-prev-item',
            controlNextClassName: 'gal-control-next',
            controlPrevClassName: 'gal-control-prev',
            thumbPanelClassName: 'gal-thumb-panel',
            maximizedGalleryClassName: 'gal-maximized-gallery',
            closeButtonClassName: 'gal-close-button',
            topBarClassName: 'gal-top-bar',
            metaBoxClassName: 'gal-meta-box'
        },
        closeButtonText: 'X',
        showThumbPanel: true,
        activateTouch: true,
        showMeta: true,
        lightbox: true
    },
    hooks = {},
    galry = this;

galry.GALLERY_ITEM_CREATION_HOOK = 'gallery-item-creation-hook';
galry.GALLERY_READY_HOOK = 'gallery-ready-hook';

/**
 * Bootstrap function
 */
function init() {
    galry.setOptions(_options);
    galleryWrapper = fetchGalleryElement(_galleryIdentifier);
    initGallery();
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
    if (options.lightbox && typeof galry.lightbox !== 'undefined') {
        galry.lightbox.destroy();
    }
    if (options.showThumbPanel && typeof galry.thumbPanel !== 'undefined') {
        galry.thumbPanel.destroy();
    }
    removeItemClassNames();
    removeEventListeners();
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
    currentItemId = 0;
    initModules();
    fetchGalleryItems();
    // events
    initEventListeners();
    callHooks(galry.GALLERY_READY_HOOK);
    var evnt = new CustomEvent('ready');
    galleryWrapper.dispatchEvent(evnt);
}

/**
 * Init all modules
 */
function initModules() {
    // TODO: this should be done in a more generic way.. ModuleManager?
    if (options.lightbox && galry.lightbox !== 'undefined') {
        galry.lightbox.init();
    }
    if (options.showThumbPanel && typeof galry.thumbPanel !== 'undefined') {
        galry.thumbPanel.init();
    }
    if (options.activateTouch && typeof galry.touch !== 'undefined') {
        galry.touch.init();
    }
    if (options.showMeta && typeof galry.meta !== 'undefined') {
        galry.meta.init();
    }
}

/**
 * Fetch and setup all gallery items
 */
function fetchGalleryItems() {
    galleryItems = galleryWrapper.getElementsByClassName(options.styles.elementsClassName);
    for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].setAttribute('data-id', i);
        callHooks(galry.GALLERY_ITEM_CREATION_HOOK, galleryItems[i]);
    }
    setItemClassNames();
}

/**
 * Add a listener for the galry events
 * 
 * @param {string}   _eventName the name of the event
 * @param {Function} _callback
 */
galry.addEventListener = function(_eventName, _callback) {
    galleryWrapper.addEventListener(_eventName, _callback);
};

/**
 * Remove a listener for galry events
 * @param  {String} _eventName the name of the event
 * @param  {[type]} _callback
 */
galry.removeEventListener = function(_eventName, _callback) {
    galleryWrapper.removeEventListener(_eventName, _callback);
};

/**
 * This function registers a hook for _hookName
 * @param {String}   _hookName Name of the hook
 * @param {Function} _callback The hook callback
 */
galry.addHook = function(_hookName, _callback) {
    if (typeof hooks[_hookName] === 'undefined') {
        hooks[_hookName] = [];
    }
    hooks[_hookName].push(_callback);
};

/**
 * This function calls all hooks registered on _hookName
 * @param  {String} _hookName Name of the hook
 * @param  {mixed}  _hookData Any kind of data that shall be passed to the hook function
 */
function callHooks(_hookName, _hookData) {
    var storedHooks = hooks[_hookName];
    if (typeof storedHooks !== 'undefined') {
        for (var i = storedHooks.length; i--;) {
            storedHooks[i].call(storedHooks[i], _hookData);
        }
    }
}

/**
 * This function sets classNames to indicate current, next and prev items
 */
function setItemClassNames() {
    // remove currently set classnames
    removeItemClassNames();
    galleryItems[currentItemId].classList.add(options.styles.currentItemClassName);
    galleryItems[getNextItemId(currentItemId)].classList.add(options.styles.nextItemClassName);
    galleryItems[getPrevItemId(currentItemId)].classList.add(options.styles.prevItemClassName);
}

/**
 * This function removes all classNames on galleryItems set by galry.
 */
function removeItemClassNames() {
    for (var i = galleryItems.length - 1; i >= 0; i--) {
        galleryItems[i].classList.remove(options.styles.currentItemClassName);
        galleryItems[i].classList.remove(options.styles.nextItemClassName);
        galleryItems[i].classList.remove(options.styles.prevItemClassName);
    }
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
 * @param  {event} _event The keydown event
 */
function handleKeyDownEvents(_event) {
    if (_event.keyCode == 38 || _event.keyCode == 39) {
        galry.next();
    } else if (_event.keyCode == 37 || _event.keyCode == 40) {
        galry.prev();
    }
}

/**
 * Initialize event listeners
 */
function initEventListeners() {
    document.addEventListener('keydown', handleKeyDownEvents);
}

/**
 * This function removes all event listeners added by this library
 * it serves as a part of the cleanup function
 * 
 */
function removeEventListeners() {
    document.removeEventListener('keydown', handleKeyDownEvents);
}

/**
 * This function fires a custom event on galleryWrapper
 * @param  {String} _eventName Name of the event
 * @param  {[type]} _detail    Detail Object passed to the eventlistener
 */
function fireGalryEvent(_eventName, _detail) {
    var evnt = new CustomEvent(_eventName, {
        detail: _detail
    });
    galleryWrapper.dispatchEvent(evnt);
}