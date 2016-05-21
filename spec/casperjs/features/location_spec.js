/**
* Location detection tests.
*/

var fs = require('fs');

casper.test.begin('Location detection', 2, function suite(test) {
  casper.start('http://localhost:3000', function() {
    var map;
    test.assertExists('#location-button');
    casper.wait(5000, function() {

      map = casper.evaluate(function(){
        document.querySelector('#location-button').click();
        return map;
      });

      casper.then(function(){
        test.assertTruthy(map, "The map has been loaded");
        casper.wait(10000, function() {
          var y = casper.evaluate(function(){
            return loaderFlag;
          });
          console.log(y);
        });
      });

    });
  });

  // Store coverage data.
  casper.then(function() {
    var coverageData = casper.evaluate(function () {
      return JSON.stringify(__coverage__);
    });
    fs.write(".istanbul/coverage/coverage_location_spec.json", coverageData, 'w');
  });

  casper.run(function() {
    test.done();
  });
});
