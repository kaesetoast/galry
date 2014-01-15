# galry

galry is a very simple HTML5 image gallery slider

## General Usage

Include dist/galry.min.js and dist/styles.css in your HTML document. You should have a gallery markup that looks like this:

```HTML
    <ul id="myGallery">
        <li><a href="path/to/large/image"><img src="path/to/thumbnail" alt=""></a></li>
        ...
    </ul>
```

Now you just need to call

```Javascript
galry('myGallery')
```

and you are good to go :-)

## Installation

galry can be installed via [Bower](http://bower.io) by running

    bower install galry --save-dev

Alternatively, you can just download this repo and copy the files under /dist into your project.

## License

galry is published under the [MIT License](LICENSE)