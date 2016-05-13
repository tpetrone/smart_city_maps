/**
 * Example from: https://developers.google.com/maps/documentation/javascript/examples/geocoding-simple
 */

$(function () {

  function geocodeAddress(address) {
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  $("#header-search").submit(function(event) {
    var address = $("#header-search input[name=address]").val();
    geocodeAddress(address);
    event.preventDefault();
  });
});
