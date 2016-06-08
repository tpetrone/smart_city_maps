function Detail() {
  this.showInfo = function(map,marker,name){
    var contentString = '<div id="content">' +
    '<div class="header-detail"><h5>Spot Here</h5></div>' +
    '<div id="bodyContent" >'+
    '<p>' + name + '</p>' +
    '</div></div>';
    var infowindow = new google.maps.InfoWindow({content: contentString});
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  };
}
