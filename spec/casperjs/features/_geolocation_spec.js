exports.spec = function(casper, test, other) {

  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _geolocation_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  casper.then(function() {
    var geolocation = casper.evaluate(function() {
      return window.navigator.geolocation;
    });
    test.assert(typeof(geolocation.getCurrentPosition) === "object", "Geolocation is injected");
  });

  casper.then(function() {
    var casperHelper = casper.evaluate(function() {
      return window.casperHelper;
    });
    test.assert(typeof(casperHelper) === "object", "CasperHelper is injected");
  });

  casper.then(function() {
    // Click on the location button
    casper.evaluate(function() {
      window.map.addListener('center_changed', function() {
        window.casperHelper.centerHasChanged = true;
      });
    });
    this.click('#location-button');
  });

  casper.waitFor(function check() {
    return casper.evaluate(function() {
      return window.casperHelper.centerHasChanged;
    });
  });

  casper.then(function() {
    _centerHasChanged = casper.evaluate(function() {
      return window.casperHelper.centerHasChanged;
    });

    test.assert(_centerHasChanged, "Center was updated");

    // Undo our modifications.
    casper.evaluate(function() {
      window.casperHelper.centerHasChanged = null;
    });

    // Uncomment for debugging purposes.
    // casper.capture('screenshot-casper-location.png');
  });

};
