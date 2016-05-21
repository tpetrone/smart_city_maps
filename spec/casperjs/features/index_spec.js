/**
 * Simple CasperJS test.
 * Documentation: http://docs.casperjs.org/en/latest/testing.html#browser-tests
 */

var fs = require('fs');

casper.test.begin('Start page loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    test.assertTitle("SmartParkingMaps");
  });

  // Store coverage data.
  casper.then(function() {
    var coverageData = casper.evaluate(function () {
      return JSON.stringify(__coverage__);
    });
    fs.write(".istanbul/coverage/coverage_index_spec.json", coverageData, 'w');
  });

  casper.run(function() {
    test.done();
  });
});
