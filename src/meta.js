/**
 * This module adds the ability to display meta text on images
 */
galry.meta = {};

(function() {

    var metaBoxWrapper,
        metaBox,
        metaText,
        isInjected = false;

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
        galry.addEventListener('maximize', setCurrentMetaText);
    };

    function setCurrentMetaText(_event) {
        var lastIndex = _event.detail.lastMaximizedItemId,
            currentIndex = _event.detail.currentMaximizedItemId;
        if (isInjected) {
            var boxes = document.getElementsByClassName(options.styles.metaBoxClassName);
            for (var i = boxes.length - 1; i >= 0; i--) {
                boxes[i].parentNode.removeChild(boxes[i]);
            }
            isInjected = false;
        }
        if (galleryItems[currentIndex].hasAttribute('data-meta')) {
            metaText.innerText = galleryItems[currentIndex].getAttribute('data-meta');
            metaBoxWrapper.style.width = maximizedGalleryImages[currentIndex].clientWidth + 'px';
            metaBoxWrapper.style.height = maximizedGalleryImages[currentIndex].clientHeight + 'px';
            metaBoxWrapper.style.marginLeft = - maximizedGalleryImages[currentIndex].clientWidth / 2 + 'px';
            metaBoxWrapper.style.marginTop = - maximizedGalleryImages[currentIndex].clientHeight / 2 + 'px';
            maximizedGalleryItems[currentIndex].appendChild(metaBoxWrapper);
            isInjected = true;
        }
    }

})();