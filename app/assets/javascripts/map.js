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
    setupAutocomplete(input, map);
  };

  /**
    * Method to request the spots
    * create a marker and
    * assign it to AvailabilityFilter
    */
  Gmap.prototype.refreshFromAPI = function() {
    Spot.search({
      lat: map.getCenter().lat().toString(),
      lng: map.getCenter().lng().toString()
    }).done(function (response) {

      filterManager.resetAll();

      var spots = response.data;
      for(var i = 0; i < spots.length; i++) {
        spot = spots[i].attributes;
        gmarker = new GmapMarker(map, spot);
        gmarker.addMarker(spot);
        filterManager.assignSpot(spot, gmarker);
      }
    });
  };

  /**
    * Method to toggle auto refresh
    * feature and set the refresh interval
    * according to the slider in the UI
    */
  Gmap.prototype.autoRefresh = function(switch_state, slider_value) {
    var map = this;
    if(switch_state === true){
      time = slider_value * 1000;
      clearInterval(this.refresh);
      this.refresh = setInterval(function(){
        map.refreshFromAPI();

        // TODO: Discuss if we should re-center the map on auto-refresh.
        // If so, uncomment the line below.
        // getUserLocation(map);
        }, time);
    }
    else {
      clearInterval(this.refresh);
      this.refresh = false;
    }
  };
}

function setupAutocomplete(input, map) {
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);
  autocomplete.addListener('place_changed', function (event) {
    placeChangedHandler(autocomplete.getPlace(), map);
  });
  return autocomplete;
}

/**
 * Setup event listeners.
 */
$(function () {
  $("#switch-1").click(function() {
    var _switchLabel = $("label[for=switch-1]").find(".mdl-switch__label");

    if (this.checked) {
      _switchLabel.html("ON");
      $(".slider-wrapper").show(400);
    }
    else {
      _switchLabel.html("OFF");
      $(".slider-wrapper").hide(400);
    }
  });

  $("#time-slider").on("input", function() {
    $(this).parent()
           .next(".mdl-slider__label").find("span").html(this.value + "s");
  });

  $("#switch-1, #time-slider").on('click', function(){
    var switch_state = $("#switch-1").prop('checked');
    var slider_value = $("#time-slider").prop("value");
    map.autoRefresh(switch_state, slider_value);
  });
});
