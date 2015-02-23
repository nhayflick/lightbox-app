var PhotosetApp = (function() {

    // Private API...

    // Define some constants
    var PHOTOSET_ID = '72157626579923453';
    var API_KEY_FLICKR = '21e829380250527a8e863d4d705f3413';

    var photoCollection = [];
    var currentLightboxIndex = -1;

    // Grab DOM elements for manipulation
    var photoSetLabel = document.getElementById('set-label');
    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxLabel = document.getElementById('lightbox-label');
    var thumbnailContainer = document.getElementById('thumbnail-container');
    var nextImageButton = document.getElementById('next-image');
    var previousImageButton = document.getElementById('previous-image');
    var lightboxContainer = document.getElementById('lightbox');

    // initialize DOM listeners
    lightboxContainer.addEventListener('click', hideLightBox, false);
    nextImageButton.addEventListener('click', nextImage, true);
    previousImageButton.addEventListener('click', previousImage, true);
    window.addEventListener('keydown', handleKeyDown, false);

    // Renders a Flickr photoset to the DOM
    function render(data) {
        photoCollection = data.photo;

        // Render photo collection title
        photoSetLabel.innerHTML = data.title;

        // Render thumbnail divs
        for (var i = 0; i < photoCollection.length; i++) {

            // Construct new div element
            var el = document.createElement('DIV');
            el.style.backgroundImage = 'url(' + constructPhotoUrl(photoCollection[i], true) + ')';
            el.className = 'img-thumb';

            // Set up click listener to launch lightbox
            (function(i) {
                el.addEventListener('click', function() {
                    launchLightBox(i);
                }, false);
            })(i);
            thumbnailContainer.appendChild(el);
        }
    }

    // Construct a src url for an image as a thumbnail or full image
    function constructPhotoUrl(photoData, thumbnail) {
        var imageExt = thumbnail ? '_t.jpg' : '.jpg';
        return 'https://farm' + photoData.farm + '.staticflickr.com/' + photoData.server + '/' + photoData.id + '_' + photoData.secret + imageExt;
    }

    // Launchs a fullscreen lightbox displaying an image in the photoset
    function launchLightBox(index) {
        currentLightboxIndex = index;
        lightboxContainer.className = 'visible';

        // Prefetch neighboring images once loaded
        lightboxImage.addEventListener('load', (function() {
            prefetchNextImage();
            prefetchPreviousImage();
            // Only call once
            lightboxImage.removeEventListener('load', arguments.callee);
        }));

        // Render the currently selected image
        renderLightBoxImage();
        // Prevent background scrolling
        document.body.className = 'lightbox-open';
    }

    // Renders a selected image
    function renderLightBoxImage() {
        lightboxLabel.innerHTML = photoCollection[currentLightboxIndex].title;
        lightboxImage.src = constructPhotoUrl(photoCollection[currentLightboxIndex], false);
    }

    // Calls render on the next image in the collection, looping back if necessary
    function nextImage(e) {
        e.stopPropagation();
        currentLightboxIndex = (currentLightboxIndex + 1) % photoCollection.length;
        renderLightBoxImage();
        prefetchNextImage();
    }

    // Calls render on the previous image in the collection, looping back if necessary
    function previousImage(e) {
        e.stopPropagation();
        currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : photoCollection.length - 1;
        renderLightBoxImage();
        prefetchPreviousImage();
    }

    // Prefetch previous image and next image to improve app responsiveness
    function prefetchNextImage() {
        var nextLightboxIndex = (currentLightboxIndex + 1) % photoCollection.length;
        var nextLightboxImage = document.createElement('IMG').src = constructPhotoUrl(photoCollection[nextLightboxIndex], false);
    }

    function prefetchPreviousImage() {
        var previousLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : photoCollection.length - 1;
        var previousLightboxImage = document.createElement('IMG').src = constructPhotoUrl(photoCollection[previousLightboxIndex], false);
    }

    // Let user swap lightbox images with arrow keys
    function handleKeyDown(e) {
        // Break out if lightbox isn't open
        if (currentLightboxIndex == -1) return false;
        // Handle Left Arrow
        if (e.which == 37) {
            previousImage(e);
            // Handle Right Arrow
        } else if (e.which == 39) {
            nextImage(e);
        }
    }

    // Hide the lightbox
    function hideLightBox(e) {
        // Don't bubble event from other elements
        if (e.target.id != 'lightbox') return false;
        // Toggle display none
        lightboxContainer.className = '';
        // Clear image when closing
        lightboxImage.removeAttribute('src');
        // Reenable scrolling
        document.body.className = '';
        // Reset lightbox index
        currentLightboxIndex = -1;
    }

    // Public API...

    return {
        // Creates a new PhotoSet model and loads the set via AJAX 
        init: function() {
            var photoSet = new PhotoSet(PHOTOSET_ID, API_KEY_FLICKR);
            photoSet.fetch(render);
        }
    }
})();

// Wait for DOM to initialize - works on all modern browsers after IE8
document.addEventListener("DOMContentLoaded", function(event) {
    // Kicks off the app
    PhotosetApp.init();
});