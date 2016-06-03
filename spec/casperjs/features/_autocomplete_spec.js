/**
 * Tests whether autocomplete features of Google Places are working.
 */

exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _autocomplete_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  casper.then(function() {
    // TODO!
  });
};
