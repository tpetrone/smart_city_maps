function get_location(map,callback){

    var modal = new Modal();
    var answer;
    
    var timeoutAuth = 5000;
    //Set authorization timeout after button click
    answer = setTimeout(function(){
      modal.hideLoader();
      modal.showMsg("You must authorize the app to use this feature.");
    }, timeoutAuth);


    var timeoutResponse = 30000;
    var options = {
      enableHighAccuracy: false, timeout: timeoutResponse, maximumAge: 0};
    navigator.geolocation.getCurrentPosition(success, error, options);
    
    modal.showLoader();


    function handleCallback(){
      modal.hideLoader();
      clearTimeout(answer);
    }

  //Success callback of getCurrentPosition(success,error,option) request
  function success(pos) {
    handleCallback();
    pos = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
    map.setCenter(pos);
    map.setZoom(15);
    // if(infowindow){infowindow.setMap(null);}  //Remove old infoWindow if exists
    infowindow = new google.maps.InfoWindow({
      map: map,
      position: pos,
      content: 'You are here!'
    });
  }

  function error(err) {
    handleCallback();
    /*
    From the docs:
    PERMISSION_DENIED = 1;
    POSITION_UNAVAILABLE = 2;
    TIMEOUT = 3;
    */
    switch(err.code) {
      // Not authorized error handler
      case 1:
        modal.showMsg("You must authorize the app to use this feature. Check your browser policy");
        break;
      // Unsupported error handler
      case 2:
        modal.showMsg("This feature is not supported by your device.");
        break;
      // Request timeout error handler
      case 3:
        modal.showMsg("The network is taking too long to return your location.");
        break;
    }
  }
}
