/**
 * Object for managing checkins.
 */
Checkin = new (function() {
  var self = this;

  /**
   * Checkin initialization. See if the user is already checked in
   * on page load.
   */
  this.init = function() {
    PubSub.subscribe("auth.validation.success", function(event, user) {
      $.get(Rails.config.smartParkingAPI.url + "/checkins/pending")
      .done(function(response) {
        if (response.data && response.data[0].id) {
          self.updateLayoutForCheckin(response.data[0]);
        } else {
          $(".msg-no-active-checkin").show();
        }
      })
      .fail(function(response) {
        $(".msg-no-active-checkin").show();
      })
      .always(function(response) {
        $(".msg-checkin-logged-out").hide();
      });
    });
  };

  /**
   * Create a new checkin for the current user.
   */
  this.create = function() {
    if (currentUser.id) {
      if (currentUser.checkin) {
        NotificationCenter.error("You are already checked in to a spot");
      } else {
        $.post(Rails.config.smartParkingAPI.url + "/checkins", {
          spot_id: currentSpot.id
        })
        .done(function (response) {
          NotificationCenter.success("Checked in successfully");
          $(".checkIn-btn").attr('disabled', true);
          self.updateLayoutForCheckin(response.data[0]);
        })
        .fail(function (response) {
          var errors = "Could not checkin. Errors: ";
          if (response.status === 422) {
            for (var i = 0; i < response.responseJSON.errors.length; i++) {
              var error = response.responseJSON.errors[i];
              errors = errors + error.title + ". ";
            }
            NotificationCenter.error(errors);
          } else {
            NotificationCenter.error("Could not checkin. Please try again later.");
          }
        });
      }
    } else {
      NotificationCenter.error("Please log in to checkin to a spot");
    }
  };

  /**
   * Update the UI for the event of a new checkin.
   */
  this.updateLayoutForCheckin = function(checkin) {
    currentUser.checkin = checkin;
    $(".when-has-checkin .txt-checked-in-at").text(
      "Checked in at: " + checkin.attributes.checked_in_at_human + ".");

    $(".when-has-checkin").show();
    $(".msg-no-active-checkin").hide();
  };

  /**
   * Update the UI for the event of a new checkout.
   */
  this.updateLayoutForCheckout = function() {
    currentUser.checkin = undefined;
    $(".msg-no-active-checkin").show();
    $(".when-has-checkin").hide();
  }

  /**
   * Perform a checkout.
   */
  this.checkout = function() {
    if (currentUser.id) {
      $.post(Rails.config.smartParkingAPI.url + "/checkins/checkout")
      .done(function (response) {
        NotificationCenter.success("Checked out successfully");
        self.updateLayoutForCheckout();
      })
      .fail(function (response) {
        var errors = "Could not checkout. Errors: ";
        if (response.status === 422) {
          for (var i = 0; i < response.responseJSON.errors.length; i++) {
            var error = response.responseJSON.errors[i];
            errors = errors + error.title + ". ";
          }
          NotificationCenter.error(errors);
          // $("#form-for-incident button[type=submit]").attr('disabled', false);
        } else {
          NotificationCenter.error("Could not checkout. Please try again later.");
        }
      });
    } else {
      NotificationCenter.error("Please log in to checkout from a spot");
    }
  };

  /**
   * Display the route from the user's current position to their checked in
   * spot.
   */
  this.routeToCheckinSpot = function() {
    if (Detail.currentInfoWindow) {
      Detail.currentInfoWindow.close();
    }

    var lat = currentUser.checkin.attributes.spot_attributes.lat;
    var lng = currentUser.checkin.attributes.spot_attributes.lng;
    var position = new google.maps.LatLng(lat, lng);
    traceroute(map, position);
  };
});

/**
 * Attach event handlers to DOM elements on page load.
 */
$(function() {
  $(".checkOut-btn").on('click', function() {
    Checkin.checkout();
  });

  $(".route-checkin-btn").on('click', function() {
    Checkin.routeToCheckinSpot();
  });
});
