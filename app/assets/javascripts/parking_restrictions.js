$(function () {
  /**
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

  /**
   * Setup datetime picker.
   */
  $('#datetimepicker').datetimepicker({
    step: 15,
    format:'m/d/Y H:i',
    formatDate:'Y/m/d'
  });


  /**
   * Listen to datetime update.
   */
  $('#datetimepicker').change(function() {
    var targetTime = getTargetTime();
    showSpotsByTimeOfOperation(filterManager.allMarkers, targetTime);
  });
});

function getMaxPrice() {
  var max = parseFloat($("#max-price").val());
  if (isNaN(max) || max < 0.0) {
    max = null;
  }
  return max;
}

// REVIEW: Remove duplication here.
function getMinPrice() {
  var min = parseFloat($("#min-price").val());
  if (isNaN(min) || min < 0.0) {
    min = null;
  }
  return min;
}

/*
 * Shows only spots with prices lower than newMax
 */
function showSpotsBelowThisPrice(allMarkers, min, newMax) {
  min = (min === null) ? 0.0 : min;
  var datetime = getTargetTime();
  for (var i = 0; i < allMarkers.length; i++) {
    var prs = getSpotPricingRestriction(allMarkers[i]);
    var spotPrice = 0.0;
    for (var j = 0; j < prs.length; j++) {
      var withinInterval = isWithinInterval(prs[j], datetime);
      if (withinInterval) {
        // Get the spot price as a number
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
  max = (max === null) ? Number.MAX_VALUE : max;
  var datetime = getTargetTime();
  for (var i = 0; i < allMarkers.length; i++) {
    var prs = getSpotPricingRestriction(allMarkers[i]);
    var spotPrice = 0.0;
    for (var j = 0; j < prs.length; j++) {
      var withinInterval = isWithinInterval(prs[j], datetime);
      if (withinInterval) {
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
    var prs = getSpotParkingRestriction(allMarkers[i]);
    var showSpot = false;
    if (prs.length === 0) {
      showSpot = true;
    }
    for (var j = 0; j < prs.length; j++) {
      var withinInterval = isWithinInterval(prs[j], targetTime);
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

function isSpotAvailable(restriction, withinInterval) {
  var isAvailable = false;
  var bitsOfPR = splitRestriction(restriction);
  var status = bitsOfPR[bitsOfPR.length-1];
  if (status === "unavailable" && !withinInterval) {
    isAvailable = true;
  } else if (status === "available" && withinInterval) {
    isAvailable = true;
  }
  return isAvailable;
}

/*
 * Extracts the parking restriction.
 */
function getSpotParkingRestriction(obj) {
  // REVIEW: Will break on merge.
  return obj.spot.formatted_details.parking_restrictions;
}

/*
 * Extracts the pricing restriction
 */
function getSpotPricingRestriction(obj) {
  // REVIEW: Will break on merge.
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
  var initTime = getRestrictionTime(bitsOfPR[3], datetime);
  var endTime = getRestrictionTime(bitsOfPR[5], datetime);
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

function getTargetTime() {
  var fullDatetimeStr = $("#datetimepicker").val();
  var targetTime;
  if (fullDatetimeStr !== "") {
    var fullDateBits = fullDatetimeStr.split(/ /);
    var stringDate = fullDateBits[0];
    var stringTime = fullDateBits[1];
    var dateBits = stringDate.split(/\//);
    var M = parseInt(dateBits[0])-1;
    var d = parseInt(dateBits[1]);
    var y = parseInt(dateBits[2]);
    var timeBits = stringTime.split(/:/);
    var h = parseInt(timeBits[0]);
    var m = parseInt(timeBits[1]);
    targetTime = new Date(y, M, d, h, m, 59, 0);
  } else {
    targetTime = new Date();
  }
  return targetTime;
}
