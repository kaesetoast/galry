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
            maximizedGallery,
            maximizedGalleryItems,
            maximizedLayer,
            controlNext,
            controlPrev,
            currentMaximizedItemId,
            options = {
                styles: {
                    elementsClassName: 'gal-item',
                    maximizedLayerHiddenClassName: 'hidden',
                    maximizedLayerClassName: 'gal-maximized-layer',
                    currentMaximizedImageClassName: 'gal-current-max',
                    nextMaximizedImageClassName: 'gal-next-max',
                    prevMaximizedImageClassName: 'gal-prev-max',
                    controlNextClassName: 'gal-control-next',
                    controlPrevClassName: 'gal-control-prev',
                    thumbPanelClassName: 'gal-thumb-panel',
                    maximizedGalleryClassName: 'gal-maximized-gallery',
                    closeButtonClassName: 'gal-close-button',
                    topBarClassName: 'gal-top-bar'
                },
                closeButtonText: 'close',
                showThumbPanel: true,
                activteTouch: true
            },
            galry = this;

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
            if (options.showThumbPanel && typeof galry.thumbPanel !== 'undefined') {
                galry.thumbPanel.destroy();
            }
            removeEventListeners();
            document.body.removeChild(maximizedLayer);
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
            maximizedGallery = document.createElement('ul');
            maximizedGalleryItems = [];
            maximizedLayer = document.createElement('div');
            controlNext = document.createElement('a');
            controlPrev = document.createElement('a');
            currentMaximizedItemId = 0;
            // fetch and set up gallery items
            galleryItems = galleryWrapper.getElementsByClassName(options.styles.elementsClassName);
            for (var i = 0; i < galleryItems.length; i++) {
                galleryItems[i].addEventListener('click', maximizeClick, false);
                galleryItems[i].setAttribute('data-id', i);
                var item = document.createElement('li'),
                    image = document.createElement('img');
                maximizedGallery.appendChild(item);
                maximizedGallery.classList.add(options.styles.maximizedGalleryClassName);
                maximizedGalleryItems.push(item);
                item.appendChild(image);
                item.classList.add(options.styles.elementsClassName);
                image.addEventListener('load', setImageDimensions);
                image.src = galleryItems[i].href;
            }
            // create fullscreen layer
            maximizedLayer.classList.add(options.styles.maximizedLayerClassName);
            maximizedLayer.classList.add(options.styles.maximizedLayerHiddenClassName);
            document.body.appendChild(maximizedLayer);
            maximizedLayer.appendChild(maximizedGallery);
            // create control elements
            controlNext.classList.add(options.styles.controlNextClassName);
            controlPrev.classList.add(options.styles.controlPrevClassName);
            maximizedLayer.appendChild(controlNext);
            maximizedLayer.appendChild(controlPrev);
            // events
            initEventListeners();
            if (options.showThumbPanel && typeof galry.thumbPanel !== 'undefined') {
                galry.thumbPanel.init();
            }
            if (options.activteTouch && typeof galry.touch !== 'undefined') {
                galry.touch.init();
            }
            var evnt = new CustomEvent('ready');
            galleryWrapper.dispatchEvent(evnt);
        }

        /**
         * Add a listener for the galry events
         *
         * @param {string}   eventName the name of the event
         * @param {Function} callback
         */
        galry.addEventListener = function(_eventName, _callback) {
            galleryWrapper.addEventListener(_eventName, _callback);
        };

        galry.removeEventListener = function(_eventName, _callback) {
            galleryWrapper.removeEventListener(_eventName, _callback);
        };

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
         * @param  {[type]} _event The keydown event
         */
        function handleKeyDownEvents(_event) {
            if (_event.keyCode == 27) {
                galry.minimize();
            } else if (_event.keyCode == 38 || _event.keyCode == 39) {
                galry.next();
            } else if (_event.keyCode == 37 || _event.keyCode == 40) {
                galry.prev();
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

        /**
         * Initialize event listeners
         */
        function initEventListeners() {
            document.addEventListener('keydown', handleKeyDownEvents);
            maximizedLayer.addEventListener('DOMMouseScroll', mouseWheelMove);
            maximizedLayer.addEventListener('mousewheel', mouseWheelMove);
            maximizedLayer.addEventListener('click', handleClickOnMaximizedLayer);
            controlNext.addEventListener('click', galry.next);
            controlPrev.addEventListener('click', galry.prev);
        }

        /**
         * This function removes all event listeners added by this library
         * it serves as a part of the cleanup function
         *
         */
        function removeEventListeners() {
            document.removeEventListener('keydown', handleKeyDownEvents);
            maximizedLayer.removeEventListener('DOMMouseScroll', mouseWheelMove);
            maximizedLayer.removeEventListener('mousewheel', mouseWheelMove);
            maximizedLayer.removeEventListener('click', handleClickOnMaximizedLayer);
        }
        /**
         * Maximize the given item
         *
         * @param  {mixed} _item the item itself, or its id
         */
        galry.maximize = function(_item) {
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
        galry.minimize = function() {
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
        function maximizeClick(_event) {
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
        /**
         * This module displays a panel with clickable thumbnails in fullscreen mode
         */
        galry.thumbPanel = {};

        (function() {
            var thumbWrapper,
                thumbPanel,
                thumbGalItems,
                delta = 0;

            /**
             * Initialize the thumbPanel
             */
            galry.thumbPanel.init = function() {
                thumbWrapper = document.createElement('div');
                thumbPanel = galleryWrapper.cloneNode(true);
                // unset the id
                thumbPanel.id = '';
                thumbWrapper.classList.add(options.styles.thumbPanelClassName);
                maximizedLayer.appendChild(thumbWrapper);
                thumbWrapper.appendChild(thumbPanel);
                thumbGalItems = thumbPanel.getElementsByClassName(options.styles.elementsClassName);
                for (var i = thumbGalItems.length - 1; i >= 0; i--) {
                    thumbGalItems[i].addEventListener('click', maximizeClick, false);
                }
                // register eventlistener to set the current item
                galry.addEventListener('maximize', setCurrentItem);
            };

            galry.thumbPanel.destroy = function() {
                maximizedLayer.removeChild(thumbPanel);
                galry.removeEventListener('maximize', setCurrentItem);
            };

            /**
             * Set the currently maximized item
             * this function gets called by the galry maximize event
             * @param {event} _event The maximize event
             */
            function setCurrentItem(_event) {
                var maximizedItems = thumbPanel.getElementsByClassName(options.styles.currentMaximizedImageClassName),
                    currentThumbItem = thumbGalItems[_event.detail.currentMaximizedItemId];
                for (var i = maximizedItems.length - 1; i >= 0; i--) {
                    maximizedItems[i].classList.remove(options.styles.currentMaximizedImageClassName);
                }
                currentThumbItem.classList.add(options.styles.currentMaximizedImageClassName);
                console.log(currentThumbItem.offsetLeft, delta);
                if (currentThumbItem.offsetLeft + currentThumbItem.clientWidth > window.innerWidth) {
                    delta = window.innerWidth - currentThumbItem.offsetLeft - currentThumbItem.clientWidth;
                    setTransform(delta);
                } else if (currentThumbItem.offsetLeft + delta < 0) {
                    setTransform(0);
                    delta = 0;
                }
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

            var firstTouchPosition,
                topBar,
                closeButton;

            /**
             * Initialize the touch module
             */
            galry.touch.init = function() {
                if (isTouchSupported()) {
                    maximizedLayer.addEventListener('touchstart', touchstart);
                    maximizedLayer.addEventListener('touchmove', touchmove);
                    maximizedLayer.addEventListener('touchend', touchend);
                    maximizedLayer.classList.add('touch-supported');
                    initTopBar();
                    closeButton.addEventListener('click', galry.minimize);
                }
            };

            function initTopBar() {
                topBar = document.createElement('div');
                closeButton = document.createElement('a');
                closeButton.innerText = options.closeButtonText;
                closeButton.classList.add(options.styles.closeButtonClassName);
                topBar.appendChild(closeButton);
                topBar.classList.add(options.styles.topBarClassName);
                maximizedLayer.appendChild(topBar);
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
"use strict";
! function() {
    if ("function" != typeof window.getMatchedCSSRules) {
        var ELEMENT_RE = /[\w-]+/g,
            ID_RE = /#[\w-]+/g,
            CLASS_RE = /\.[\w-]+/g,
            ATTR_RE = /\[[^\]]+\]/g,
            PSEUDO_CLASSES_RE = /\:(?!not)[\w-]+(\(.*\))?/g,
            PSEUDO_ELEMENTS_RE = /\:\:?(after|before|first-letter|first-line|selection)/g,
            toArray = function(list) {
                var items = [];
                for (var i in list) items.push(list[i]);
                return items
            }, getSheetRules = function(stylesheet) {
                var sheet_media = stylesheet.media && stylesheet.media.mediaText;
                return stylesheet.disabled ? [] : sheet_media && sheet_media.length && !window.matchMedia(sheet_media).matches ? [] : toArray(stylesheet.cssRules)
            }, _find = function(string, re) {
                string.match(re);
                return re ? re.length : 0
            }, calculateScore = function(selector) {
                for (var part, match, score = [0, 0, 0], parts = selector.split(" "); part = parts.shift(), "string" == typeof part;) match = _find(part, PSEUDO_ELEMENTS_RE), score[2] = match, match && (part = part.replace(PSEUDO_ELEMENTS_RE, "")), match = _find(part, PSEUDO_CLASSES_RE), score[1] = match, match && (part = part.replace(PSEUDO_CLASSES_RE, "")), match = _find(part, ATTR_RE), score[1] += match, match && (part = part.replace(ATTR_RE, "")), match = _find(part, ID_RE), score[0] = match, match && (part = part.replace(ID_RE, "")), match = _find(part, CLASS_RE), score[1] += match, match && (part = part.replace(CLASS_RE, "")), score[2] += _find(part, ELEMENT_RE);
                return parseInt(score.join(""), 10)
            }, getSpecificityScore = function(element, selector_text) {
                for (var selector, score, selectors = selector_text.split(","), result = 0; selector = selectors.shift();)(element.mozMatchesSelector && element.mozMatchesSelector(selector) || element.msMatchesSelector && element.msMatchesSelector(selector) || element.oMatchesSelector && element.oMatchesSelector(selector) || element.webkitMatchesSelector && element.webkitMatchesSelector(selector)) && (score = calculateScore(selector), result = score > result ? score : result);
                return result
            }, sortBySpecificity = function(element, rules) {
                function compareSpecificity(a, b) {
                    return getSpecificityScore(element, b.selectorText) - getSpecificityScore(element, a.selectorText)
                }
                return rules.sort(compareSpecificity)
            };
        window.getMatchedCSSRules = function(element) {
            var style_sheets, sheet, rules, rule, result = [];
            for (style_sheets = toArray(window.document.styleSheets); sheet = style_sheets.shift();)
                for (rules = getSheetRules(sheet); rule = rules.shift();) rule.styleSheet ? rules = getSheetRules(rule.styleSheet).concat(rules) : rule.media ? rules = getSheetRules(rule).concat(rules) : (element.mozMatchesSelector && element.mozMatchesSelector(rule.selectorText) || element.msMatchesSelector && element.msMatchesSelector(rule.selectorText) || element.oMatchesSelector && element.oMatchesSelector(rule.selectorText) || element.webkitMatchesSelector && element.webkitMatchesSelector(rule.selectorText)) && result.push(rule);
            return sortBySpecificity(element, result)
        }
    }
}(),
function() {
    for (var lastTime = 0, vendors = ["webkit", "moz"], x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(callback) {
        var currTime = (new Date).getTime(),
            timeToCall = Math.max(0, 16 - (currTime - lastTime)),
            id = window.setTimeout(function() {
                callback(currTime + timeToCall)
            }, timeToCall);
        return lastTime = currTime + timeToCall, id
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(id) {
        clearTimeout(id)
    })
}(),
function(global) {
    var objectFit = {};
    objectFit._debug = !1, objectFit.observer = null, objectFit.getComputedStyle = function(element, context) {
        return context = context || window, context.getComputedStyle ? context.getComputedStyle(element, null) : element.currentStyle
    }, objectFit.getDefaultComputedStyle = function(element) {
        var newelement = element.cloneNode(!0),
            styles = {}, iframe = document.createElement("iframe");
        document.body.appendChild(iframe), iframe.contentWindow.document.open(), iframe.contentWindow.document.write("<body></body>"), iframe.contentWindow.document.body.appendChild(newelement), iframe.contentWindow.document.close();
        var defaultElement = iframe.contentWindow.document.querySelectorAll(element.nodeName.toLowerCase())[0],
            defaultComputedStyle = this.getComputedStyle(defaultElement, iframe.contentWindow);
        for (var property in defaultComputedStyle) {
            var value = defaultComputedStyle.getPropertyValue ? defaultComputedStyle.getPropertyValue(property) : defaultComputedStyle[property];
            if (null !== value) switch (property) {
                default: styles[property] = value;
                break;
                case "width":
                case "height":
                case "minWidth":
                case "minHeight":
                case "maxWidth":
                case "maxHeight":
            }
        }
        return document.body.removeChild(iframe), styles
    }, objectFit.getMatchedStyle = function(element, property) {
        var val = null,
            inlineval = null;
        element.style.getPropertyValue ? inlineval = element.style.getPropertyValue(property) : element.currentStyle && (inlineval = element.currentStyle[property]);
        var rules = window.getMatchedCSSRules(element);
        if (rules.length)
            for (var i = rules.length; i-- > 0;) {
                var r = rules[i],
                    important = r.style.getPropertyPriority(property);
                if ((null === val || important) && (val = r.style.getPropertyValue(property), important)) break
            }
        return val || null === inlineval || (val = inlineval), val
    }, objectFit.orientation = function(replacedElement) {
        if (replacedElement.parentNode && "x-object-fit" === replacedElement.parentNode.nodeName.toLowerCase()) {
            var width = replacedElement.naturalWidth || replacedElement.clientWidth,
                height = replacedElement.naturalHeight || replacedElement.clientHeight,
                parentWidth = replacedElement.parentNode.clientWidth,
                parentHeight = replacedElement.parentNode.clientHeight;
            !height || width / height > parentWidth / parentHeight ? "wider" !== replacedElement.getAttribute("data-x-object-relation") && (replacedElement.setAttribute("data-x-object-relation", "wider"), replacedElement.className = "x-object-fit-wider", this._debug && window.console && console.log("x-object-fit-wider")) : "taller" !== replacedElement.getAttribute("data-x-object-relation") && (replacedElement.setAttribute("data-x-object-relation", "taller"), replacedElement.className = "x-object-fit-taller", this._debug && window.console && console.log("x-object-fit-taller"))
        }
    }, objectFit.process = function(args) {
        if (args.selector && args.replacedElements) {
            switch (args.fittype = args.fittype || "none", args.fittype) {
                default: return;
                case "none":
                case "fill":
                case "contain":
                case "cover":
            }
            var replacedElements = args.replacedElements;
            if (replacedElements.length)
                for (var i = 0, replacedElementsLength = replacedElements.length; replacedElementsLength > i; i++) this.processElement(replacedElements[i], args)
        }
    }, objectFit.processElement = function(replacedElement, args) {
        var property, value, replacedElementStyles = objectFit.getComputedStyle(replacedElement),
            replacedElementDefaultStyles = objectFit.getDefaultComputedStyle(replacedElement),
            wrapperElement = document.createElement("x-object-fit");
        objectFit._debug && window.console && console.log("Applying to WRAPPER-------------------------------------------------------");
        for (property in replacedElementStyles) switch (property) {
            default: value = objectFit.getMatchedStyle(replacedElement, property),
            null !== value && "" !== value && (objectFit._debug && window.console && console.log(property + ": " + value), wrapperElement.style[property] = value);
            break;
            case "length":
            case "parentRule":
        }
        objectFit._debug && window.console && console.log("Applying to REPLACED ELEMENT-------------------------------------------------------");
        for (property in replacedElementDefaultStyles) switch (property) {
            default: value = replacedElementDefaultStyles[property],
            objectFit._debug && window.console && "" !== value && console.log(property + ": " + value),
            replacedElement.style[property] = value;
            break;
            case "length":
            case "parentRule":
        }
        wrapperElement.setAttribute("class", "x-object-fit-" + args.fittype), replacedElement.parentNode.insertBefore(wrapperElement, replacedElement), wrapperElement.appendChild(replacedElement), objectFit.orientation(replacedElement);
        var resizeTimer = null,
            resizeAction = function() {
                null !== resizeTimer && window.cancelAnimationFrame(resizeTimer), resizeTimer = window.requestAnimationFrame(function() {
                    objectFit.orientation(replacedElement)
                })
            };
        switch (args.fittype) {
            default: break;
            case "contain":
            case "cover":
                window.addEventListener ? (replacedElement.addEventListener("load", resizeAction, !1), window.addEventListener("resize", resizeAction, !1), window.addEventListener("orientationchange", resizeAction, !1)) : (replacedElement.attachEvent("onload", resizeAction), window.attachEvent("onresize", resizeAction))
        }
    }, objectFit.listen = function(args) {
        var domInsertedAction = function(element) {
            for (var i = 0, argsLength = args.length; argsLength > i; i++)(element.mozMatchesSelector && element.mozMatchesSelector(args[i].selector) || element.msMatchesSelector && element.msMatchesSelector(args[i].selector) || element.oMatchesSelector && element.oMatchesSelector(args[i].selector) || element.webkitMatchesSelector && element.webkitMatchesSelector(args[i].selector)) && (args[i].replacedElements = [element], objectFit.process(args[i]), objectFit._debug && window.console && console.log("Matching node inserted: " + element.nodeName))
        }, domInsertedObserverFunction = function(element) {
                objectFit.observer.disconnect(), domInsertedAction(element), objectFit.observer.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            }, domInsertedEventFunction = function(event) {
                window.removeEventListener("DOMNodeInserted", domInsertedEventFunction, !1), domInsertedAction(event.target), window.addEventListener("DOMNodeInserted", domInsertedEventFunction, !1)
            }, domRemovedAction = function(element) {
                "x-object-fit" === element.nodeName.toLowerCase() && (element.parentNode.removeChild(element), objectFit._debug && window.console && console.log("Matching node removed: " + element.nodeName))
            }, domRemovedObserverFunction = function(element) {
                objectFit.observer.disconnect(), domRemovedAction(element), objectFit.observer.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            }, domRemovedEventFunction = function(event) {
                window.removeEventListener("DOMNodeRemoved", domRemovedEventFunction, !1), domRemovedAction(event.target.parentNode), window.addEventListener("DOMNodeRemoved", domRemovedEventFunction, !1)
            };
        window.MutationObserver ? (objectFit._debug && window.console && console.log("DOM MutationObserver"), this.observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length)
                    for (var nodes = mutation.addedNodes, i = 0, nodesLength = nodes.length; nodesLength > i; i++) domInsertedObserverFunction(nodes[i]);
                mutation.removedNodes && mutation.removedNodes.length && domRemovedObserverFunction(mutation.target)
            })
        }), this.observer.observe(document.documentElement, {
            childList: !0,
            subtree: !0
        })) : window.addEventListener && (objectFit._debug && window.console && console.log("DOM Mutation Events"), window.addEventListener("DOMNodeInserted", domInsertedEventFunction, !1), window.addEventListener("DOMNodeRemoved", domRemovedEventFunction, !1))
    }, objectFit.init = function(args) {
        if (args) {
            "Array" != typeof args && (args = [args]);
            for (var i = 0, argsLength = args.length; argsLength > i; i++) args[i].replacedElements = document.querySelectorAll(args[i].selector), this.process(args[i]);
            this.listen(args)
        }
    }, objectFit.polyfill = function(args) {
        "objectFit" in document.documentElement.style == !1 ? (objectFit._debug && window.console && console.log("object-fit not natively supported"), "complete" === document.readyState ? objectFit.init(args) : window.addEventListener ? window.addEventListener("load", function() {
            objectFit.init(args)
        }, !1) : window.attachEvent("onload", function() {
            objectFit.init(args)
        })) : objectFit._debug && window.console && console.log("object-fit natively supported")
    }, global.objectFit = objectFit
}(window);
