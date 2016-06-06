function GmapMarker (gmap, pos) {
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

  var spot_states = { '-1': 'defected', '0': 'available', '1': 'occupied'};

  this.feature = {
      position: new google.maps.LatLng(pos.lat, pos.lng),
      state: spot_states[pos.status]
  };

  this.marker = null;
  this.addMarker = function () {
    this.marker = new google.maps.Marker({
      map: this.map,
      position: this.feature.position,
      icon: this.icons[this.feature.state].icon
    });
  };

}
