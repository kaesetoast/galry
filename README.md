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

Now you just need to call

```Javascript
var gallery = galry('myGallery');
```

and you are good to go :-)

## Installation

galry can be installed via [Bower](http://bower.io) by running

    bower install galry --save-dev

Alternatively, you can just download this repo and copy the files under /dist into your project.

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