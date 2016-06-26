function Checkin(spot, userId){

  this.spotId = spot.id;
  this.userId = userId;

  this.save = function(){
     Spot.checkin(this.spotId, this.userId)
  };

  $(".checkOut-btn").on('click', function() {
    console.log("doing checkOut...");
    console.log("UserID: ");
    console.log(user_logged_id);
    Checkin.search(user_logged_id);
  });

  $(".route-checkin-btn").on('click', function() {
    //map.refreshFromAPI();
    Detail.currentInfoWindow.close();
    var position = new google.maps.LatLng(spot.attributes.latitude, spot.attributes.longitude);
    console.log("position");
    console.log(spot.attributes.latitude);
    console.log(spot.attributes.longitude);
    traceroute(map, position);
  });

}

Checkin.checkout = function(checkinId) {
  console.log("Entrouu no checkin.checkout");
  return $.post(Rails.config.smartParkingAPI.url + "/checkins/"+checkinId, {
      token: "NwcCwWKViHsTjHaW5QGfbAtt",// Rails.config.smartParkingAPI.token,
      checkin_id: checkinId
    }).done(function(response) {
      console.log("checkout feito");
    }).fail(function() {
      console.log("error");
    });
};

// do this user checkin before?
Checkin.search = function(userId) {
  return $.get(Rails.config.smartParkingAPI.url + "/checkins/search", {
      token: "NwcCwWKViHsTjHaW5QGfbAtt",// Rails.config.smartParkingAPI.token,
      user_id: userId
    }).done(function(response) {
      console.log(response.data[0].attributes);
      checkinData = response.data[0].attributes;
      console.log(checkinData);
      console.log(checkinData.id);
      Checkin.checkout(checkinData.id);
    }).fail(function() {
      console.log("error");
    });
};
