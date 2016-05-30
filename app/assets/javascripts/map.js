function Gmap() {
    google.maps.Map.call(this, elementMap,
    {
      center: {lat: INIT_LAT, lng: INIT_LNG},
      zoom: INIT_ZOOM
    }); 
}

MyMap.prototype = Object.create(google.maps.Map.prototype);
