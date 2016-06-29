/**
 * Object for managing datetime and pricing filters.
 */
ParkingFilter = new (function() {
  var self = this;

  this.WEEKDAYS = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6
  };

  this.currentMin = 0;
  this.currentMax = 30;
  this.currentDatetime = null;

  /**
   * Show/hide spots according to new pricing bounds.
   */
  this.updateSpots = function() {
    self.showSpotInPriceRange(self.currentMin, self.currentMax);
  };

  /**
   * Show/hide spots according to given pricing bounds.
   */
  this.showSpotInPriceRange = function(min, max) {
    self.forEachMarker(filterManager.allMarkers, function(spot) {
      return spot.spot.formatted_details.pricing_restrictions;
    }, function(restriction) {
      var spotPrice = 0;
      if (restriction) {
        spotPrice = self.getSpotPrice(restriction);
      }
      return spotPrice >= min && spotPrice <= max;
    }, "showSpotInPriceRange");
  };

  /**
   * Show/hide spots according to currently selected datetime.
   */
  this.showSpotsByTimeOfOperation = function() {
    self.forEachMarker(filterManager.allMarkers, function(spot) {
      return spot.spot.formatted_details.parking_restrictions;
    }, function(restriction) {
      if (!restriction) {
        return true;
      }
      return !(/unavailable/.test(restriction));
    }, "showSpotsByTimeOfOperation");
  };

  /**
   * Iterator function.
   */
  this.forEachMarker = function(allMarkers, getRestrictionsFn, getSpotAvailabilityFn, fn) {
    for (var i = 0; i < allMarkers.length; i++) {
      var prs = getRestrictionsFn(allMarkers[i]);
      var showSpot = true;
      if (prs.length) {
        for (var j = 0; j < prs.length; j++) {
          var withinInterval = self.isWithinInterval(prs[j], self.currentDatetime);
          if (withinInterval || (/price/i.test(fn) && !self.currentDatetime)) {
            showSpot = getSpotAvailabilityFn(prs[j]);
            if (!showSpot) {
              break;
            }
          }
        }
      } else {
        showSpot = getSpotAvailabilityFn(null);
      }

      var marker = allMarkers[i].marker.marker;
      filterManager.applyFilters(marker, fn, showSpot);
    }
  };

  /*
   * Extract spot price from the parking restriction string.
   */
  this.getSpotPrice = function (priceStr) {
    var vet = priceStr.split(/\$/);
    return parseFloat(vet[1]);
  };

  /**
   * Check if a restriction applies to the given datetime.
   */
  this.isWithinInterval = function (restriction, datetime) {
    // If there is no datetime to check, then it's no within this
    // "null" interval.
    if (!datetime) {
      return false;
    }

    // Split the parking restriction string into its bits.
    var bitsOfPR = self.splitRestriction(restriction);

    // Get indexes for the days of week
    var startDay  = self.WEEKDAYS[bitsOfPR[0]];
    var endDay    = self.WEEKDAYS[bitsOfPR[1]];
    var targetDay = datetime.getDay();

    // convert string times into Date object
    var startTime = self.getRestrictionTime(bitsOfPR[3], datetime);
    var endTime = self.getRestrictionTime(bitsOfPR[5], datetime);

    return self.isWithinRange(startDay, endDay, targetDay) &&
           self.isWithinRange(startTime, endTime, datetime);
  }

  /*
   * Splits parkings and pricing restrictions string into an array
   */
  this.splitRestriction = function (restriction) {
    return restriction.toLowerCase().split(/-| |: /);
  };

  /*
   * Convert a string time into a Date object.
   */
  this.getRestrictionTime = function (stringTime, targetTime) {
    var d  = targetTime.getDate();
    var M  = targetTime.getMonth();
    var y  = targetTime.getFullYear();
    var hs = stringTime.split(/:/);
    var h  = parseInt(hs[0]);
    var m  = parseInt(hs[1]);
    return new Date(y, M, d, h, m, 59, 0);
  };

  /**
   * Check if target value is within the [start, end] range.
   */
  this.isWithinRange = function (start, end, target) {
    return target >= start && target <= end;
  };

});

/**
 * Attach event handlers to DOM elements on page load.
 */
$(function() {

  /**
   * Setup datetime picker.
   */
  $('#datetimepicker').datetimepicker({
    step: 15,
    format:'m/d/Y H:i',
    formatDate:'Y/m/d',
    onChangeDateTime: function (datetime) {
      ParkingFilter.currentDatetime = datetime;
      ParkingFilter.showSpotsByTimeOfOperation();
    }
  });

  /**
   * Update markers when min or max price changes.
   */
  $("#min-price, #max-price").change(function(evt) {
    var newBound = parseInt(evt.target.value);

    if (/min/.test(evt.target.id)) {
      ParkingFilter.currentMin = newBound;
    } else {
      ParkingFilter.currentMax = newBound;
    }

    ParkingFilter.updateSpots();
  });

  /**
   * Update UI pricing labels.
   */
  $("#min-price, #max-price").on("input", function() {
    $(this).closest(".price-slider-container")
           .find(".txt-" + this.id)
           .html("$ " + this.value);
  });
});
