/**
 * Simple CasperJS test.
 * Documentation: http://docs.casperjs.org/en/latest/testing.html#browser-tests
 */

casper.test.begin('Start page loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    test.assertTitle("SmartParkingMaps");
  });

  casper.run(function() {
    test.done();
  });
});
