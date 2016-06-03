function main(){

//Create map instance
map = createMap();
map.enableGeocoding(elementForm);
map.enableAutocomplete(elementInput);


$.getJSON( "/json/spots.json", function() {})
.done(function(data) {
  if (data.spots.length > 0) {
    for (i=0; i<data.spots.length; i++) {
      spot = data.spots[i];
      marker = new GmapMarker(map,spot);
    }
  }
});


/*
Why use a button instead of ask permission directly?
See: https://developers.google.com/web/fundamentals/native-hardware/user-location/user-consent
*/
$("#location-button").click(function() {
  get_location(map);
});


}

$( window ).load(function() {
  elementInput = /** @type {!HTMLInputElement} */(
    document.getElementById('search-field-id'));
  elementMap = /** @type {!HTMLDivElement} */(
    document.getElementById('map'));  
  elementForm = /** @type {!HTMLDivElement} */(
    document.getElementById('header-search'));
  dialogButton = document.querySelector('#dialog-button');





  main();
});



