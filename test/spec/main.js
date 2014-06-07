function setUpMarkup() {
    var galleryElement = document.createElement('ul');
    galleryElement.id = 'gallery';
    for (var i = 9; i--;) {
        var li = document.createElement('li'),
            anchor = document.createElement('a'),
            image = document.createElement('img');
        anchor.href = 'http://lorempixel.com/1024/768/cats/' + i;
        anchor.classList.add('gal-item');
        image.src = 'http://lorempixel.com/250/150/cats/' +i;
        li.appendChild(anchor);
        anchor.appendChild(image);
        galleryElement.appendChild(li);
    }
    document.body.appendChild(galleryElement);
}

describe('main - constructor tests', function() {
    var gallery;

    beforeEach(function() {
        setUpMarkup();
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    describe('test constructor', function() {

        it('should be able to create galry by id-string', function() {
            gallery = new galry('gallery');
            expect(document.getElementById('gallery')).toEqual(gallery.getGalleryDomNode());
        });

        it('should be able to create galry by DomNode', function() {
            var domNode = document.getElementById('gallery');
            gallery = new galry(domNode);
            expect(domNode).toEqual(gallery.getGalleryDomNode());
        });

    });

    describe('check overwriting of default options', function () {
        it('should be able to overwrite the maximized-layer classname', function() {
            var domNode = document.getElementById('gallery');
            gallery = new galry(domNode, {styles: {maximizedGalleryClassName: 'renamed-maximized-layer'}});
            expect(document.getElementsByClassName('renamed-maximized-layer').length).toBeGreaterThan(0);
        });
    });
});

describe('main - test the rest', function() {
    var gallery;

    beforeEach(function() {
        setUpMarkup();
        gallery = new galry('gallery');
    });

    afterEach(function() {
        gallery.destroy();
        document.body.removeChild(document.getElementById('gallery'));
    });

    describe('check creation and destruction of DOM Elements', function() {

        it('should create the maximized layer', function() {
            expect(document.getElementsByClassName('gal-maximized-layer').length).toBeGreaterThan(0);
        });

        it('should remove the maximized layer after destroy call', function() {
            gallery.destroy();
            expect(document.getElementsByClassName('gal-maximized-layer').length).toBe(0);
            // workaround to prevent afterEach to fail
            gallery = new galry('gallery');
        });

    });

    describe('check if you can have multiple instances of galry on the same site', function() {
        // set up a second galry instance
        var galleryElement = document.createElement('ul');
        galleryElement.id = 'gallery-2';
        for (var i = 9; i--;) {
            var li = document.createElement('li'),
                anchor = document.createElement('a'),
                image = document.createElement('img');
            anchor.href = 'http://lorempixel.com/1024/768/food/' + i;
            anchor.classList.add('gal-item');
            image.src = 'http://lorempixel.com/250/150/food/' +i;
            li.appendChild(anchor);
            anchor.appendChild(image);
            galleryElement.appendChild(li);
        }
        document.body.appendChild(galleryElement);
        var gallery2 = new galry('gallery-2');

        it('should address different elements for each galry instance', function(){
            expect(gallery.getGalleryDomNode()).not.toEqual(gallery2.getGalleryDomNode());
        });

        // cleanup
        gallery2.destroy();
        document.body.removeChild(galleryElement);
    });

});