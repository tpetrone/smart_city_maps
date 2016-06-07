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
  $.getJSON("/json/spots.json").done(function(data) {
    if (data.spots.length > 0) {
      for (i = 0; i < data.spots.length; i++) {
        spot = data.spots[i];
        gmarker = new GmapMarker(map, spot);
        gmarker.addMarker();

        filterManager.assignSpot(spot);
      }
    }

    var legend = document.getElementById('legend');
    for (var key in gmarker.icons) {
      var type = gmarker.icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }

  });
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
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
