$(function () {
  /*
   * Listens for changes in min-price element
   */
  $("#min-price").change(function() {
    var newMin = getMinPrice();
    if (newMin !== null) {
      var max = getMaxPrice();
      showSpotsAboveThisPrice(filterManager.allMarkers, newMin, max);
    } else {
      $(this).val("");
    }
  });

  /*
   * Listens for changes in max-price element
   */
   $("#max-price").change(function() {
     var newMax = getMaxPrice();
     if (newMax !== null) {
       var min = getMinPrice();
       showSpotsBelowThisPrice(filterManager.allMarkers, min, newMax);
     } else {
       $(this).val("");
     }
   });

   /*
    * Creates a datetime picker component
    */
   $('#datetimepicker').datetimepicker({
     step: 15,
     format:'m/d/Y H:i',
     formatDate:'Y/m/d'
   });

   /*
    * Listens for changes in datetimepicker element
    */
   $('#datetimepicker').change(function() {
     var targetTime = getTargetTime();
     if (targetTime !== null) {
       showSpotsByTimeOfOperation(filterManager.allMarkers, targetTime);
     } else {
       $(this).val("");
     }
   });
});

/*
 * Gets the value of the max-price element
 */
function getMaxPrice() {
  var max = parseFloat($("#max-price").val());
  if (isNaN(max) || max < 0.0) {
    max = null;
  }
  return max;
}

/*
 * Gets the value of the min-price element
 */
function getMinPrice() {
  var min = parseFloat($("#min-price").val());
  if (isNaN(min) || min < 0.0) {
    min = null;
  }
  return min;
}

/*
 * Gets the value of the datetimepicker element
 */
function getTargetTime() {
  var datetimeStr = $("#datetimepicker").val();
  if (datetimeStr === "") {
    return null;
  }
  var bits = datetimeStr.split(/ |\/|:/);
  return new Date(bits[2], bits[0]-1, bits[1], bits[3], bits[4], 59, 0);
}

/*
 * Shows only spots with prices lower than newMax
 */
function showSpotsBelowThisPrice(allMarkers, min, newMax) {
  // if there is no min specified, use 0.0
  min = (min === null) ? 0.0 : min;
  // If there is no targetTime, use today's date
  var datetime = (getTargetTime() !== null) ? getTargetTime() : new Date();
  for (var i = 0; i < allMarkers.length; i++) {
    // Get the string associated to the pricing restriction
    var prs = getSpotPricingRestriction(allMarkers[i]);
    var spotPrice = 0.0;
    for (var j = 0; j < prs.length; j++) {
      // For every restriction in the spot, check if the datetime
      // is in the interval of the restriction
      var withinInterval = isWithinInterval(prs[j], datetime);
      if (withinInterval) {
        // If the spot is in the interval, get the spot price as a number
        spotPrice = getSpotPrice(prs[j]);
        break;
      }
    }
    // Show the spot if its price is below or equal to the threshold
    var showSpot;
    if (spotPrice <= newMax && spotPrice >= min) {
      showSpot = true;
    } else {
      showSpot = false;
    }
    var marker = allMarkers[i].marker.marker;
    filterManager.applyFilters(marker, fName(arguments), showSpot);
  }
}

/*
 * Shows only spots with prices higher than newMin
 */
function showSpotsAboveThisPrice(allMarkers, newMin, max) {
  // if there is no max specified, use Number.MAX_VALUE
  max = (max === null) ? Number.MAX_VALUE : max;
  // If there is no targetTime, use today's date
  var datetime = (getTargetTime() !== null) ? getTargetTime() : new Date();
  for (var i = 0; i < allMarkers.length; i++) {
    // Get the string associated to the pricing restriction
    var prs = getSpotPricingRestriction(allMarkers[i]);
    var spotPrice = 0.0;
    for (var j = 0; j < prs.length; j++) {
      // For every restriction in the spot, check if the datetime
      // is in the interval of the restriction
      var withinInterval = isWithinInterval(prs[j], datetime);
      if (withinInterval) {
        // If the spot is in the interval, get the spot price as a number
        spotPrice = getSpotPrice(prs[j]);
        break;
      }
    }
    var showSpot;
    // Show the spot if its price is above or equal to the threshold
    if (spotPrice >= newMin && spotPrice <= max) {
      showSpot = true;
    } else {
      showSpot = false;
    }
    var marker = allMarkers[i].marker.marker;
    filterManager.applyFilters(marker, fName(arguments), showSpot);
  }
}

/*
 * Shows only spots within the date range
 */
function showSpotsByTimeOfOperation(allMarkers, targetTime) {
  for (var i = 0; i < allMarkers.length; i++) {
    // Get the string associated to the parking restriction
    var prs = getSpotParkingRestriction(allMarkers[i]);
    var showSpot = false;
    if (prs.length === 0) {
      // If there are no restrictions, show the spot
      showSpot = true;
    }
    for (var j = 0; j < prs.length; j++) {
      // For every restriction in the spot, check if the datetime
      // is in the interval of the restriction
      var withinInterval = isWithinInterval(prs[j], targetTime);
      // Check if the spot is available according to the interval
      var spotAvailable = isSpotAvailable(prs[j], withinInterval);
      if (spotAvailable) {
        showSpot = true;
        break;
      }
    }
    var marker = allMarkers[i].marker.marker;
    filterManager.applyFilters(marker, fName(arguments), showSpot);
  }
}

/*
 * Checks if a restriction is in or out of an interval
 */
function isSpotAvailable(restriction, withinInterval) {
  var isAvailable = false;
  var bitsOfPR = splitRestriction(restriction);
  var status = bitsOfPR[bitsOfPR.length-1];
  // if the restriction says that the spot is unavailable,
  // but the datetime is outside the restriction interval, then the spot
  // is actually available
  if (status === "unavailable" && !withinInterval) {
    isAvailable = true;
  // if a restriction says the spot is only available,
  // in a certain interval, and the datetime in within
  // this interval, then the spot is available
  } else if (status === "available" && withinInterval) {
    isAvailable = true;
  }
  // In all other cases, the spot is unavailable
  return isAvailable;
}

/*
 * Extracts the parking restriction
 */
function getSpotParkingRestriction(obj) {
  return obj.spot.formatted_details.parking_restrictions;
}

/*
 * Extracts the pricing restriction
 */
function getSpotPricingRestriction(obj) {
  return obj.spot.formatted_details.pricing_restrictions;
}

/*
 * Converts a day of week into an index
 */
function dayOfWeekToIndex(dayOfWeek) {
  switch (dayOfWeek) {
    case "sun": return 0;
    case "mon": return 1;
    case "tue": return 2;
    case "wed": return 3;
    case "thu": return 4;
    case "fri": return 5;
    case "sat": return 6;
  }
  return -1;
}

/*
 * Converts a date into a day of week index
 */
function dateToDayOfWeekIndex(date) {
  return date.getDay();
}

/*
 * Extracts spot price from the parking restriction string
 */
function getSpotPrice(priceStr) {
  var vet = priceStr.split(/\$/);
  return parseFloat(vet[1]);
}

function isWithinInterval(restriction, datetime) {
  // Splits the parking restriction string into bits
  var bitsOfPR = splitRestriction(restriction);
  // Get indexes for the days of week
  var initDIndex = dayOfWeekToIndex(bitsOfPR[0]);
  var endDIndex = dayOfWeekToIndex(bitsOfPR[1]);
  var targetDIndex = dateToDayOfWeekIndex(datetime);
  // convert string times into Date object
  var i = 3;
  if (endDIndex === -1) {
    i = i - 1;
  }
  var initTime = getRestrictionTime(bitsOfPR[i], datetime);
  var endTime = getRestrictionTime(bitsOfPR[i+2], datetime);
  // Show the spots if allowed
  var within = false;
  if (isWithinWeekDay(initDIndex, endDIndex, targetDIndex) &&
      isWithinTime(initTime, endTime, datetime)) {
    within = true;
  }
  return within;
}

/*
 * Splits parkings and pricing restrictions string into an array
 */
function splitRestriction(restriction) {
  restriction = restriction.toLowerCase();
  return restriction.split(/-| |: /);
}

/*
 * Converts a string time into a Date object
 */
function getRestrictionTime(stringTime, targetTime) {
  var d = targetTime.getDate();
  var M = targetTime.getMonth();
  var y = targetTime.getFullYear();
  var hs = stringTime.split(/:/);
  var h = parseInt(hs[0]);
  var m = parseInt(hs[1]);
  return new Date(y, M, d, h, m, 59, 0);
}

/*
 * Checks if the spot is available in the target date
 */
function isWithinWeekDay(initDay, endDay, targetDay) {
  var within = false;
  if (endDay !== -1) {
    if (targetDay >= initDay && targetDay <= endDay) {
      within = true;
    }
  } else {
    if (targetDay === initDay) {
      within = true;
    }
  }
  return within;
}

/*
 * Checks if the spot is available in the target time
 */
function isWithinTime(initTime, endTime, targetTime) {
  var within = false;
  if (targetTime >= initTime && targetTime <= endTime) {
    within = true;
  }
  return within;
}
