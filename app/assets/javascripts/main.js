function main() {

  // Create a new AvailabilityFilter.
  filterManager = new AvailabilityFilter();

  // Create User instance
  currentUser = new User();

  // Create map instance
  map = new Gmap({
    map: $("#map")[0]
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    window.mapLoaded = true;
  });

  /**
   * Trigger a map refresh when the center is moved (but after it has stopped
   * moving).
   */
  google.maps.event.addListener(map, 'idle', function() {
    var newCenter = new google.maps.LatLng(map.getCenter().lat(),
                                           map.getCenter().lng());

    var oldCenter, distance;

    // If this is the first time the map is idle, there will be no previous
    // center.
    if (Gmap.currentCenter) {
      oldCenter = Gmap.currentCenter;
      distance  = google.maps.geometry.spherical.computeDistanceBetween(oldCenter, newCenter);
    }

    // Update the map if needed.
    if (!Gmap.currentCenter || distance > Gmap.MIN_DISTANCE_TO_UPDATE) {
      Gmap.currentCenter = newCenter;
      map.refreshFromAPI();
    }
  });

  map.enableAutocomplete($('#search-field')[0]);

  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
    document.querySelector("#map-controls"));
  $("#map-controls").show();

  // Hide loader and message modals if not Chrome (keep Login Modal).
  if (/Chrome/i.exec(navigator.userAgent) === null) {
    $("#dialog-msg").addClass("hidden");
    $("#dialog-loader").addClass("hidden");
  }

  Checkin.init();
}

/**
 * Configure map dimensions.
 */
function configureMapSize() {
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  function updateSize(currentWidth, currentHeight) {
    if (currentWidth <= 1024) {
      $("#map").css({ height: (currentHeight - 56) + 'px' });
    }
    else {
      $("#map").css({ height: (currentHeight - 64) + 'px' });
    }
  }

  updateSize($(window).width(), $(window).height());

  $(window).resize(function() {
    updateSize($(window).width(), $(window).height());
  });
}

$(window).load(function() {
  /**
   * Setup global options for Ajax. We do this because when jToker calls
   * the validateToken() method, it needs to send the API token, otherwise
   * the validation method will fail.
   */
  $.ajaxSetup({
    data: {
      token: Rails.config.smartParkingAPI.token
    }
  });

  configureMapSize();
  setupGmapClass();
  setupUser();
  main();
});
