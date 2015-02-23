// Model class for communicating with a Flickr Photoset API Endpoint
function PhotoSet(id, apiKey) {
    // Flickr photosetId
    this.id = id;
    // Public API Key
    this.apiKey = apiKey;
    // FLICKR API endpoint
    this.urlBase = 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=';

    // Fetch the photoset and pass the results to a callback
    this.fetch = function(callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onload = function() {
            callback(JSON.parse(xmlhttp.responseText).photoset);
        }
        xmlhttp.open('GET', this.constructFlickrURL(), true);
        xmlhttp.send();
    }

    // Utility method for constructing the full API url
    this.constructFlickrURL = function() {
        return 'https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + this.apiKey + '&photoset_id=' + this.id + '&format=json&nojsoncallback=1';
    }
}