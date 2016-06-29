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

  map.enableAutocomplete($('#search-field')[0]);
  map.refreshFromAPI();

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
