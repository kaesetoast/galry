(function(root, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.galry = factory();
}(this, function() {

    'use strict';

    var galleryWrapper,
        galleryItems,
        maximizedLayer = document.createElement('div'),
        maximizedImage = document.createElement('img'),
        currentMaximizedItemId = null,
        options = {
            styles: {
                elementsClassName: 'gal-item',
                maximizedLayerHiddenClassName: 'hidden',
                maximizedLayerClassName: 'gal-maximized-layer',
            }
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
        galleryItems = galleryWrapper.getElementsByClassName(options.styles.elementsClassName);
        for (var i = galleryItems.length - 1; i >= 0; i--) {
            galleryItems[i].addEventListener('click', maximizeClick, false);
            galleryItems[i].setAttribute('data-id', i);
        }
        maximizedLayer.classList.add(options.styles.maximizedLayerClassName);
        maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
        document.body.appendChild(maximizedLayer);
        maximizedImage.classList.add(options.styles.elementsClassName);
        maximizedLayer.appendChild(maximizedImage);
        initEventListeners();
    }

    galry.maximize = function (_item) {
        maximizedImage.src = _item.href;
        currentMaximizedItemId = _item.getAttribute('data-id');
        maximizedLayer.classList.remove(options.styles.maximizedLayerHiddenClassName);
    };

    galry.minimize = function () {
        currentMaximizedItemId = null;
        maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
    };

    galry.next = function() {
        if (currentMaximizedItemId !== null) {
            if (currentMaximizedItemId + 1 >= galleryItems.length) {
                currentMaximizedItemId = 0;
            } else {
                currentMaximizedItemId++;
            }
            galry.maximize(galleryItems[currentMaximizedItemId]);
        }
    };

    galry.prev = function() {
        if (currentMaximizedItemId <= 0) {
            currentMaximizedItemId = galleryItems.length - 1;
        } else {
            currentMaximizedItemId--;
        }
        galry.maximize(galleryItems[currentMaximizedItemId]);
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
    }

    return galry;

}));