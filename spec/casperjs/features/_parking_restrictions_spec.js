exports.spec = function(casper, test, other) {
  casper.then(function() {
     var spotPrice = casper.evaluate(function(){
       var parkingRestrictionStr = "Mon-Fri | 18:00:00 to 23:59:59: $10.00";
       return window.getSpotPrice(parkingRestrictionStr);
     });
     test.assert(spotPrice === 10.0, "Get price from parking restriction was successfull");
  });
};
