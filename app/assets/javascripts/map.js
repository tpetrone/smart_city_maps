function Gmap(location,element,zoom) {
 this.map = new google.maps.Map(element, {
 center: {lat: location.lat, lng: location.lng},
 zoom: zoom
 });

}
