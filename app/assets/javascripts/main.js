function main() {

  // Create map instance
  map = new Gmap({
    map: $("#map")[0]
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
    window.mapLoaded = true;
  });

  map.enableAutocomplete($('#search-field')[0]);

  $.getJSON("/json/spots.json").done(function(data) {
    if (data.spots.length > 0) {
      for (i = 0; i < data.spots.length; i++) {
        spot = data.spots[i];
        marker = new GmapMarker(map, spot);
      }
    }
  });
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
