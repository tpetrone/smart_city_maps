/**
 * Tests whether autocomplete features of Google Places are working.
 */

casper.test.begin('Autocomplete loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    var ac = casper.evaluate(function() {
      return window.autocomplete;
    });
    test.assertTruthy(ac, 'Autocomplete is loaded');
  });

  casper.run(function() {
    test.done();
  });
});
