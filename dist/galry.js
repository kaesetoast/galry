(function(root, factory) {
    if (typeof define === 'function' && define.amd) define(factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.galry = factory();
}(this, function() {
    'use strict';

    /**
     * Constructor function
     *
     * @param  {mixed}  _galleryIdentifier the DOM Node that contains the gallery or its id-string
     * @param  {object} _options           the configuration object
     * @return {Function}                  the api object
     */
    function galry(_galleryIdentifier, _options) {

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
        function initGallery() {
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
        /**
         * Go to the next item in line
         */
        galry.next = function() {
            var nextItemId = getNextItemId(currentItemId);
            galry.goTo(galleryItems[nextItemId]);
            fireGalryEvent('nextItem', {
                currentItemId: nextItemId
            });
        };

        /**
         * Go to the previous item in line
         */
        galry.prev = function() {
            var nextItemId = getPrevItemId(currentItemId);
            galry.goTo(galleryItems[nextItemId]);
            fireGalryEvent('prevItem', {
                currentItemId: nextItemId
            });
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
            galry.maximize = function(_item) {
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
            galry.minimize = function() {
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
            function maximizeClick(_event) {
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
                fireGalryEvent('changeMaximizedItem', {
                    currentItemId: newItemId
                });
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
                    galry.minimize();
                }
            }

        })();

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
                metaBoxWrapper.style.marginLeft = -maximizedGalleryImages[currentIndex].clientWidth / 2 + 'px';
                metaBoxWrapper.style.marginTop = -maximizedGalleryImages[currentIndex].clientHeight / 2 + 'px';
            }

        })();
        /**
         * This module displays a panel with clickable thumbnails in fullscreen mode
         */
        galry.thumbPanel = {};

        (function() {

            'use strict';

            var thumbWrapper,
                thumbPanel,
                thumbGalItems,
                delta = 0;

            /**
             * Initialize the thumbPanel
             */
            galry.thumbPanel.init = function() {
                thumbWrapper = document.createElement('div');
                // register eventlistener to set the current item
                galry.addEventListener('changeItem', setCurrentItem);
                galry.addHook(galry.GALLERY_READY_HOOK, initElements);
            };

            galry.thumbPanel.destroy = function() {
                galry.lightbox.getMaximizedLayer().removeChild(thumbWrapper);
                galry.removeEventListener('changeItem', setCurrentItem);
            };

            galry.thumbPanel.getThumbPanelDomNode = function() {
                return thumbWrapper;
            };

            function initElements() {
                thumbPanel = galleryWrapper.cloneNode(true);
                thumbPanel.className = '';
                // unset the id
                thumbPanel.id = '';
                thumbWrapper.classList.add(options.styles.thumbPanelClassName);
                galry.lightbox.getMaximizedLayer().appendChild(thumbWrapper);
                thumbWrapper.appendChild(thumbPanel);
                thumbGalItems = thumbPanel.getElementsByClassName(options.styles.elementsClassName);
                for (var i = thumbGalItems.length - 1; i >= 0; i--) {
                    thumbGalItems[i].addEventListener('click', maximizeClick, false);
                }
            }

            /**
             * Set the currently maximized item
             * this function gets called by the galry changeItem event
             * @param {event} _event The changeItem event
             */
            function setCurrentItem(_event) {
                var maximizedItems = thumbPanel.getElementsByClassName(options.styles.currentItemClassName),
                    currentThumbItem = thumbGalItems[_event.detail.currentItemId];
                for (var i = maximizedItems.length - 1; i >= 0; i--) {
                    maximizedItems[i].classList.remove(options.styles.currentItemClassName);
                }
                currentThumbItem.classList.add(options.styles.currentItemClassName);
                if (currentThumbItem.offsetLeft + currentThumbItem.clientWidth > window.innerWidth) {
                    delta = window.innerWidth - currentThumbItem.offsetLeft - currentThumbItem.clientWidth;
                    setTransform(delta);
                } else if (currentThumbItem.offsetLeft + delta < 0) {
                    setTransform(0);
                    delta = 0;
                }
            }

            /**
             * Click handler for maximizing items
             *
             * @param {event}   The click event
             */
            function maximizeClick(_event) {
                _event.preventDefault();
                galry.maximize(_event.currentTarget);
            }

            function setTransform(delta) {
                thumbPanel.style.webkitTransform = thumbPanel.style.MozTransform = thumbPanel.style.msTransform = thumbPanel.style.OTransform = thumbPanel.style.transform = 'translate(' + delta + 'px,0)';
            }

        })();

        /**
         * This module adds the ability to control the gallery via touchevents
         */
        galry.touch = {};

        (function() {

            'use strict';

            var firstTouchPosition,
                closeButton,
                maximizedLayer,
                maximizedGalleryItems;

            /**
             * Initialize the touch module
             */
            galry.touch.init = function() {
                if (isTouchSupported()) {
                    maximizedLayer = galry.lightbox.getMaximizedLayer();
                    maximizedGalleryItems = galry.lightbox.getMaximizedGalleryItems();
                    maximizedLayer.addEventListener('touchstart', touchstart);
                    maximizedLayer.addEventListener('touchmove', touchmove);
                    maximizedLayer.addEventListener('touchend', touchend);
                    maximizedLayer.classList.add('touch-supported');
                    initCloseButton();
                }
            };

            function initCloseButton() {
                closeButton = document.createElement('a');
                closeButton.innerText = options.closeButtonText;
                closeButton.classList.add(options.styles.closeButtonClassName);
                maximizedLayer.appendChild(closeButton);
                closeButton.addEventListener('click', galry.minimize);
            }

            function touchstart(_event) {
                firstTouchPosition = _event.changedTouches[0].screenX;
            }

            function touchmove(_event) {
                _event.preventDefault();
                var delta = _event.changedTouches[0].screenX - firstTouchPosition;
                maximizedGalleryItems[galry.getCurrentItemId()].style.webkitTransform = 'translate(' + delta + 'px, 0px)';
            }

            function touchend(_event) {
                maximizedGalleryItems[galry.getCurrentItemId()].style.webkitTransform = '';
                if (firstTouchPosition > _event.changedTouches[0].screenX) {
                    galry.next();
                } else {
                    galry.prev();
                }
            }

            function isTouchSupported() {
                return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
            }

        })();

        init(this);
    }
    return galry;
}));
