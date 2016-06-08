// Initial coordinates on which to center the map when the page is loaded.
INIT_LAT = -23.545241799982602;
INIT_LNG = -46.63861848413944;
INIT_ZOOM = 18;

/**
 * Creates a new "class" based on the google.maps.Map class.
 */
function setupGmapClass() {
  Gmap = function(options) {
    google.maps.Map.call(this, options.map, {
      center: {
        lat: INIT_LAT,
        lng: INIT_LNG
      },
      zoom: INIT_ZOOM
    });
  };

  // Make Gmap "inherit" from google.maps.Map.
  Gmap.prototype = Object.create(google.maps.Map.prototype);
  Gmap.prototype.constructor = Gmap;

  Gmap.prototype.enableAutocomplete = function(input) {
    var map = this;
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function(event){
      placeChangedHandler(autocomplete, map);
    });
  };
}
