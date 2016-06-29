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
