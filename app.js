// Define some constants
var PHOTOSET_ID = '72157626579923453';
var API_KEY_FLICKR = '21e829380250527a8e863d4d705f3413';

// Wait for DOM to initialize - works on all modern browsers after IE8
document.addEventListener("DOMContentLoaded", function(event) { 
  var photoSet = new PhotoSet(PHOTOSET_ID);
  var photoSetData = photoSet.fetch(render);
});

function render (photoSetData) {
  var photoCollection = photoSetData.photo;
  for (var i = 0; i < photoCollection.length; i++) {
    var el = document.createElement('IMG');
    el.src = constructPhotoUrl(photoCollection[i]);
    el.className = 'my-class';
    el.dataset.id = photoCollection[i].id;
    // el.height = '100';
    // el.width = '100';
    document.getElementById('results-div').appendChild(el);
  }
}

function constructPhotoUrl(photoData) {
  return 'https://farm'
    + photoData.farm 
    + '.staticflickr.com/'
    + photoData.server
    + '/'
    + photoData.id
    + '_'
    + photoData.secret
    + '_t.jpg';
}