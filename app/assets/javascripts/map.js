var map, info, infowindow, autocomplete, marker;

// Initial coordinates on which to center the map when the page is loaded.
INIT_LAT = -23.559408;
INIT_LNG = -46.7337361;
INIT_ZOOM = 18;

/**
 * Initializes the Map.
 */
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: INIT_LAT, lng: INIT_LNG},
    zoom: INIT_ZOOM
  });

  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('search-field-id'));

  autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  infowindow = new google.maps.InfoWindow();
  marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });
  autocomplete.addListener('place_changed', placeChangedHandler);
  get_spots();
}
/**
 * Re-centers the map after the user has entered a location on the
 * search box.
 */
function placeChangedHandler() {
  infowindow.close();
  marker.setVisible(false);
  var place = autocomplete.getPlace();
  if (!place.geometry) {
    window.alert("Ops! Your search returned no places.");
    return;
  }

  // If the place has a geometry, then present it on a map.
  if (place.geometry.viewport) {
    map.fitBounds(place.geometry.viewport);
  } else {
    map.setCenter(place.geometry.location);
    map.setZoom(INIT_ZOOM);
  }
  marker.setIcon(/** @type {google.maps.Icon} */({
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(35, 35)
  }));
  marker.setPosition(place.geometry.location);
  marker.setVisible(true);

  var address = '';
  if (place.address_components) {
    address = [
      (place.address_components[0] && place.address_components[0].short_name || ''),
      (place.address_components[1] && place.address_components[1].short_name || ''),
      (place.address_components[2] && place.address_components[2].short_name || '')
    ].join(' ');
  }

  infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
  infowindow.open(map, marker);
}

$(function () {
  // Prevent the page from reloading.
  $("#header-search").submit(function(event) {
     event.preventDefault();
  });
});
