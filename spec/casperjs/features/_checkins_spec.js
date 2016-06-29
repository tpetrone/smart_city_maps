exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _checkins_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Perform checkin
   */
  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(
        filterManager.markerGroups.available[1].marker, 'click');
    });
  });

  /**
   * Wait for spot information window to show checkin button.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#map .checkIn-btn").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Perform checkin action.
   */
  casper.wait(10000, function() {
    var result = casper.evaluate(function() {
      var spot_id = 10;
      var user_id = window.user_logged_id;
      var checkin = new Checkin(spot_id, user_id);
      return checkin.save();
    });
    //var id = result.response.data;
    test.assert(typeof(result) === "object", "Checkin create was succesfull");
  });

  /**
   * Perform trace route in order to remember where I did checkin
   */
  casper.wait(20000, function() {
    var result = casper.evaluate(function() {
      var user_id = window.user_logged_id;
      return Checkin.search_by_user(user_id);
    });
    //var id = result.response.data;
    test.assert(typeof(result) === "object", "Trace route was succesfull");
  });

  /**
   * Perform checkout
   */
  casper.wait(20000, function() {
    var result = casper.evaluate(function() {
      var user_id = window.user_logged_id;
      return Checkin.search(user_id);
    });
    test.assert(typeof(result) === "object", "Checkout was succesfull");
  });
};
