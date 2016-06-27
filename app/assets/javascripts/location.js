$(function () {
  /*
   * Why use a button instead of asking for permissions on page load?
   * See: https://developers.google.com/web/fundamentals/native-hardware/user-location/user-consent
   */
  $("#location-button").click(function() {
    getUserLocation(map);
  });
});

/**
 * Get the user's current location.
 */
function getUserLocation(map, callback) {

  // REVIEW: use camelCase to name variables.
  var modal_loader = new Modal(document.querySelector("#dialog-loader"));
  var modal_msg = new Modal(document.querySelector("#dialog-msg"));
  var answer;

  var AUTHORIZATION_TIMEOUT = 5000;
  var RESPONSE_TIMEOUT = 30000;

  // Set authorization timeout after button click
  answer = setTimeout(function() {
    modal_loader.hide();
    modal_msg.show("You must authorize the app to use this feature.");
  }, AUTHORIZATION_TIMEOUT);

  var options = {
    enableHighAccuracy: false,
    timeout: RESPONSE_TIMEOUT,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
  modal_loader.show();

  function handleCallback(){
    modal_loader.hide();
    clearTimeout(answer);
  }

  /*
   * Re-position the map in the user's current location.
   */
  function success(pos) {
    handleCallback();
    pos = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    map.setCenter(pos);
    map.setZoom(15);

    // Remove old infoWindow, if it exists.
    if (window.infowindow) {
      infowindow.setMap(null);
    }

    infowindow = new google.maps.InfoWindow({
      map: map,
      position: pos,
      content: 'You are here!'
    });
  }

  function error(err) {
    handleCallback();
    /*
     * From the docs:
     * PERMISSION_DENIED = 1;
     * POSITION_UNAVAILABLE = 2;
     * TIMEOUT = 3;
     */
    switch(err.code) {
      case 1:
        modal_msg.show("You must authorize the app to use geolocation.");
        break;
      case 2:
        modal_msg.show("Geolocation is not supported by your device.");
        break;
      case 3:
        modal_msg.show("The network is taking too long to return your location.");
        break;
    }
  }
}
