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

  this.allMarkers = [];

  /**
   * Show/hide spot markers according to user selection.
   */
  this.toggleGroup = function(type) {
    for (var i = 0; i < this.markerGroups[type].length; i++) {
      var marker = this.markerGroups[type][i].marker;
      var showSpot;
      if (!marker.getVisible()) {
        showSpot = true;
      } else {
        showSpot = false;
      }
      filterManager.applyFilters(marker, "spotStatus", showSpot);
    }
  };

  /**
   * Erase all markers from the maps.
   */
  this.resetAll = function(){
    for (var j in this.markerGroups) {
      for (var i = 0 ; i < this.markerGroups[j].length; i++) {
        this.markerGroups[j][i].marker.setMap(null);
      }
    }
  };

  /**
   * Add a spot to a marker group.
   */
  this.assignSpot = function(spot, marker) {
    this.markerGroups[Spot.STATUSES[spot.status]].push(marker);
    this.allMarkers.push({
      spot: spot,
      marker: marker
    });
  };

  this.filterKeys = [];

  this.addFilter = function(marker, filterKey, visible) {
    var isFilterAdded = false;
    for (var i = 0; i < this.filterKeys.length; i++) {
      if (this.filterKeys[i] == filterKey) {
        isFilterAdded = true;
        break;
      }
    }
    if (!isFilterAdded) {
      this.filterKeys.push(filterKey);
    }
    marker[filterKey] = visible;
  };

  this.applyFilters = function(marker, filterKey, visible) {
    this.addFilter(marker, filterKey, visible);

    var showMarker = true;
    for (var i = 0; i < this.filterKeys.length; i++) {
      if (marker.hasOwnProperty(this.filterKeys[i])) {
        showMarker = showMarker && marker[this.filterKeys[i]];
        if (!showMarker) {
          break;
        }
      }
    }
    marker.setVisible(showMarker);
  };
}

function fName(args) {
   return args.callee.name;
}
