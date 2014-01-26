describe('controls', function() {
    var gallery;

    beforeEach(function() {
        setUpMarkup();
        gallery = new galry('gallery');
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    it('should be able to move to next slide', function() {
        var maximizedGallery = document.getElementsByClassName('gal-maximized-gallery'),
            slides = maximizedGallery[0].getElementsByClassName('gal-item');
        gallery.maximize(0);
        gallery.next();
        expect(gallery.getCurrentItemId()).toEqual(1);
        expect(slides[1].classList.contains('gal-current-max')).toBe(true);
    });

    it('should be able to move to the previous slide', function() {
        var maximizedGallery = document.getElementsByClassName('gal-maximized-gallery'),
            slides = maximizedGallery[0].getElementsByClassName('gal-item');
        gallery.maximize(1);
        gallery.prev();
        expect(gallery.getCurrentItemId()).toEqual(0);
        expect(slides[0].classList.contains('gal-current-max')).toBe(true);
    });

});