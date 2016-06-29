/**
 * Object for managing incidents.
 */
Incident = new (function() {
  var self = this;

  this.CATEGORIES = {
    0: 'Other',
    1: 'Incorrect address',
    2: 'Wrong schedule',
    3: 'Different price'
  };

  this.CATEGORIES_ICONS = {
    0: 'assignment_late',
    1: 'location_off',
    2: 'restore',
    3: 'info_outline'
  };

  /**
   * Handler that deals with a spot having been selected by the user.
   */
  this.spotSelectedHandler = function(spotId) {
    self.refreshIncidents(spotId);
  };


  /**
   * Handler that deals with a spot having been unselected by the user.
   */
  this.spotUnselectedHandler = function() {
    if (currentSpot && currentSpot.id) {
      currentSpot.id = undefined;
    }

    // We have no spot selected, so show this message.
    $(".msg-no-spot-selected").show();
    // Hide incidents area.
    $(".when-has-spot").hide();
  };

  /**
   * Get incidents from the API and display them.
   */
  this.refreshIncidents = function(spotId) {
    // Remove previously shown incidents.
    $(".when-has-spot .incident-report").remove();

    // Fetch data from the API.
    $.get(Rails.config.smartParkingAPI.url + "/incidents/" + spotId)
    .done(function(response) {
      self.showIncidents(response.data);
    })
    .fail(function() {
      NotificationCenter.error("Unable to fetch incidents. Try again later.");
    });
  };

  /**
   * Create and populate DOM elements for each reported incident.
   * TODO: deal with too many incidents.
   */
  this.showIncidents = function(incidents) {

    // We have a spot selected, so hide this message.
    $(".msg-no-spot-selected").hide();
    $(".when-has-spot").show();

    if (incidents.length) {
      // Hide empty incidents message
      $(".msg-empty-incidents").hide();

      // For each incident...
      for(var i = 0; i < incidents.length; i++) {
        var data = incidents[i];

        // Create a new DOM element...
        var incident = $(".template-for-incident")
                      .clone()
                      .removeClass("template-for-incident")
                      .addClass("incident-report")
                      .show();

        // And set the information.
        incident.find("span.user-comment").html(data.attributes.comment);
        incident.find(".reported-incident-icon").html(self.CATEGORIES_ICONS[data.attributes.category]);
        incident.find(".reported-incident-category").html(self.CATEGORIES[data.attributes.category]);
        incident.find(".reported-incident-time").html(data.attributes.human_created_at + " ago");

        // Append this element to the list and show it.
        $(".reported-incidents-list").append(incident).show();
      }
    } else {
      // No incidents for this spot. Just show a message and the report button.
      $(".msg-empty-incidents").show();
    }

    // Show the report button.
    $("#btn-report-incident").show();
  };

  /**
   * Clear form data and hide the form.
   */
  this.clearForm = function() {
    $("#form-for-incident input[name=incident-category]").val('');
    $(".category-chooser").text("Choose a category");
    $("#form-for-incident textarea[name=incident-description]").val('');
    $("#form-for-incident button[type=submit]").attr('disabled', false);
    $("#container-incident-form").hide();
  };

  /**
   * Create a new incident.
   */
  this.create = function(spotId, category, comment) {
    return $.post(Rails.config.smartParkingAPI.url + "/incidents", {
      incident: {
        spot_id:  currentSpot.id,
        category: category,
        comment:  comment
      }
    }).done(function(response) {
      NotificationCenter.success("Incident was reported. Thank you!");
      self.clearForm();
      self.refreshIncidents(currentSpot.id);
    }).fail(function(response) {
      var errors = "Incident could not be reported. Errors: ";
      if (response.status === 422) {
        for (var i = 0; i < response.responseJSON.errors.length; i++) {
          var error = response.responseJSON.errors[i];
          errors = errors + error.title + ". ";
        }
        NotificationCenter.error(errors);
        $("#form-for-incident button[type=submit]").attr('disabled', false);
      } else {
        NotificationCenter.error("Incident could not be reported. Please, try again later.");
      }
    });
  };
};


/**
 * Attach event handlers to DOM elements on page load.
 */
$(function() {

  /**
   * Make the "Choose a category" label open the category menu.
   */
  $(".category-chooser").click(function() {
    $("#incident-category-menu").click();
  });

  /**
   * When the user chooses a category, update the hidden form field and
   * the text.
   */
  $("#incident-category-menu-items").click(function(event) {
    $("#form-for-incident input[name=incident-category]").val($(event.target).data('category'));
    $(".category-chooser").text($(event.target).text());
  });

  /**
   * When the user clicks the report incident button, check if they're logged
   * in and, if so, display the form.
   */
  $("#btn-report-incident").click(function() {
    if (currentUser.id) {
      $("#btn-report-incident").hide();
      $("#container-incident-form").show();
    } else {
      NotificationCenter.error("Please log in to report an incident.");
    }
  });

  /**
   * If the user decides to cancel the report, just hide the form and
   * re-display the button.
   */
  $("#form-for-incident .btn-cancel").click(function () {
    $("#btn-report-incident").show();
    $("#container-incident-form").hide();
  });

  /**
   * If the user submits the form, create a new incident.
   */
  $("#form-for-incident").on('submit', function(event) {
    $("#form-for-incident button[type=submit]").attr('disabled', true);
    event.preventDefault();

    var category = $("#form-for-incident input[name=incident-category]").val();
    var comment  = $("#form-for-incident textarea[name=incident-description]").val();

    Incident.create(currentSpot.id, category, comment);
  });
});
