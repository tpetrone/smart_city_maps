function GmapMarker (gmap, pos){
 this.map = gmap;
 this.position = new google.maps.LatLng(pos.lat, pos.lng);
 this.iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
 this.marker = new google.maps.Marker({
  map: this.map,
  position:this.position,
  icon: this.iconBase + 'parking_lot_maps.png'
 });
}