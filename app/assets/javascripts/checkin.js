function Checkin(spot, userId){

  this.spotId = spot.id;
  this.userId = userId;

  this.save = function(){
     Spot.checkin(this.spotId, this.userId);
  };

  $(".checkOut-btn").on('click', function() {
    console.log("doing checkOut...");
    console.log("UserID: ");
    console.log(user_logged_id);
    Checkin.search(user_logged_id);
  });

  $(".route-checkin-btn").on('click', function() {
    //map.refreshFromAPI();
    Checkin.search_by_user(user_logged_id);
  });
}

// do this user checkin before?
Checkin.search_by_user = function(userId) {
  return $.get(Rails.config.smartParkingAPI.url + "/checkins/search", {
      token: "NwcCwWKViHsTjHaW5QGfbAtt",// Rails.config.smartParkingAPI.token,
      user_id: userId
    }).done(function(response) {
      var checkinData = response.data[0].attributes;
      Spot.search({
        lat: map.getCenter().lat().toString(),
        lng: map.getCenter().lng().toString()
      }).done(function (response) {
        var spots = response.data;
        for(var i = 0; i < spots.length; i++) {
          spot = spots[i];
          if (spot.id === checkinData.spot_id){
            Detail.currentInfoWindow.close();
            lat = spot.attributes.latitude;
            log = spot.attributes.longitude;
            var position = new google.maps.LatLng(lat, log);
            traceroute(map, position);
          }
        }
      });
    });
};

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
      checkinData = response.data[0].attributes;
      Checkin.checkout(checkinData.id);
    }).fail(function() {
      console.log("error");
    });
};



