function main() {

  // Create a new AvailabilityFilter.
  filterManager = new AvailabilityFilter();

  // Create map instance
  map = new Gmap({
    map: $("#map")[0]
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    window.mapLoaded = true;
  });

  map.enableAutocomplete($('#search-field')[0]);

  Spot.search({
    lat: map.getCenter().lat().toString(),
    lng: map.getCenter().lng().toString()
  }).done(function (response) {

    var spots = response.data;

    for(var i = 0; i < spots.length; i++) {
      spot = spots[i].attributes;
      gmarker = new GmapMarker(map, spot);
      gmarker.addMarker();
      filterManager.assignSpot(spot);
    }
  });

  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(
    document.querySelector("#map-controls"));
  $("#map-controls").show();
}

function configureMapSize() {
  var viewportWidth = $(window).width();
  var viewportHeight = $(window).height();

  if (viewportWidth <= 1024) {
    $("#map").css({ height: (viewportHeight - 56) + 'px' });
  }
  else {
    $("#map").css({ height: (viewportHeight - 64) + 'px' });
  }
}

$(window).load(function() {
  configureMapSize();
  setupGmapClass();
  main();
});
