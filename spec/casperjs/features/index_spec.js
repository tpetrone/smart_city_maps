/**
 * Simple CasperJS test.
 * Documentation: http://docs.casperjs.org/en/latest/testing.html#browser-tests
 */

var fs = require('fs');
var features = {
  autocompleteSpec: require('./_autocomplete_spec'),
  filtersSpec: require('./_filters_spec'),
  geolocationSpec: require('./_geolocation_spec'),
  incidentSpec: require('./_incident_spec'),
  routesSpec: require('./_routes_spec'),
  spotsSpec: require('./_spots_spec'),
  userSpec: require('./_user_spec'),
  parkingRestrictionsSpec: require('./_parking_restrictions_spec')
};

var utils = require('utils');
var colorizer = require('colorizer').create('Colorizer');

/**
 * Define the size of the viewport.
 */
casper.options.viewportSize = { width: 1024, height: 768 };

casper.test.begin('Start page loads correctly', 40, function suite(test) {
  var startedAt = new Date().getTime();
  casper.start('http://localhost:3011', function() {
    if (!this.page.injectJs('spec/casperjs/lib/geolocation.js')) {
      test.fail("Unable to inject geolocation.js");
    }

    if (!this.page.injectJs('spec/casperjs/lib/casper_helper.js')) {
      test.fail("Unable to inject casper_helper.js");
    }
  });

  casper.then(function() {
    test.assertTitle("SmartParkingMaps");
  });

  casper.waitFor(function check() {
    return this.evaluate(function() {
        return window.mapLoaded;
    });
  }, function then() {

    var endedAt = new Date().getTime();
    console.log("[debug] Loaded map after " + (endedAt - startedAt)/1000 + "s");

    // Uncomment for debugging purposes.
    // casper.capture('screenshot-index.png');

  }, function timeout() {
    this.echo("Map didn't load").exit();
  });

  var featuresModules = [
   'geolocationSpec',
   'autocompleteSpec',
   'spotsSpec',
   'filtersSpec',
   'routesSpec',
   'parkingRestrictionsSpec',
   'userSpec',
   'incidentSpec'
  ];

  for(var i = 0; i < featuresModules.length; i++) {
    features[featuresModules[i]].spec(casper, test, {
      utils: utils, colorizer: colorizer });
  }

  // Store coverage data.
  casper.then(function() {
    var coverageData = casper.evaluate(function () {
      return JSON.stringify(__coverage__);
    });

    if (coverageData) {
      console.log("Saving coverage data");
      fs.write(".istanbul/coverage/coverage_index_spec.json", coverageData, 'w');
    }
    else {
      console.log("[warn] Coverage data was not found.");
    }
  });

  casper.run(function() {
    test.done();
  });
});
