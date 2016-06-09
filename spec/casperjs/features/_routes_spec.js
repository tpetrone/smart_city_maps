exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _routes_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Click on the marker.
   */
  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(
        filterManager.markerGroups.available[1].marker, 'click');
    });
  });

  /**
   * Wait for spot information window to show up.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#map .route-btn").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Click on the route button.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("#map .route-btn").click();
    });
  });

  /**
   * Wait for routing results.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return window.directionsDisplay &&
        window.directionsDisplay.directions.status === "OK";
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Perform assertions.
   */
  casper.then(function() {
    status = casper.evaluate(function() {
      return directionsDisplay.directions.status;
    });
    test.assertEquals(status, "OK", "Route is displayed correctly");
  });

  /**
   * Click again to re-route.
   */
  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(
        filterManager.markerGroups.available[1].marker, 'click');
    });
  });

  /**
   * Wait for spot information window to show up.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#map .route-btn").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Click on the route button.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("#map .route-btn").click();
    });
  });

  /**
   * Wait for routing results.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return window.directionsDisplay &&
        window.directionsDisplay.directions.status === "OK";
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Perform assertions.
   */
  casper.then(function() {
    directions = casper.evaluate(function() {
      return directionsDisplay.directions;
    });
    test.assert(typeof(directions) === "object",
      "Displays always one route at a time");
  });
};
