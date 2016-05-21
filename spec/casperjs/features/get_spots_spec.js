casper.test.begin('Test get and plot spots', 2, function suite(test) {
  casper.start('http://localhost:3000', function() {
    casper.wait(2000, function() {
      spot = casper.evaluate(function(){
        return spot;
      });
      spot_marker = casper.evaluate(function(){
        return spot_marker;
      });
      casper.then(function(){
        console.log("Testing request:");
        test.assertTruthy(spot, "The get call returned json results");
        console.log("Testing icon:");
        test.assertEquals(spot_marker.icon, "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png");
        console.log("The icon is correct");
      });
    });
  });

  casper.run(function() {
    test.done();
  });
});
