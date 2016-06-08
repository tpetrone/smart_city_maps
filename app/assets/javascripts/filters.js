// Executes after the HTML is parsed.
$(function() {

  /**
   * Register click listener for the filter checkboxes.
   */
  $(".checkbox-filter").click(function() {
    filterManager.toggleGroup($(this).data('status'));
  });
});

/**
 * AvailabilityFilter "class".
 */
function AvailabilityFilter() {

  /**
   * Marks to which status the currently displayed spots belong.
   */
  this.markerGroups = {
    "available": [],
    "occupied": [],
    "defected": []
  };

  /**
   * Show/hide spot markers according to user selection.
   */
  this.toggleGroup = function(type) {
    for (var i = 0; i < this.markerGroups[type].length; i++) {
      var marker = this.markerGroups[type][i];
      if (!marker.getVisible()) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    }
  };

  /**
   * Erase all markers from the maps.
   */
  this.resetAll = function(){
    for (var j in this.markerGroups) {
      for (var i = 0 ; i < this.markerGroups[j].length; i++) {
        this.markerGroups[j][i].setMap(null);
      }
    }
  };

  /**
   * Add a spot to a marker group.
   */
  this.assignSpot = function(spot, marker) {
    this.markerGroups[Spot.STATUSES[spot.status]].push(marker);
  };
}
