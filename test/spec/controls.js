describe('controls', function() {
    var gallery,
        maximizedGallery,
        slides;

    beforeEach(function() {
        setUpMarkup();
        gallery = new galry('gallery');
        maximizedGallery = document.getElementsByClassName('gal-maximized-gallery');
        slides = maximizedGallery[0].getElementsByClassName('gal-item');
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    it('should be able to maximize a gallery item', function() {
        gallery.maximize(0);
        expect(slides[0].classList.contains('gal-current-item'));
        gallery.maximize(4);
        expect(slides[4].classList.contains('gal-current-item'));
    });

    it('should be able to minimize a maximized gallery item', function() {
        expect(maximizedGallery[0].getElementsByClassName('gal-current-item').length).toBe(0);
        gallery.maximize(3);
        var maximizedLayer = document.getElementsByClassName('gal-maximized-layer')[0];
        expect(maximizedLayer.classList.contains('hidden')).toBe(false);
        expect(slides[3].classList.contains('gal-current-item')).toBe(true);
        gallery.minimize();
        expect(maximizedLayer.classList.contains('hidden')).toBe(true);
    });

    it('should be able to move to next slide', function() {
        gallery.maximize(0);
        gallery.next();
        expect(gallery.getCurrentItemId()).toEqual(1);
        expect(slides[1].classList.contains('gal-current-item')).toBe(true);
    });

    it('should be able to move to the previous slide', function() {
        gallery.maximize(1);
        gallery.prev();
        expect(gallery.getCurrentItemId()).toEqual(0);
        expect(slides[0].classList.contains('gal-current-item')).toBe(true);
    });

    it('should be able to return the current slide number', function(){
        gallery.maximize(4);
        expect(gallery.getCurrentItemId()).toBe(4);
    });

});