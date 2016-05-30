function main(){

//Create map instance
var gmap = new Gmap({lat: INIT_LAT, lng: INIT_LNG}, elementMap, INIT_ZOOM);
var map = gmap.map;

enableGeocoding(gmap.map,map);
enableAutocomplete(elementInput,gmap.map);


$.getJSON( "/json/spots.json", function() {})
.done(function(data) {
  if (data.spots.length > 0) {
    for (i=0; i<data.spots.length; i++) {
      spot = data.spots[i];
      marker = new GmapMarker(gmap.map,spot);
    }
  }
});

/*
Why use a button instead of ask permission directly?
See: https://developers.google.com/web/fundamentals/native-hardware/user-location/user-consent
*/
$("#location-button").click(function() {
  get_location(gmap.map);
});


}

$( window ).load(function() {
  elementInput = /** @type {!HTMLInputElement} */(
    document.getElementById('search-field-id'));
  elementMap = /** @type {!HTMLDivElement} */(
    document.getElementById('map'));
  dialogButton = document.querySelector('#dialog-button');


  main();
});

// Initial coordinates on which to center the map when the page is loaded.
INIT_LAT = -23.559408;
INIT_LNG = -46.7337361;
INIT_ZOOM = 18;


