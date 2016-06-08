$(function () {
  // Prevent the page from reloading.
  $('#header-search').submit(function (event) {
    event.preventDefault();
  });
});

/**
 * Repositions the map when the user selects a location.
 */
function placeChangedHandler(place, map) {
  if (!hasGeometry(place)) return;

  var isCenteredByViewport = centerMapByViewport(place.geometry.viewport, map);
  if (!isCenteredByViewport) {
    centerMapByLocation(place.geometry.location, map);
  }
  var marker = createMarker(0, -29, map);
  setupMarkerIcon(place, marker);
  showInfoWindow(map, marker, place);
  showEstabSpotsOnly(place);
}

function hasGeometry(place) {
  if (!place || !place.geometry) {
    return false;
  }
  return true;
}

function centerMapByViewport(viewport, map) {
  result = false;
  try {
    map.fitBounds(viewport);
    result = true;
  } catch(err) { }
  return result;
}

function centerMapByLocation(location, map) {
  map.setCenter(location);
  map.setZoom(15);
}

function setupMarkerIcon(place, marker) {
  if (place.icon) {
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
  }
  marker.setPosition(place.geometry.location);
  marker.setVisible(true);
}

function showInfoWindow(map, marker, place) {
  var address = getAddress(place.address_components);
  var infowindow = new google.maps.InfoWindow();
  infowindow.setContent('<div><strong>' + getPlaceName(place) + '</strong><br>' + address);
  infowindow.open(map, marker);
}

function getPlaceName(place) {
  return (place.name != undefined) ? place.name : "Unnamed";
}

function getAddress(address_components) {
  var address = '';
  if (address_components) {
    address = [
      (address_components[0] && address_components[0].short_name || ''),
      (address_components[1] && address_components[1].short_name || ''),
      (address_components[2] && address_components[2].short_name || '')
    ].join(' ');
  }
  return address;
}

function createMarker(x, y, map) {
  return new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(x, y)
  });
}

function showEstabSpotsOnly(place) {
  $('#establishment-controls').hide();

  if (place.types) {
    for (i = 0; i < place.types.length; i++) {
      if (place.types[i] == "establishment") {

        $('#establishment-controls').show();
        $('#establishment-controls input').change(function () {
          filterManager.allMarkers;

          var showOther = !this.checked;

          for (var i = 0; i < filterManager.allMarkers.length; i++) {
            var obj = filterManager.allMarkers[i];
            if (showOther) {
              obj.marker.marker.setVisible(true);
            }
            else {
              console.log("Comparing " + obj.spot.google_establishment_id + " with " + place.place_id);
              if (obj.spot.google_establishment_id !== place.place_id) {
                obj.marker.marker.setVisible(false);
              }
            }
          }
        });

      }
    }
  }
}
