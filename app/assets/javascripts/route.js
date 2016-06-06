function traceroute(map,spot_pos){

  // Remove old route, if it exists.
  if (window.directionsDisplay) {
      directionsDisplay.setMap(null);
  }

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  navigator.geolocation.getCurrentPosition(success);


  function success(pos) {
    var user_pos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    map.setCenter(user_pos);
    map.setZoom(15);
    calculateAndDisplayRoute(directionsService, directionsDisplay,user_pos);
  }

  function calculateAndDisplayRoute(directionsService, directionsDisplay, user_pos) {
    directionsService.route({
      origin: user_pos,
      destination: spot_pos,
      travelMode: google.maps.TravelMode.DRIVING
      }, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
  }
}