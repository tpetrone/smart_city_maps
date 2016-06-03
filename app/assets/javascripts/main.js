function main() {

  // Create map instance
  map = new Gmap({
    map: $("#map")[0]
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

$(window).load(function() {
  setupGmapClass();
  main();
});
