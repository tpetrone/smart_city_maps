var spot;
var spot_marker;

function get_spots() {
  $.getJSON( "/json/spots.json", function() {})
  .done(function(data) {
    if (data.spots.length > 0) {
      for (i=0; i<data.spots.length; i++) {
        spot = data.spots[i];
        addMarker(spot);
      }
    }
  })
  .fail( function(d, textStatus, error) {
    console.error("getJSON failed, status: " + textStatus + ", error: "+error);
  });

  function addMarker(location) {
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var point = new google.maps.LatLng(location.lat, location.lng);
    spot_marker = new google.maps.Marker({
      position:point,
      map: map,
      icon: iconBase + 'parking_lot_maps.png'
    });
  }
}
