# galry

galry is a very simple HTML5 image gallery slider

## General Usage

Include dist/galry.min.js and dist/styles.css in your HTML document. You should have a gallery markup that looks like this:

```HTML
    <ul id="myGallery">
        <li><a class="gal-item" href="path/to/large/image"><img src="path/to/thumbnail" alt=""></a></li>
        ...
    </ul>
```
If you want to display a meta text for an image, just provide it in a data-attribute:

```HTML
    // Image with meta text
    <li><a class="gal-item" data-meta="This is a beautiful image" href="path/to/large/image"><img src="path/to/thumbnail" alt=""></a></li>
    // Image without meta text in the same gallery
    <li><a class="gal-item" href="path/to/large/image"><img src="path/to/thumbnail" alt=""></a></li>
```

Now you just need to call

```Javascript
var gallery = galry('myGallery');
```

and you are good to go :-)

![Screenshot](https://github.com/kaesetoast/galry/raw/master/screenshot-1.png)
![Screenshot](https://github.com/kaesetoast/galry/raw/master/screenshot-2.png)
![Screenshot](https://github.com/kaesetoast/galry/raw/master/screenshot-3.png)

## Installation

galry can be installed via [Bower](http://bower.io) by running

    bower install galry --save-dev

Alternatively, you can just download this repo and copy the files under /dist into your project.

## Polyfills

galry uses some techniques that are not supported by every browser out there by default. There are polyfills to
make galry work propperly. To keep the core clean, galry does not ship with theese polyfills installed, so you might consider
dropping in the following ones:

 * [classList](https://github.com/eligrey/classList.js) | IE < 10, iOS Safari < 5, Android Stock Browser < 3 | Check current status at [caniuse](http://caniuse.com/#search=classlist)

## API

**setOptions(options)**
Merge the default options object with your own to overwrite settings.
```JavaScript
gallery.setOptions({
    showThumbPanel: false
});
```

**destroy()**
Destroy the galry instance and clean up dependencies.

**getGalleryDomNode()**
Returns the gallery root node.

**addEventListener(eventName, callbackFunction)**
Subscribe to galry custom events.

**removeEventListener(eventName, callbackFunction)**
Remove Listener for galry custom events.

**maximize(item)**
Maximize the given gallery item. The argument can either be the item id or the domNode itself.
```JavaScript
// Will maximize the third item
galry.maximize(2);
---
galry.maximize(domNode);
```

**minimize()**
Minimizes the gallery.

**next()**
Moves to the next item.

**prev**
Moves to the previous item.

**getCurrentItemId()**
Returns the ID of the currently maximized item.

## License

galry is published under the [MIT License](LICENSE)