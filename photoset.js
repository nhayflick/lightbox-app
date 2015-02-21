// Model for communicating with a Flickr Photoset API Endpoint


function PhotoSet (id) {
  this.id = id;
  this.urlBase = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=';

  this.constructFlickrURL = function () {
    return 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key='
    + API_KEY_FLICKR
    + '&photoset_id='
    + this.id
    + '&format=json&nojsoncallback=1';
  }

  this.fetch = function (callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onload = function () {
      callback(JSON.parse(xmlhttp.responseText).photoset);
    }
    xmlhttp.open('GET',this.constructFlickrURL(),true);
    xmlhttp.send();
  }
}