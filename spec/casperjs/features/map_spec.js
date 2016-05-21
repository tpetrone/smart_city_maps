/**
 * Tests whether the Google Map loads correctly
 */

casper.test.begin('Map loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assertTruthy(map, "Page contains the google map");
  });

  casper.run(function() {
    test.done();
  });
});
