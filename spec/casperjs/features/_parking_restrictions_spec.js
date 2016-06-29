exports.spec = function(casper, test, other) {
  /*
   * Sets a parking restriction string for tests
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

  casper.then(function() {
    casper.evaluate(function() {
      var parking_rs = [
        "Mon-Fri | 8:00:00 to 17:59:59: unavailable",
        "Sun | 00:00:00 to 23:59:59: available"
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
     test.assert(spotPrice === 10.0, "Get price from parking restriction was successfull");
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
   * This function is needed for improving test coverage
   */
  casper.then(function() {
    casper.evaluate(function() {
      // create a change event
      var evt = document.createEvent("HTMLEvents");
      evt.initEvent("change", false, true);

      // Simulate a change event for  max-price
      window.document.getElementById("max-price").value = 10.0;
      window.document.getElementById("max-price").dispatchEvent(evt);

      // Simulate a change event for  min-price
      window.document.getElementById("min-price").value = 10.0;
      window.document.getElementById("min-price").dispatchEvent(evt);
    });
  });

  casper.then(function() {
    var isVisible = casper.evaluate(function() {
      var oneMarker = window.one_marker;
      oneMarker[0].marker.marker.visible = true;
      var targetTime = new Date(2016, 5, 27, 12, 0, 0, 0); //27/06/2016 12:00:00
      window.showSpotsByTimeOfOperation(oneMarker, targetTime);
      return oneMarker[0].marker.marker.visible;
    });
    test.assert(isVisible === false, "Restrict unavailable spot was successful");
  });
};
