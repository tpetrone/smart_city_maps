function Spot() {
  // TODO: add request methods when we integrate with the API.
}

Spot.STATUSES = {
  '-1': 'defected',
  '0': 'available',
  '1': 'occupied'
};

Spot.search = function() {
  return $.get(Rails.config.smartParkingAPI.url + "/spots/search", {
    token: Rails.config.smartParkingAPI.token,
    lat: "-23.545241799982602",
    lng: "-46.63861848413944"
  }).done(function(response) {
    console.log("done!");
  }).fail(function() {
    console.log("error");
  });
};

// Set checkin to Spot for current user
Spot.checkin = function(spotId, userId) {
  return $.post(Rails.config.smartParkingAPI.url + "/checkins", {
    token: Rails.config.smartParkingAPI.token,
    spot_id: spotId,
    user_id: userId
  }).done(function(response) {
    if (response.data[0].id){
      user_checked = response.data[0].attributes.user_id.toString();
      spot_checked = response.data[0].attributes.spot_id.toString();
      console.log("You (user_id: " + user_checked+ ') did checkin on spot_id: ' + spot_checked);
    }else{
      console.log("You can not do new checkin");
      console.log(" - You have a current checkin waiting for checkout, or");
      console.log(" - Another user did checkin in the same spot");
    }      
  }).fail(function() {
      console.log("Error on save checkin in database")
  });
};
