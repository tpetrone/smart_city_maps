var fs = require('fs');

casper.test.begin('Test get and plot spots', 2, function suite(test) {
  casper.start('http://localhost:3000', function() {

  });

  // Store coverage data.
  casper.then(function() {
    var coverageData = casper.evaluate(function () {
      return JSON.stringify(__coverage__);
    });
    fs.write(".istanbul/coverage/coverage_get_spots_spec.json",
      coverageData, 'w');
  });

  casper.run(function() {
    test.done();
  });
});
