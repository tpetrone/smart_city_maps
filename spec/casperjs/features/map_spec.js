/**
 * Tests whether the Google Map loads correctly
 */

var fs = require('fs');

casper.test.begin('Map loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assertTruthy(map, "Page contains the google map");
  });

  // Store coverage data.
  casper.then(function() {
    var coverageData = casper.evaluate(function () {
      return JSON.stringify(__coverage__);
    });
    fs.write(".istanbul/coverage/coverage_map_spec.json", coverageData, 'w');
  });

  casper.run(function() {
    test.done();
  });
});
