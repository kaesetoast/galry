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
        gallery.maximize(0);
        gallery.next();
        expect(gallery.getCurrentItemId()).toEqual(1);
    });
});