galry.thumbPanel = {};

(function() {
    var thumbPanel;
    galry.thumbPanel.init = function() {
        thumbPanel = galleryWrapper.cloneNode(true);
        // unset the id
        thumbPanel.id = '';
        thumbPanel.classList.add(options.styles.thumbPanelClassName);
        maximizedLayer.appendChild(thumbPanel);
        var thumbGalItems = thumbPanel.getElementsByClassName(options.styles.elementsClassName);
        for (var i = thumbGalItems.length - 1; i >= 0; i--) {
            thumbGalItems[i].addEventListener('click', maximizeClick, false);
        }
    };
})();
