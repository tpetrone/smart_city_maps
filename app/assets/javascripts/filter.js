$(function() {
  $(".checkbox-filter").click(function() {
    filterManager.toggleGroup($(this).data('status'));
  })

});

/**
 * Creates a new "class" AvailabilityFilter
 */
function AvailabilityFilter() {

  this.markerGroups = {
    "available": [],
    "occupied": [],
    "defected": []
  };

  /**
   * [STATES description]
   * @type {Object}
   */
  this.STATES = { '-1': 'defected', '0': 'available', '1': 'occupied' };

  /**
   * [toggleGroup description]
   * @param  {[type]} type [description]
   * @return {[type]}      [description]
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
  }

  /**
   * [assignSpot description]
   * @param  {[type]} spot [description]
   * @return {[type]}      [description]
   */
  this.assignSpot = function(spot) {
    if (!this.markerGroups[this.STATES[spot.status]]) {
      this.markerGroups[this.STATES[spot.status]] = [];
    }

    this.markerGroups[this.STATES[spot.status]].push(gmarker.marker);
  }

}

