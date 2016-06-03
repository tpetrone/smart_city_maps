/**
 * PhantomJS does not support geolocation[1], but we can fake it by injecting
 * the required functions into the PhantomJS page[2].
 *
 * [1] http://stackoverflow.com/questions/15894090/does-phantomjs-support-geolocations
 * [2] http://stackoverflow.com/questions/17893243/casperjs-failed-injecting-jquery
 */

window.navigator.geolocation = {
  getCurrentPosition: function (success, failure) {
    success({
      coords: {
        // Will always return Germany, Rostock
        latitude: 54.0834,
        longitude: 12.1004

      }, timestamp: Date.now()
    });
  },
};
