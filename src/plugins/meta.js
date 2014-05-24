/**
 * This module adds the ability to display meta text on images
 */
galry.meta = {};

(function() {

    'use strict';

    var metaBoxWrapper,
        metaBox,
        metaText,
        isInjected = false,
        maximizedGalleryItems,
        maximizedGalleryImages,
        currentIndex,
        pollingTimer = false;

    /**
     * initialize the meta module
     */
    galry.meta.init = function() {
        metaBoxWrapper = document.createElement('div');
        metaBox = document.createElement('div');
        metaText = document.createElement('p');
        metaBoxWrapper.appendChild(metaBox);
        metaBox.appendChild(metaText);
        metaBoxWrapper.classList.add(options.styles.metaBoxClassName);
        galry.addEventListener('changeMaximizedItem', setCurrentMetaText);
        maximizedGalleryItems = galry.lightbox.getMaximizedGalleryItems();
        maximizedGalleryImages = galry.lightbox.getMaximizedGalleryImages();
    };

    function setCurrentMetaText(_event) {
        currentIndex = _event.detail.currentItemId;
        if (isInjected) {
            var boxes = galry.lightbox.getMaximizedLayer().getElementsByClassName(options.styles.metaBoxClassName);
            for (var i = boxes.length - 1; i >= 0; i--) {
                boxes[i].parentNode.removeChild(boxes[i]);
            }
            isInjected = false;
        }
        if (galleryItems[currentIndex].hasAttribute('data-meta')) {
            setDimensions();
            metaText.innerText = galleryItems[currentIndex].getAttribute('data-meta');
            maximizedGalleryItems[currentIndex].appendChild(metaBoxWrapper);
            isInjected = true;
        }
    }

    function setDimensions() {
        if (maximizedGalleryImages[currentIndex].clientWidth === 0) {
            pollingTimer = setTimeout(setDimensions, 1);
            return;
        }
        metaBoxWrapper.style.width = maximizedGalleryImages[currentIndex].clientWidth + 'px';
        metaBoxWrapper.style.height = maximizedGalleryImages[currentIndex].clientHeight + 'px';
        metaBoxWrapper.style.marginLeft = - maximizedGalleryImages[currentIndex].clientWidth / 2 + 'px';
        metaBoxWrapper.style.marginTop = - maximizedGalleryImages[currentIndex].clientHeight / 2 + 'px';
    }

})();