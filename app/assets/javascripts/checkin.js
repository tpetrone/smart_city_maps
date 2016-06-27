function Checkin(spotId, userId){
  /**
   * Enable checkin capability for a spot so the user remind where he parked
   */
  this.spotId = spotId;
  this.userId = userId;

  this.save = function(){
     Spot.checkin(this.spotId, this.userId);
  };

  $(".checkOut-btn").on('click', function() {
    console.log("you (user_id: " + user_logged_id + ") clicked the checkout button");
    Checkin.search(user_logged_id);
  });

  $(".route-checkin-btn").on('click', function() {
    console.log("you (user_id: " + user_logged_id + ") clicked trace route button");
    Checkin.search_by_user(user_logged_id);
  });
}

// do this user checkin before?
Checkin.search_by_user = function(userId) {
  return $.get(Rails.config.smartParkingAPI.url + "/checkins/search", {
      token: Rails.config.smartParkingAPI.token,
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
  return $.post(Rails.config.smartParkingAPI.url + "/checkins/"+checkinId, {
      token: Rails.config.smartParkingAPI.token,
      checkin_id: checkinId
    }).done(function(response) {
      user_checkout = response.data[0].attributes.user_id.toString();
      spot_checkout = response.data[0].attributes.spot_id.toString();
      console.log("You (user_id: "+user_checkout+") did checkout on spot_id: "+spot_checkout);
      console.log('now the spot_id: '+spot_checkout+"is available");
    }).fail(function() {
      console.log("error");
    });
};

// do this user checkin before?
Checkin.search = function(userId) {
  return $.get(Rails.config.smartParkingAPI.url + "/checkins/search", {
      token: Rails.config.smartParkingAPI.token,
      user_id: userId
    }).done(function(response) {
      checkinData = response.data[0];
      Checkin.checkout(checkinData.id);
    }).fail(function() {
      console.log("error");
    });
};
