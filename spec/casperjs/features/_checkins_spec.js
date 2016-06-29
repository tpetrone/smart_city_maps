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
    console.log(other.colorizer.colorize("Test file: _checkins_spec.js", "INFO_BAR"));
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
      return !$(".msg-checkin-logged-out").is(":visible");
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
   * Wait for spot information window to show checkin button.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return $("#map .checkIn-btn").length > 0;
    });
  }, function then() {}, function timeout() {}, 10000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Try to checkin without being signed in.
   */
  casper.then(function() {
    casper.evaluate(function() {
      Checkin.create();
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

  /**
   * Try to checkin without being signed in.
   */
  casper.then(function() {
    casper.evaluate(function() {
      Checkin.checkout();
    });
  });

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Perform checkin action.
   */
  casper.then(function() {
    casper.evaluate(function() {
      currentUser = { id: 1 };
      Checkin.create();
    });
  });

  /**
   * Wait for checkin to be created.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return currentUser.checkin && currentUser.checkin.id === 1;
    });
  }, function then() {
    var checkinId = casper.evaluate(function() {
      return currentUser.checkin.id;
    });
    test.assert(checkinId === 1, "Checkin was created");
  }, function timeout() {}, 5000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Try to checkin again: notification error.
   */
  casper.then(function() {
    casper.evaluate(function() {
      Checkin.create();
    });
  });

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Click on the route button.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("#route-checkin-btn").click();
    });
  });

  /**
   * Try to checkin again: API error.
   */
  casper.then(function() {
    casper.evaluate(function() {
      currentUser.checkin = null;
      Checkin.create();
    });
  });

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Click on checkout.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $(".checkOut-btn").click();
    });
  });

  /**
   * Wait for checkout message.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return NotificationCenter.snackbarContainer.MaterialSnackbar.message_ === "Checked out successfully";
    });
  }, function then() {
    test.assert(true, "User checked out");
  }, function timeout() {}, 5000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Checkout again: error.
   */
  casper.then(function() {
    casper.evaluate(function() {
      Checkin.checkout();
    });
  });

  /**
   * Wait for API error.
   */
  casper.waitFor(function() {
    var msg = casper.evaluate(function() {
      return NotificationCenter.snackbarContainer.MaterialSnackbar.message_;
    });
    return msg;
  }, function then() {
    test.assert(true, "User had error 422 on checkout");
  }, function timeout() {
  }, 5000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });

  /**
   * Checkout again: another API error.
   */
  casper.then(function() {
    casper.evaluate(function() {
      Checkin.checkout();
    });
  });

  /**
   * Wait for API error.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      var msg = NotificationCenter.snackbarContainer.MaterialSnackbar.message_;
      return msg;
    });
  }, function then() {
    test.assert(true, "User had error 500 on checkout");
  }, function timeout() {
  }, 3000);

  /**
   * Wait for notifications.
   */
  casper.then(function() {
    waitForNotificationsToVanish(casper, test);
  });
};
