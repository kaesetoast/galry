describe('thumbPanel', function() {
    var gallery;

    beforeEach(function() {
        setUpMarkup();
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    it('should keep itself in sync with the maxmimized items', function(){
        gallery = new galry('gallery');
        var thumbPanel = document.getElementsByClassName('gal-thumb-panel')[0];
        gallery.addEventListener('ready', function(){
            gallery.maximize(1);
            var items = thumbPanel.getElementsByClassName('gal-item');
            expect(items[1].classList.contains('gal-current-item')).toBe(true);
            gallery.next();
            expect(items[2].classList.contains('gal-current-item')).toBe(true);
            gallery.next();
            gallery.next();
            expect(items[4].classList.contains('gal-current-item')).toBe(true);
            gallery.prev();
            expect(items[3].classList.contains('gal-current-item')).toBe(true);
        });
    });

    it('should resize the images to the thumbPanels height', function() {
        gallery = new galry('gallery');
        gallery.maximize(0);
        var thumbPanel = gallery.thumbPanel.getThumbPanelDomNode(),
            referenceImage = thumbPanel.getElementsByClassName('gal-current-item')[0].getElementsByTagName('img')[0];
        // ugly, but we have to wait for dom manipulation to take place
        window.setTimeout(function(){
            expect(thumbPanel.clientHeight).toEqual(referenceImage.clientHeight);
        }, 100);
    });

});