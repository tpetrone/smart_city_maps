/**
 * GmapMarker: this class is used to create new markers in the map.
 */
function GmapMarker (gmap, spotData) {

  this.map = gmap;

  this.spot = {
      position: new google.maps.LatLng(spotData.latitude, spotData.longitude),
      state: Spot.STATUSES[spotData.status.toString()],
      _data: spotData
  };

  this.addMarker = function () {
    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.spot.position,
      icon: GmapMarker.ICONS[this.spot.state].icon
    });

    var detail = new Detail();
    detail.showInfo(gmap, this.marker, this.spot._data);
  };
}

GmapMarker.ICONS = {
  defected: {
    name: 'Defected',
    icon: RAILS_ASSET_URLS.images.spot_gray
  },
  available: {
    name: 'Available',
    icon: RAILS_ASSET_URLS.images.spot_green
  },
  occupied: {
    name: 'Occupied',
    icon: RAILS_ASSET_URLS.images.spot_red
  }
};
