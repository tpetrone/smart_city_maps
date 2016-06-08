exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _spots_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  casper.then(function() {
    var spots = casper.evaluate(function() {
      window.map.getSpots();
      return filterMAnager.markerGroups.available[0];
    });
    test.assert(typeof(spots) === "object", "Spot request was succesfull");
  });

  casper.then(function() {
    var input1 = casper.evaluate(function() {
      $("#time-slider").prop("value",1);
      return $("#time-slider").prop("value");
    });

    var input2 = casper.evaluate(function() {
      $("#switch-1").click();
      return $("#switch-1").prop("checked");
    });

    test.assertEquals(input1, "1", "Slider is set to '1'");
    test.assertEquals(input2, true, "Switch is on");

  });

  casper.wait(5000,function(){
    casper.then(function() {
      refresh = casper.evaluate(function() {
        return window.map.refresh;
      });
    });

    casper.then(function(){
      test.assert(typeof(refresh) === "number", "Refresh is set");
    });
  });

  casper.then(function() {
    var input = casper.evaluate(function() {
      $("#switch-1").click();
      return $("#switch-1").prop("checked");
    });
    test.assertEquals(input, false, "Switch is off");
  });

  casper.wait(5000,function(){
    casper.then(function() {
      refresh = casper.evaluate(function() {
        return window.map.refresh;
      });
    });

    casper.then(function(){
      test.assert(typeof(refresh) === "boolean", "Refresh is unset");
    });
  });

};
