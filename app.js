// Define some constants
var PHOTOSET_ID = '72157626579923453';
var API_KEY_FLICKR = '21e829380250527a8e863d4d705f3413';

var AppController = (function () {

  var photoSetData = [];

  // Renders a Flickr PhotoSet Data Object to the DOM
  function render (data) {
    photoSetData = data;
    var photoCollection = photoSetData.photo;
    for (var i = 0; i < photoCollection.length; i++) {
      var el = document.createElement('IMG');
      el.src = constructPhotoUrl(photoCollection[i], true);
      el.className = 'my-class';
      el.dataset.id = photoCollection[i].id;
      el.dataset.index = i;
      // el.height = '100';
      // el.width = '100';
      document.getElementById('results-div').appendChild(el);
      // Set up click listener to launch lightbox
      el.addEventListener('click', function (e) {
        launchLightBox(e.target.dataset.index)
      }, false);
    }
  }

  // Launchs a fullscreen lightbox displaying an image in the photoset
  function launchLightBox(index) {
    document.getElementById('lightbox').className = 'visible';
    document.getElementById('lightbox').addEventListener('click', hideLightBox, false);
    document.getElementById('lightbox-image').src = constructPhotoUrl(photoSetData.photo[index], false);
    document.getElementById('lightbox-label').innerHTML = photoSetData.photo[index].title;
    // Prevent background scrolling
    document.body.className = 'lightbox-open';
  }

  // Hide the lightbox
  function hideLightBox() {
    document.getElementById('lightbox').className = '';
    document.body.className = '';
    // TODO: Destroy Listener
  }

  // Construct a src url for an image as a thumbnail or full image
  function constructPhotoUrl(photoData, thumbnail) {
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

    // Wait for DOM to initialize - works on all modern browsers after IE8
  document.addEventListener("DOMContentLoaded", function(event) { 
    var photoSet = new PhotoSet(PHOTOSET_ID);
    photoSet.fetch(render);
  });

})();
