function Spot() {
  // TODO: add request methods when we integrate with the API.
}

Spot.STATUSES = {
  '-1': 'defected',
  '0': 'available',
  '1': 'occupied'
};

Spot.search = function(args) {
  return $.get(Rails.config.smartParkingAPI.url + "/spots/search", {
    lat: args.lat,
    lng: args.lng
  }).done(function(response) {
    console.log("done!");
  }).fail(function() {
    console.log("error");
  });
};
