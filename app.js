// Define some constants
var PHOTOSET_ID = '72157626579923453';
var API_KEY_FLICKR = '21e829380250527a8e863d4d705f3413';

function App () {

  this.photoSetData = {};
  this.photoCollection = [];
  this.currentLightboxIndex = 0;

  // Renders a Flickr PhotoSet Data Object to the DOM
  this.init = function (data) {
    var that = this;
    var thumbnailContainer = document.getElementById('thumbnail-container');
    photoSetData = data;
    this.photoCollection = photoSetData.photo;
    document.getElementById('set-label').innerHTML = photoSetData.title;
    for (var i = 0; i < this.photoCollection.length; i++) {
      var el = renderThumbnail(photo);
      thumbnailContainer.appendChild(el);
      // Set up click listener to launch lightbox
      el.addEventListener('click', function (e) {
        that.launchLightBox(parseInt(e.target.dataset.index));
      }, false);
    }
    // initialize lightbox listeners
    var nextImageButton = document.getElementById('next-image');
    var previousImageButton = document.getElementById('previous-image');
    document.getElementById('lightbox').addEventListener('click', that.hideLightBox, false);
    nextImageButton.addEventListener('click', that.nextImage.bind(that), true);
    nextImageButton.addEventListener('mouseover', that.prefetchNextImage.bind(that), true);
    previousImageButton.addEventListener('click', that.previousImage.bind(that), true);
    previousImageButton.addEventListener('mouseover', that.prefetchPreviousImage.bind(that), true);
  }

  this.renderThumbnail = function (photo) {
    var el = document.createElement('IMG');
    el.src = this.constructPhotoUrl(this.photoCollection[i], true);
    el.className = 'img-thumb';
    el.dataset.id = this.photoCollection[i].id;
    el.dataset.index = i;
    return el;
  }

  // Launchs a fullscreen lightbox displaying an image in the photoset
  this.launchLightBox = function (index) {
    var that = this;
    this.currentLightboxIndex = index;
    document.getElementById('lightbox').className = 'visible';
    this.renderLightBoxImage();
    // Prevent background scrolling
    document.body.className = 'lightbox-open';
  }

  // Calls render on the next image in the collection, looping back if necessary
  this.nextImage = function (e) {
    e.stopPropagation();
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.photoCollection.length;
    this.renderLightBoxImage();
    this.prefetchNextImage();
  }

  // Calls render on the previous image in the collection, looping back if necessary
  this.previousImage = function (e) {
    e.stopPropagation();
    this.currentLightboxIndex = this.currentLightboxIndex > 0 ? this.currentLightboxIndex - 1 : this.photoCollection.length - 1;
    this.renderLightBoxImage();
    this.prefetchPreviousImage();
  }

// Prefetch previous image and next image to improve app responsiveness
  this.prefetchNextImage = function () {
    var nextLightboxIndex = (this.currentLightboxIndex + 1) % this.photoCollection.length;
    var nextLightboxImage = document.createElement('IMG').src = this.constructPhotoUrl(photoSetData.photo[nextLightboxIndex], false);
  }
  this.prefetchPreviousImage = function () {
    var previousLightboxIndex = this.currentLightboxIndex > 0 ? this.currentLightboxIndex - 1 : this.photoCollection.length - 1;
    var previousLightboxImage = document.createElement('IMG').src = this.constructPhotoUrl(photoSetData.photo[previousLightboxIndex], false);
  }

  // Renders a selected image
  this.renderLightBoxImage = function () {
    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxLabel = document.getElementById('lightbox-label');
    lightboxImage.className = 'lightbox-image loading';
    lightboxImage.addEventListener("load", (function () {
      // Reenable navigation UI
      lightboxImage.className = 'lightbox-image';
    }).bind(this));
    lightboxLabel.innerHTML = photoSetData.photo[this.currentLightboxIndex].title;
    lightboxImage.src = this.constructPhotoUrl(photoSetData.photo[this.currentLightboxIndex], false);
  }

  // Hide the lightbox
  this.hideLightBox = function (e) {
    var lightboxEl = document.getElementById('lightbox');
    // Don't bubble event from other elements
    if (e.target.id != 'lightbox') return false;
    lightboxEl.className = '';
    document.getElementById('lightbox-image').class = 'lightbox-image';
    document.body.className = '';
    this.currentLightboxIndex = 0;
  }

  // Construct a src url for an image as a thumbnail or full image
  this.constructPhotoUrl = function (photoData, thumbnail) {
    var imageExt = thumbnail ? '_t.jpg' : '.jpg';
    return 'https://farm'
      + photoData.farm 
      + '.staticflickr.com/'
      + photoData.server
      + '/'
      + photoData.id
      + '_'
      + photoData.secret
      + imageExt;
  }
}

 // Wait for DOM to initialize - works on all modern browsers after IE8
document.addEventListener("DOMContentLoaded", function(event) { 
  var app = new App;
  var photoSet = new PhotoSet(PHOTOSET_ID);
  photoSet.fetch(app.init.bind(app));
});
