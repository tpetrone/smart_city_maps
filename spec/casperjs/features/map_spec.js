casper.test.begin('Map loads correctly', 1, function suite(test) {
  casper.start('http://localhost:3000', function() {
    test.assertExists('.page-content',"Page contains the google map");
  })
  .run(function() {
    test.done();
  });
});
