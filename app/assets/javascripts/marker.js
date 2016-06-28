/**
 * GmapMarker: this class is used to create new markers in the map.
 */
function GmapMarker (gmap, spotData, spotId) {
  var self = this;
  this.map = gmap;

  this.addMarker = function (spotData) {
    var position = new google.maps.LatLng(spotData.attributes.latitude, spotData.attributes.longitude);
    var state = Spot.STATUSES[spotData.attributes.status.toString()];
    var _data = spotData;

    self.marker = new google.maps.Marker({
      map: this.map,
      position: position,
      icon: GmapMarker.ICONS[state].icon
    });

    var detail = new Detail();
    detail.showInfo(gmap, this.marker, _data, spotId);

    this.marker.addListener('click', function() {
      currentSpot = {
        id: spotId
      };
      Incident.spotSelectedHandler(spotId);
    });
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
