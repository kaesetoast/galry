(function(root, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.galry = factory();
}(this, function() {

    'use strict';

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
            },
            autoPreloading: true
        };

    function galry(_galleryIdentifier, _options) {
        galry.setOptions(_options);
        galleryWrapper = fetchGalleryElement(_galleryIdentifier);
        initGallery();
        return galry;
    }

    galry.setOptions = function(_options) {
        for (var option in _options) {
            if (options[option]) {
                options[option] = _options[option];
            }
        }
    };

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

    galry.maximize = function (_item) {
        if (typeof _item === 'number') {
            _item = galleryItems[_item];
        }
        maximizedGalleryItems[currentMaximizedItemId].classList.remove(options.styles.currentMaximizedImageClassName);
        currentMaximizedItemId = parseInt(_item.getAttribute('data-id'), 10);
        maximizedGalleryItems[currentMaximizedItemId].classList.add(options.styles.currentMaximizedImageClassName);
        maximizedLayer.classList.remove(options.styles.maximizedLayerHiddenClassName);
    };

    galry.minimize = function () {
        maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
    };

    galry.next = function() {
        var nextItem;
        if (currentMaximizedItemId + 1 >= galleryItems.length) {
            nextItem = 0;
        } else {
            nextItem = currentMaximizedItemId + 1;
        }
        galry.maximize(galleryItems[nextItem]);
        var evnt = new CustomEvent('nextItem', {
            detail: {
                currentMaximizedItemId: nextItem
            }
        });
        galleryWrapper.dispatchEvent(evnt);
    };

    galry.prev = function() {
        var nextItem;
        if (currentMaximizedItemId <= 0) {
            nextItem = galleryItems.length - 1;
        } else {
            nextItem = currentMaximizedItemId - 1;
        }
        galry.maximize(galleryItems[nextItem]);
        var evnt = new CustomEvent('prevItem', {
            detail: {
                currentMaximizedItemId: nextItem
            }
        });
        galleryWrapper.dispatchEvent(evnt);
    };

    galry.addEventListener = function(eventName, callback) {
        galleryWrapper.addEventListener(eventName, callback);
    };

    function maximizeClick (e) {
        e.preventDefault();
        galry.maximize(e.currentTarget);
    }

    function fetchGalleryElement(_galleryIdentifier) {
        if (typeof _galleryIdentifier === 'string') {
            return document.getElementById(_galleryIdentifier);
        } else if (typeof _galleryIdentifier === 'object') {
            return _galleryIdentifier;
        } else {
            throw 'Could not find the gallery element. Please provide either an id-string, or the object itself';
        }
    }

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
        document.addEventListener('mousewheel', function(e) {
            if (e.wheelDeltaY > 0) {
                galry.prev();
            } else {
                galry.next();
            }
        });
        maximizedLayer.addEventListener('click', function(e) {
            // check if click occured on the layer itself to prevent unwanted minimizing
            // when clicking on child elements
            if (e.target === maximizedLayer) {
                galry.minimize();
            }
        });
    }

    return galry;

}));