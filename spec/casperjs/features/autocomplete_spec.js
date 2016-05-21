/**
 * Tests whether autocomplete features of Google Places are working.
 */

var fs = require('fs');

casper.test.begin('Autocomplete loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    var ac = casper.evaluate(function() {
      return window.autocomplete;
    });
    test.assertTruthy(ac, 'Autocomplete is loaded');
  });

  // Store coverage data.
  casper.then(function() {
    var coverageData = casper.evaluate(function () {
      return JSON.stringify(__coverage__);
    });
    fs.write(".istanbul/coverage/coverage_autocomplete_spec.json",
      coverageData, 'w');
  });

  casper.run(function() {
    test.done();
  });
});
