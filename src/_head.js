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
