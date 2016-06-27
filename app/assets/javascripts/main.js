function main() {

  // Create a new AvailabilityFilter.
  filterManager = new AvailabilityFilter();

  // Create User instance
  current_user = new User();

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

  // Hide Loader and Message Modals if not Chrome (keep Login Modal)
  // REVISIT: test this in other browsers.
  if (/Chrome/i.exec(navigator.userAgent) === null) {
    $("#dialog-msg").addClass("hidden");
    $("#dialog-loader").addClass("hidden");
  }
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
  configureMapSize();
  setupGmapClass();
  setupUser();
  main();
});
