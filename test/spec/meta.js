describe('meta boxes', function() {
    var gallery,
        testMetaText = 'This is for awesome testing';

    beforeEach(function() {
        setUpMarkup();
        var firstItem = document.getElementById('gallery').getElementsByClassName('gal-item')[0];
        firstItem.setAttribute('data-meta', testMetaText);
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    it('should be initialized by default', function() {
        gallery = new galry('gallery', {showMeta: false});
        gallery.maximize(0);
        expect(document.getElementsByClassName('gal-meta-box').length).toBe(0);
        gallery.meta.init();
        gallery.maximize(0);
        expect(document.getElementsByClassName('gal-meta-box').length).toBe(1);
    });

    it('should contain the right text', function() {
        gallery = new galry('gallery');
        gallery.maximize(0);
        var box = document.getElementsByClassName('gal-meta-box')[0];
        expect(box.getElementsByTagName('p')[0].innerText).toEqual(testMetaText);
    });

    it('should only be displayed if a meta text is defined', function() {
        gallery = new galry('gallery');
        gallery.maximize(0);
        var box = document.getElementsByClassName('gal-meta-box')[0];
        expect(box.getElementsByTagName('p')[0].innerText).toEqual(testMetaText);
        gallery.next();
        expect(document.getElementsByClassName('gal-meta-box').length).toBe(0);
        gallery.prev();
        expect(document.getElementsByClassName('gal-meta-box').length).toBe(1);
        expect(box.getElementsByTagName('p')[0].innerText).toEqual(testMetaText);
    });

});