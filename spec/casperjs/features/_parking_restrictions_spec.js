exports.spec = function(casper, test, other) {
  /*
   * Sets a parking restriction string for tests
   */
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _parking_restriction_spec.js", "INFO_BAR"));
    casper.evaluate(function() {
      window.pricing_restriction = "Mon-Fri | 18:00:00 to 23:59:59: $10.00";
      return window.pricing_restriction;
    });
  });

  /*
   * Extracts price from parking restriction
   */
  casper.then(function() {
     var spotPrice = casper.evaluate(function() {
       var pr = window.pricing_restriction;
       return window.getSpotPrice(pr);
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
       obj.marker.marker.visible = false;
       var pr = window.pricing_restriction;
       obj.spot.formatted_details.pricing_restrictions = [pr];
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
      window.showSpotsAboveThisPrice(oneMarker, 0.00);
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
      window.showSpotsBelowThisPrice(oneMarker, 20.00);
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
};
