casper.test.begin('Autocomplete works correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    this.sendKeys('input[name=address]', "Instituto");
    test.assertSelectorHasText('input.mdl-textfield__input', 'Instituto', "Establishment is correctly set into input text");
  })
  .run(function() {
    test.done();
  });
});
