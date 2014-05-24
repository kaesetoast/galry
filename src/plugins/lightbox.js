/**
 * This module adds the ability to display images in an maximized lightbox
 */
galry.lightbox = {};

(function() {

    'use strict';

    var maximizedGallery,
        maximizedGalleryItems,
        maximizedGalleryImages,
        maximizedLayer,
        maximizedControlNext,
        maximizedControlPrev;

    /**
     * initialize the lightbox module
     */
    galry.lightbox.init = function() {
        maximizedGallery = document.createElement('ul');
        maximizedGalleryItems = [];
        maximizedGalleryImages = [];
        // create fullscreen layer
        maximizedLayer = document.createElement('div');
        maximizedLayer.classList.add(options.styles.maximizedLayerClassName);
        maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
        document.body.appendChild(maximizedLayer);
        maximizedLayer.appendChild(maximizedGallery);
        // create control elements
        maximizedControlNext = document.createElement('a');
        maximizedControlPrev = document.createElement('a');
        maximizedControlNext.classList.add(options.styles.controlNextClassName);
        maximizedControlPrev.classList.add(options.styles.controlPrevClassName);
        maximizedLayer.appendChild(maximizedControlNext);
        maximizedLayer.appendChild(maximizedControlPrev);
        galry.addHook(galry.GALLERY_ITEM_CREATION_HOOK, itemCreationHook);
        addEventListeners();
    };

    galry.lightbox.destroy = function() {
        document.body.removeChild(maximizedLayer);
        removeEventListeners();
    };

    galry.lightbox.getMaximizedLayer = function() {
        return maximizedLayer;
    };

    galry.lightbox.getMaximizedGalleryItems = function() {
        return maximizedGalleryItems;
    };

    galry.lightbox.getMaximizedGalleryImages = function() {
        return maximizedGalleryImages;
    };

    /**
     * Maximize the given item
     * 
     * @param  {mixed} _item the item itself, or its id
     */
    galry.maximize = function (_item) {
        if (typeof _item === 'number') {
            _item = galleryItems[_item];
        }
        var newItemId = parseInt(_item.getAttribute('data-id'), 10);
        galry.goTo(newItemId);
        // show maximized layer
        maximizedLayer.classList.remove(options.styles.maximizedLayerHiddenClassName);
        var currentImage = maximizedGalleryImages[currentItemId];
        var maxWidth = window.innerWidth * 0.9;
        if (currentImage.clientWidth > maxWidth) {
            var ratio = currentImage.width / currentImage.height;
            currentImage.style.width = maxWidth + 'px';
            currentImage.style.height = maxWidth / ratio + 'px';
        }
        fireGalryEvent('maximize', {
            currentItemId: currentItemId
        });
    };

    /**
     * Minimize the gallery
     */
    galry.minimize = function () {
        maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
    };

    function itemCreationHook(_item) {
        createMaximizedItem(_item);
        _item.addEventListener('click', maximizeClick, false);
    }

    function createMaximizedItem(_item) {
        var item = document.createElement('li'),
            image = document.createElement('img');
        maximizedGallery.appendChild(item);
        maximizedGallery.classList.add(options.styles.maximizedGalleryClassName);
        maximizedGalleryItems.push(item);
        maximizedGalleryImages.push(image);
        item.appendChild(image);
        item.classList.add(options.styles.elementsClassName);
        image.addEventListener('load', setImageDimensions);
        image.src = _item.href;
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

    function handleChangeItem(_event) {
        var oldItemId = _event.detail.oldItemId,
            newItemId = _event.detail.currentItemId;
        // remove old classNames
        maximizedGalleryItems[oldItemId].classList.remove(options.styles.currentItemClassName);
        maximizedGalleryItems[getNextItemId(oldItemId)].classList.remove(options.styles.nextItemClassName);
        maximizedGalleryItems[getPrevItemId(oldItemId)].classList.remove(options.styles.prevItemClassName);
        // set new classNames
        maximizedGalleryItems[newItemId].classList.add(options.styles.currentItemClassName);
        maximizedGalleryItems[getNextItemId(newItemId)].classList.add(options.styles.nextItemClassName);
        maximizedGalleryItems[getPrevItemId(newItemId)].classList.add(options.styles.prevItemClassName);
        fireGalryEvent('changeMaximizedItem', {currentItemId: newItemId});
    }

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

    function addEventListeners() {
        galry.addEventListener('changeItem', handleChangeItem);
        document.addEventListener('keydown', handleKeyDown);
        maximizedLayer.addEventListener('DOMMouseScroll', mouseWheelMove);
        maximizedLayer.addEventListener('mousewheel', mouseWheelMove);
        maximizedLayer.addEventListener('click', handleClickOnMaximizedLayer);
        maximizedControlNext.addEventListener('click', galry.next);
        maximizedControlPrev.addEventListener('click', galry.prev);
    }

    function removeEventListeners() {
        galry.removeEventListener('changeItem', handleChangeItem);
        for (var i = galleryItems.length - 1; i >= 0; i--) {
            galleryItems[i].removeEventListener('click', maximizeClick);
        }
        document.removeEventListener('keydown', handleKeyDown);
        maximizedLayer.removeEventListener('DOMMouseScroll', mouseWheelMove);
        maximizedLayer.removeEventListener('mousewheel', mouseWheelMove);
        maximizedLayer.removeEventListener('click', handleClickOnMaximizedLayer);
    }

    function handleKeyDown(_event) {
        if (_event.keyCode === 27) {
            galry.minimize();
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
            console.log(_event.target);
            galry.minimize();
        }
    }

})();
