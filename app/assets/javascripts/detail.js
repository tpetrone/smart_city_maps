function Detail() {
  this.showInfo = function(map, marker, info){
    var infowindow = new google.maps.InfoWindow({content: info});

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  };
}
