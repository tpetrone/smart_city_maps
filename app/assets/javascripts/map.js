$(function () {
  $("#switch-1, #time-slider").on('click', function(){
    var switch_state = $("#switch-1").prop('checked');
    var slider_value = $("#time-slider").prop("value");
    map.autoRefresh(switch_state,slider_value);
  });
});

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
    this.refresh = null;
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

  /**
    * Method to request the spots
    * create a marker and
    * assign it to AvailabilityFilter
    */
  Gmap.prototype.getSpots = function(){
    $.getJSON("/json/spots.json").done(function(data) {
      gmarker = new GmapMarker(map);
      filterManager.resetAll();
      if (data.spots.length > 0) {
        for (i = 0; i < data.spots.length; i++) {
          spot = data.spots[i];
          gmarker.addMarker(spot);
          filterManager.assignSpot(spot,gmarker.marker);
        }
      }
    });
  };

  /**
    * Method to toggle auto refresh
    * feature and set the refresh interval
    * according to the slider in the UI
    */
  Gmap.prototype.autoRefresh = function(switch_state, slider_value){
    var map = this;
    if(switch_state === true){
      time = slider_value * 1000;
      clearInterval(this.refresh);
      this.refresh = setInterval(function(){
        map.getSpots();
        /**
         * It is not clear if the location should be refreshed here.
         * UX tests must be made
         */
        getUserLocation(map);
        }, time);
    }else{
      clearInterval(this.refresh);
    }
  };

}
