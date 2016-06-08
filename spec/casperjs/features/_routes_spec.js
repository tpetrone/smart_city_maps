exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _routes_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(filterManager.markerGroups.available[1], 'click');
    });
  });

  casper.wait(10000,function(){
    casper.then(function() {
      status = casper.evaluate(function() {
        return directionsDisplay.directions.status;
      });
      test.assertEquals(status, "OK", "Route is displayed correctly");
    });
  });

  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(filterManager.markerGroups.available[1], 'click');
    });
  });

  casper.wait(10000,function(){
    casper.then(function() {
      directions = casper.evaluate(function() {
        return directionsDisplay.directions;
      });
    test.assert(typeof(directions) === "object", "Displays always one route at a time");
    });
  });

};
