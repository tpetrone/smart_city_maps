/**
 * Wait for notifications to disappear.
 */
function waitForNotificationsToVanish(casper, test) {
  casper.then(function() {
    casper.evaluate(function() {
      NotificationCenter.hideAll();
    });
  });

  casper.waitFor(function() {
    var msg = casper.evaluate(function() {
      return NotificationCenter.snackbarContainer.MaterialSnackbar.message_;
    });
    return !msg;
  }, function then() {
  }, function err() {
    console.log("Timeout while waiting for notifications to go away");
  }, 3000);
}

exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _incidents_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Publish "auth.validation.success" event.
   */
  casper.then(function() {
    casper.evaluate(function() {
      PubSub.publish("auth.validation.success", "User is logged in!");
    });
  });

  /**
   * Wait for reaction.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return !$(".msg-no-spot-selected").is(":visible");
    });
  }, function then() {
    test.assert(true, "User is logged in");
  }, function err() {
  }, 5000);

  /**
   * Click on a marker.
   */
  casper.then(function() {
    casper.evaluate(function() {
      google.maps.event.trigger(
        filterManager.markerGroups.available[1].marker, 'click');
    });
  });

    /**
   * Wait for spot information window to show Report Incident button.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#btn-report-incident").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Send Report Incident.
   */
  casper.then(function() {
    casper.evaluate(function() {
      var category = 1;
      var comment ="comment";
      var spot_id = currentSpot.id;
      Incident.create(spot_id, category, comment);
    });
  });

  /**
   * Wait for error message.
   */
  casper.waitFor(function() {
    var msg = casper.evaluate(function() {
      return NotificationCenter.snackbarContainer.MaterialSnackbar.message_;
    });
    return /Please log in to checkin to a spot/.test(msg);
  }, function then() {
    test.assert(true, "User cannot checkin without logging in");
  }, function err() {
    console.log("Timeout");
  }, 3000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });
};
