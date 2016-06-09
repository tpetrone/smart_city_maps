exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _filters_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Click to hide available parking spots.
   */
  casper.then(function() {
    casper.click(".checkbox-filter[data-status=available]");

    var _checkbox_status = casper.evaluate(function() {
      return $(".checkbox-filter[data-status=available]")[0].checked;
    });

    test.assert(_checkbox_status === false, "Checkbox was unselected");
  });

  /**
   * Click again to show the hidden spots.
   */
  casper.then(function() {
    casper.click(".checkbox-filter[data-status=available]");

    var _checkbox_status = casper.evaluate(function() {
      return $(".checkbox-filter[data-status=available]")[0].checked;
    });

    test.assert(_checkbox_status === true, "Checkbox was re-selected");
  });
};
