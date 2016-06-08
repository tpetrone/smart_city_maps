/**
 * GmapMarker: this class is used to create new markers in the map.
 */
function GmapMarker (gmap, spotData) {

  this.map = gmap;

  this.spot = {
      position: new google.maps.LatLng(spotData.lat, spotData.lng),
      state: Spot.STATUSES[spotData.status]
  };

  this.addMarker = function () {
    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.spot.position,
      icon: GmapMarker.ICONS[this.spot.state].icon
    });

    var detail = new Detail();
    detail.showInfo(gmap, this.marker, pos.address);
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
