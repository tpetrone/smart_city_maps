/*
  This section of the code is the only way
  I found to keep track of the Modal Dialogs' state since
  Material Design Lite lib won't offer a method to do so, yet.
  source: https://github.com/angular/material/issues/5071
*/

var timeoutFlag, loaderFlag;
var answer;

function callback_housekeep(){
  clearTimeout(answer);
  dismiss_loader();
  dismiss_msg();
}

function dismiss_loader(){
  if (loaderFlag){
    loaderFlag = false;
    dialog_loader.close();
  }
}

function dismiss_msg(){
  if (timeoutFlag){
    timeoutFlag = false;
    dialog_msg.close();
  }
}

function show_loader (){
  dialog_loader.showModal();
  loaderFlag = true;
}

function show_msg(msg){
  $(".mdl-dialog__content>p").html(msg);
  dialog_msg.showModal();
  timeoutFlag = true;
}


$(function(){

  var infowindow;
  dialog_loader = document.querySelector('#dialog-loader');
  dialog_msg = document.querySelector('#dialog-msg');
  dialogButton = document.querySelector('#dialog-button');

  //Modal dialog button click handler
  dialogButton.addEventListener('click', function(event) {
    dismiss_msg();
    pos = new google.maps.LatLng(-23.5505199,-46.6333094); //São Paulo position
    map.setZoom(10);  //Set far zoom
    map.setCenter(pos);
  });

  //Success callback of getCurrentPosition(success,error,option) request
  function success(pos) {
    callback_housekeep();
    pos = new google.maps.LatLng(pos.coords.latitude,pos.coords.longitude);
    map.setCenter(pos);
    map.setZoom(15);
    if(infowindow){infowindow.setMap(null);}  //Remove old infoWindow if exists
    infowindow = new google.maps.InfoWindow({
      map: map,
      position: pos,
      content: 'You are here!'
    });
  }

  function error(err) {
    callback_housekeep();
    /*
    From the docs:
    PERMISSION_DENIED = 1;
    POSITION_UNAVAILABLE = 2;
    TIMEOUT = 3;
    */
    switch(err.code) {
      // Not authorized error handler
      case 1:
        show_msg("You must authorize the app to use this feature. Check your browser policy");
        break;
      // Unsupported error handler
      case 2:
        show_msg("This feature is not supported by your device.");
        break;
      // Request timeout error handler
      case 3:
        show_msg("The network is taking too long to return your location.");
        break;
    }
  }

  /*
  Why use a button instead of ask permission directly?
  See: https://developers.google.com/web/fundamentals/native-hardware/user-location/user-consent
  */
  $("#location-button").click(function(event) {

    //timeoutAuth >> timeoutResponse
    var timeoutAuth = 30000;
    var timeoutResponse = 5000;

    //Set authorization timeout after button click
    answer = setTimeout(function(){
      dismiss_loader();
      show_msg("You must authorize the app to use this feature.");
    }, timeoutAuth);

    var options = {
      enableHighAccuracy: false, timeout: timeoutResponse, maximumAge: 0};
      navigator.geolocation.getCurrentPosition(success, error, options);
      show_loader();
  });
});
