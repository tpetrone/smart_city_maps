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

  // Set an establishment for tests
  casper.then(function() {
    casper.evaluate(function() {
        var establishment = {
         "geometry" : {
            "location" : {
               "lat" : -23.5568137,
               "lng" : -46.73467780000001
            }
         },
         "name" : "Monumento a Ramos de Azevedo",
         "place_id" : "ChIJr4NMIxFWzpQRT-ZbW7SXmP0",
         "types" : [ "point_of_interest", "establishment" ]
      };

      window.estab = establishment;
      return window.estab;
    });
  });

  // Tests the creation of the autocomplete object
  casper.then(function() {
    var autocomplete = casper.evaluate(function() {
      input = $("#search-field")[0];
      return setupAutocomplete(input, window.map);
    });
    test.assert(typeof(autocomplete) === "object", "Autocomplete is created");
  });

  // Tests places with no geometry
  casper.then(function() {
    var noGeometry = casper.evaluate(function() {
      input = $("#search-field")[0];
      autocomplete = setupAutocomplete(input, window.map);
      place = autocomplete.getPlace();
      return hasGeometry(place);
    });
    test.assert(noGeometry === false, "Place without geometry");
  });

  // Tests places with no geometry
  casper.then(function() {
    var withGeo = casper.evaluate(function() {
      return hasGeometry(window.estab);
    });
    test.assert(withGeo === true, "Establishment has geometry");
  });

  casper.then(function() {
    casper.evaluate(function() {
      window.showEstabSpotsOnly(window.estab);
      $('#establishment-controls input').change();
    });
  });

  casper.then(function() {
    casper.evaluate(function() {
      window.placeChangedHandler(window.estab, window.map);
    });
  });
};