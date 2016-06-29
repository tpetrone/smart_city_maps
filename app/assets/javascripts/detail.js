function Detail() {

  /**
   * Prepares the details window for a marker and binds on the
   * 'click' event to display the details.
   */
  this.showInfo = function(map, marker, spot, spot_id){
    details = spot.attributes;

    var content = $(".parking-spot-details").clone().show();

    content.find("li[data-attr=type] span").html(Utils.capitalize(details.parking_type));

    if (details.formatted_details.parking_restrictions.length > 0) {
      var f = this.toFormattedList(details.formatted_details.parking_restrictions);
      content.find("li[data-attr=parking-schedules-list]").show().find("ul").html(f);
    }
    else {
      content.find("li[data-attr=parking-schedules-text]").show().find("span").html('None');
    }

    if (details.formatted_details.pricing_restrictions.length > 0) {
      var f = this.toFormattedList(details.formatted_details.pricing_restrictions);
      content.find("li[data-attr=pricing-schedules-list]").show().find("ul").html(f);
    }
    else {
      content.find("li[data-attr=pricing-schedules-text]").show().find("span").html('None');
    }

    var newInfoWindow = new google.maps.InfoWindow({content: content.html()});

    marker.addListener('click', function() {
      if (Detail.currentInfoWindow) {
        Detail.currentInfoWindow.close();
      }

      Detail.currentInfoWindow = newInfoWindow;
      newInfoWindow.open(map, marker);

      currentSpot = spot;

      if (currentSpot.attributes.status == 0 /* available */) {
        // Checkin button.
        $(".checkIn-btn").on('click', function() {
           Checkin.create();
        });
      } else {
        $(".checkIn-btn").attr('disabled', true);
      }

      Incident.spotSelectedHandler(spot.id);

      google.maps.event.addListener(newInfoWindow, 'closeclick', function () {
        Incident.spotUnselectedHandler();
      });

      $(".route-btn").on('click', function() {
        newInfoWindow.close();
        traceroute(map, marker.position);
      });
    });
  };

  /**
   * Takes an array of strings and converts it to an array of
   * <li> elements, with the strings as contents.
   */
  this.toFormattedList = function(list) {
    var formatted = [];
    for (var i = 0; i < list.length; i++) {
      formatted.push($("<li></li>").html(list[i]));
    }
    return formatted;
  };
}

/**
 * Keeps a reference to the currently displayed info window.
 * Starts as undefined, since no windows are shown on startup.
 */
Detail.currentInfoWindow = undefined;
