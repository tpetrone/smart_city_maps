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
    token: "NwcCwWKViHsTjHaW5QGfbAtt",// Rails.config.smartParkingAPI.token,
    lat: "-23.545241799982602",
    lng: "-46.63861848413944"
  }).done(function(response) {
    console.log("done!");
  }).fail(function() {
    console.log("error");
  });
};

Spot.checkin = function(spotId, userId) {
  return $.post(Rails.config.smartParkingAPI.url + "/checkins", {
    token: "NwcCwWKViHsTjHaW5QGfbAtt", //Rails.config.smartParkingAPI.token,
    spot_id: spotId,
    user_id: userId
  }).done(function(response) {
    console.log("saved on API!");
    console.log(response.data);
  }).fail(function() {
    console.log("error");
  });
};
