exports.spec = function(casper, test, other) {
  /*
   * Sets a pricing restriction array for tests
   */
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _parking_restriction_spec.js", "INFO_BAR"));
    casper.evaluate(function() {
      var price_rs = [
        "Mon-Fri | 18:00:00 to 23:59:59: $10.00",
        "Tue-Thu | 8:00:00 to 11:59:59: $0.00",
        "Wed | 8:00:00 to 11:59:59: $5.00",
        "Sat-Sun | 00:00:00 to 23:59:59: $5.00"
      ];
      window.pricing_restrictions = price_rs;
      return window.pricing_restrictions;
    });
  });

  /*
   * Sets a parking restriction array for tests
   */
  casper.then(function() {
    casper.evaluate(function() {
      var parking_rs = [
        "Tue-Thu | 8:00:00 to 17:59:59: unavailable",
        "Wed | 00:00:00 to 23:59:59: available"
      ];
      window.parking_restrictions = parking_rs;
      return window.parking_restrictions;
    });
  });

  /*
   * Extracts price from parking restriction
   */
  casper.then(function() {
     var spotPrice = casper.evaluate(function() {
       var prs = window.pricing_restrictions;
       return window.getSpotPrice(prs[0]);
     });
     test.assert(spotPrice === 10.0, "Get price from pricing restriction was successfull");
  });

  /*
   * Sets an object marker for tests
   */
  casper.then(function() {
     casper.evaluate(function() {
       // Setup object for test
       var obj = window.filterManager.allMarkers[0];
       var pricing_rs = window.pricing_restrictions;
       var parking_rs = window.parking_restrictions;
       obj.spot.formatted_details.pricing_restrictions = [pricing_rs[0]];
       obj.spot.formatted_details.parking_restrictions = [parking_rs[0]];
       var oneMarker = [obj];
       window.one_marker = oneMarker;
     });
  });

  /*
   * Checks if a $10.00 invisible spot becomes visible above $0.00 threshold
   */
  casper.then(function() {
    var isVisible = casper.evaluate(function() {
      var oneMarker = window.one_marker;
      oneMarker[0].marker.marker.visible = false;
      window.showSpotsAboveThisPrice(oneMarker, 0.00, null);
      return oneMarker[0].marker.marker.visible;
    });
    test.assert(isVisible === true, "Show spot above $0.00 was successful");
  });

  /*
   * Checks if a $10.00 invisible spot becomes visible below $20.00 threshold
   */
  casper.then(function() {
    var isVisible = casper.evaluate(function() {
      var oneMarker = window.one_marker;
      oneMarker[0].marker.marker.visible = false;
      window.showSpotsBelowThisPrice(oneMarker, null, 20.00);
      return oneMarker[0].marker.marker.visible;
    });
    test.assert(isVisible === true, "Show spot below $20.00 was successful");
  });

  /*
   * Checks if the spot is visible when the parking restriction is:
   * Tue-Thu | 8:00:00 to 17:59:59: unavailable
   * and the targetTime is 28/06/2016 12:00:00 (Tuesday)
   */
  casper.then(function() {
    var isVisible = casper.evaluate(function() {
      var oneMarker = window.one_marker;
      oneMarker[0].marker.marker.visible = true;
      var targetTime = new Date(2016, 5, 28, 12, 0, 0, 0);
      window.showSpotsByTimeOfOperation(oneMarker, targetTime);
      return oneMarker[0].marker.marker.visible;
    });
    test.assert(isVisible === false, "Hide unavailable spot was successful");
  });

  /*
   * Checks if the spot is visible when the parking restriction is:
   * Tue-Thu | 8:00:00 to 17:59:59: unavailable
   * and the targetTime is 27/06/2016 20:00:00 (Monday)
   */
  casper.then(function() {
    var isVisible = casper.evaluate(function() {
      var oneMarker = window.one_marker;
      oneMarker[0].marker.marker.visible = false;
      var targetTime = new Date(2016, 5, 27, 20, 0, 0, 0);
      window.showSpotsByTimeOfOperation(oneMarker, targetTime);
      return oneMarker[0].marker.marker.visible;
    });
    test.assert(isVisible === true, "Show spot outside restriction was successful");
  });

  /*
   * Checks if the spot is available when the parking restriction is:
   * Wed | 00:00:00 to 23:59:59: available
   * and the datetime is within the interval
   */
  casper.then(function() {
    var isAvailable = casper.evaluate(function() {
      var parking_rs = window.parking_restrictions;
      return window.isSpotAvailable(parking_rs[1], true);
    });
    test.assert(isAvailable === true,
      "Access to the spot with availability restriction in allowed time was successful");
  });

  /*
   * This function is here for augmenting tests coverage
   */
  casper.then(function() {
    casper.evaluate(function() {
      var parking_rs = window.parking_restrictions;
      var targetTime = new Date(2016, 5, 29, 17, 0, 0, 0);
      window.isWithinInterval(parking_rs[1], targetTime);
    });
  });

  /*
   * This function is here for augmenting tests coverage
   */
  casper.then(function() {
    casper.evaluate(function() {
      // create a change event
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);

      // Simulate a change event for max-price with a valid value
      var maxPrice = window.document.getElementById("max-price");
      maxPrice.value = 10.0;
      maxPrice.dispatchEvent(evt);

      // Simulate a change event for max-price with an invalid value
      maxPrice.value = -10.0;
      maxPrice.dispatchEvent(evt);

      // Simulate a change event for min-price with a valid value
      var minPrice = window.document.getElementById("min-price");
      minPrice.value = 10.0;
      minPrice.dispatchEvent(evt);

      // Simulate a change event for min-price with an invalid value
      minPrice.value = -10.0;
      minPrice.dispatchEvent(evt);

      // Simulate a change event for datetimepicker with a valid date
      var datetime = window.document.getElementById("datetimepicker");
      datetime.value = "06/29/2016 09:00";
      datetime.dispatchEvent(evt);

      // Simulate a change event for datetimepicker with an invalid date
      datetime.value = "";
      datetime.dispatchEvent(evt);
    });
  });
};
