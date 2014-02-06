describe('thumbPanel', function() {
    var gallery;

    beforeEach(function() {
        setUpMarkup();
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    it('should not be initialized when deactivated', function() {
        gallery = new galry('gallery', {showThumbPanel: false});
        gallery.addEventListener('ready', function(){
            expect(document.getElementsByClassName('gal-thumb-panel').length).toBe(0);
        });
    });

    it('should be initialized by default', function() {
        gallery = new galry('gallery');
        gallery.addEventListener('ready', function(){
            expect(document.getElementsByClassName('gal-thumb-panel').length).toBe(1);
        });
    });

    it('should be initializable', function() {
        gallery = new galry('gallery', {showThumbPanel: false});
        gallery.thumbPanel.init();
        expect(document.getElementsByClassName('gal-thumb-panel').length).toBe(1);
    });

    it('should keep itself in sync with the maxmimized items', function(){
        gallery = new galry('gallery');
        var thumbPanel = document.getElementsByClassName('gal-thumb-panel')[0];
        gallery.addEventListener('ready', function(){
            gallery.maximize(1);
            var items = thumbPanel.getElementsByClassName('gal-item');
            expect(items[1].classList.contains('gal-current-max')).toBe(true);
            gallery.next();
            expect(items[2].classList.contains('gal-current-max')).toBe(true);
            gallery.next();
            gallery.next();
            expect(items[4].classList.contains('gal-current-max')).toBe(true);
            gallery.prev();
            expect(items[3].classList.contains('gal-current-max')).toBe(true);
        });
    });

});