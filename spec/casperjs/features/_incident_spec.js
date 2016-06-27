exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _incident_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Click on the marker.
   */
  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(
        filterManager.markerGroups.available[1].marker, 'click');
    });
  });

  /**
   * Wait for incident information.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#incident-controls").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Wait for incident results.
   */
  casper.then(function() {
    var data = casper.evaluate(function() {
      return incident.lastComment(1).response.data;
    });
    test.assert(typeof(data) === "object", "Incident request was successful");
  });

  /**
   * Click on the marker.
   */
  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(
        filterManager.markerGroups.available[1].marker, 'click');
    });
  });

  /**
   * Wait for incident information.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#incident-controls").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  casper.then(function() {
    var combobox = casper.evaluate(function() {
      $("#incident-option").prop("value","1");
      return $("#incident-option").prop("value");
    });

    var input = casper.evaluate(function() {
      $("#comment-input").prop("value","comment");
      return $("#comment-input").prop("value");
    });

    test.assertEquals(combobox, "1", "Combobox is selected");
    test.assertEquals(input, "comment", "Write some comment");

  });

  /**
   * Click on submit button.
   */
  casper.then(function() {
    casper.evaluate(function() {
      casper.click("#submit-button");
    });
  });

  /**
   * Perform assertions.
   */
  casper.then(function() {
    var data = casper.evaluate(function() {
      return incident.submitComment(1).response.data;
    });
    test.assert(typeof(data) === "object", "Report an incident and then display correctly");
  });

};
