// Initial coordinates on which to center the map when the page is loaded.
INIT_LAT = -23.559408;
INIT_LNG = -46.7337361;
INIT_ZOOM = 18;

function createMap(){

	//Define 'class'
	function Gmap() {
	    google.maps.Map.call(this, elementMap,
	    {
	      center: {lat: INIT_LAT, lng: INIT_LNG},
	      zoom: INIT_ZOOM
	    });
	}
	
	//Prototype clone from the original object
	Gmap.prototype = Object.create(google.maps.Map.prototype);
	
	/* At this point we have a clone from the google.maps.Map object
	under the Gmap class*/

	//Gmap class methods
	Gmap.prototype.enableGeocoding = function (input) {
		var self = this;
		var geocoder = new google.maps.Geocoder();
  			input.addEventListener('submit', function(event) {
    			event.preventDefault();
				geocodeAddress(geocoder, self);
			});
	};

	Gmap.prototype.enableAutocomplete = function(input) {
	  var self = this;
	  var autocomplete = new google.maps.places.Autocomplete(input);
	  autocomplete.bindTo('bounds', map);
	  autocomplete.addListener('place_changed', function(event){
	  	placeChangedHandler(autocomplete, self);
	  });
	};
	

	//Create Gmap instance and return it
	ogmap = new Gmap({lat: INIT_LAT, lng: INIT_LNG}, elementMap, INIT_ZOOM);
	return ogmap;
}