exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _parking_restriction_spec.js", "INFO_BAR"));
    casper.evaluate(function() {
      window.pricing_restriction = "Mon-Fri | 18:00:00 to 23:59:59: $10.00";
      return window.pricing_restriction;
    });
  });

  casper.then(function() {
     var spotPrice = casper.evaluate(function() {
       var pr = window.pricing_restriction;
       return window.getSpotPrice(pr);
     });
     test.assert(spotPrice === 10.0, "Get price from parking restriction was successfull");
  });

  casper.then(function() {
    var isVisible = casper.evaluate(function() {
      // Setup object for test
      var obj = window.filterManager.allMarkers[0];
      obj.marker.marker.setVisible(false);
      var pr = window.pricing_restriction;
      obj.formatted_details.pricing_restrictions = [pr];

      var oneMarker = [obj];
      window.showSpotsAboveThisPrice(oneMarker, 0.00);
      return obj.marker.marker.visible;
    });
    test.assert(isVisible === true, "Show spot above $0.00 was successfull");
  });
};
