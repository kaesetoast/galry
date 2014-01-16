describe('controls', function() {
    var gallery,
        galleryElement;

    beforeEach(function() {
        galleryElement = document.createElement('ul');
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
        gallery = new galry(galleryElement);
    });

    it('should be able to move to next slide', function() {
        gallery.maximize(0);
        gallery.next();
        expect(gallery.getCurrentItemId()).toEqual(1);
    });
});