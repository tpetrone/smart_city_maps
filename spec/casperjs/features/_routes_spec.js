exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _spots_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  casper.then(function() {
    spot = casper.evaluate(function() {
      window.map.getSpots();
      return filterMAnager.markerGroups.available[0];
    });
  });

  casper.then(function() {
    var spots = casper.evaluate(function() {
      window.map.getSpots();
      return filterMAnager.markerGroups.available[0];
    });
  });

};
