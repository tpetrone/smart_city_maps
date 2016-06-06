/**
 * GmapMarker: this class is used to create new markers in the map.
 */
function GmapMarker (gmap, spotData) {
  var self = this;
  this.map = gmap;
  this.iconBase = 'spot_icons/';
  this.icons = {
    defected: {
      name: 'Defected',
      icon: this.iconBase + 'spot-gray.png'
    },
    available: {
      name: 'Available',
      icon: this.iconBase + 'spot-green.png'
    },
    occupied: {
      name: 'Occupied',
      icon: this.iconBase + 'spot-red.png'
    }
  };

  this.addMarker = function (spotData) {
    var position = new google.maps.LatLng(spotData.latitude, spotData.longitude);
    var state = Spot.STATUSES[spotData.status.toString()];
    var _data = spotData;

    self.marker = new google.maps.Marker({
      map: this.map,
      position: position,
      icon: GmapMarker.ICONS[state].icon
    });

  self.marker.addListener('click', function() {
    traceroute(self.map, self.marker.position);
  });

  };

    var detail = new Detail();
    detail.showInfo(gmap, this.marker, _data);
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
