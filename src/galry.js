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

/**
 * Initialize event listeners
 */
function initEventListeners() {
    document.addEventListener('keydown', function (e) {
        if (e.keyCode == 27) {
            galry.minimize();
        } else if (e.keyCode == 38 || e.keyCode == 39) {
            galry.next();
        } else if (e.keyCode == 37 || e.keyCode == 40) {
            galry.prev();
        }
    });
    maximizedLayer.addEventListener('DOMMouseScroll', mouseWheelMove);
    maximizedLayer.addEventListener('mousewheel', mouseWheelMove);
    maximizedLayer.addEventListener('click', function(e) {
        // check if that the click did not appear on the image
        // to prevent unwanted closing
        if (e.target.nodeName !== 'IMG') {
            galry.minimize();
        }
    });
}