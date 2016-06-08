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

  // Tests the creation of the autocomplete object
  casper.then(function() {
    var autocomplete = casper.evaluate(function() {
      input = $("#search-field")[0];
      return setupAutocomplete(input, window.map);
    });
    test.assert(typeof(autocomplete) === "object", "Autocomplete is created");
  });

  casper.then(function() {
    var noGeometry = casper.evaluate(function() {
      input = $("#search-field")[0];
      autocomplete = setupAutocomplete(input, window.map);
      place = autocomplete.getPlace();
      return hasGeometry(place);
    });
    test.assert(noGeometry === false, "Place without geometry");
  });

  casper.then(function() {
    casper.evaluate(function() {
      url_street = 'https://maps.googleapis.com/maps/api/geocode/json?address=abaibas&key=AIzaSyAPm6DbvAvOWQe4FUMDrPfglaCSN_Wzqt4';
      $.get(url_street).done(function(data) {
        window.my_street = data;
      });

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

      window.my_estab = establishment;

    });
  });

  casper.wait(1000, function() {
    casper.evaluate(function() {
      return window.my_street;
    });
  });

  casper.wait(1000, function() {
    casper.evaluate(function() {
      return window.my_estab;
    });
  });

  casper.then(function() {
    casper.evaluate(function() {
      window.place = window.my_street.results[0];
      return window.place;
    });
  });

  casper.then(function() {
    casper.evaluate(function() {
      window.estab = window.my_estab;
      return window.estab;
    });
  });

  casper.then(function() {
    casper.evaluate(function() {
      window.estab_str = JSON.stringify(window.estab);
      return window.estab_str;
    });
  });

  casper.then(function() {
    casper.evaluate(function() {
      window.hasGeometry(window.place);
      window.showEstabSpotsOnly(window.estab);
    });
  });

  casper.then(function() {
    var res = casper.evaluate(function() {
      window.placeChangedHandler(window.place, window.map);
      return true;
    });
    test.assert(res == true, window.estab_str);
  });
};
