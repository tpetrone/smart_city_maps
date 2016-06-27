$(function () {
  /*
   * Listens for changes in min-price element
   */
  $("#min-price").change(function() {
    var newMin = parseFloat($("#min-price").val());
    if (!isNaN(newMin)) {
      showSpotsAboveThisPrice(filterManager.allMarkers, newMin);
    }
  });

  /*
   * Listens for changes in max-price element
   */
   $("#max-price").change(function() {
     var newMax = parseFloat($("#max-price").val());
     if (!isNaN(newMax)) {
       showSpotsBelowThisPrice(filterManager.allMarkers, newMax);
     }
   });

   var options = {
      twentyFour: true,  //Display 24 hour format, defaults to false
      upArrow: 'wickedpicker__controls__control-up',  //The up arrow class selector to use, for custom CSS
      downArrow: 'wickedpicker__controls__control-down', //The down arrow class selector to use, for custom CSS
      close: 'wickedpicker__close', //The close class selector to use, for custom CSS
      hoverState: 'hover-state', //The hover state class to use, for custom CSS
      title: 'Time Picker' //The Wickedpicker's title
   };

   $('#datepicker').datepicker();
   $("#datepicker").change(function() {
     dateTimeChanged();
   });

   $('#timepicker').wickedpicker(options);
   $('#timepicker').change(function(){
     dateTimeChanged();
   });
});

function dateTimeChanged() {
  var dateStr = $("#datepicker").val();
  var timeStr = $("#timepicker").val();
  if (dateStr !== "" && timeStr !== "") {
    var targetTime = getTargetTime(dateStr, timeStr);
    showSpotsByTimeOfOperation(filterManager.allMarkers, targetTime);
  }
}

/*
 * Shows only spots with prices lower than newMax
 */
function showSpotsBelowThisPrice(allMarkers, newMax) {
  for (var i = 0; i < allMarkers.length; i++) {
    var obj = allMarkers[i];
    var parkingRestriction = getSpotParkingRestriction(obj);
    // If there is any parking restriction for this spot
    if (parkingRestriction !== undefined) {
      // Split the parking restriction into bits
      var bitsOfPR = splitParkingRestriction(parkingRestriction);
      // Get the spot price as a number
      var spotPrice = getSpotPrice(bitsOfPR[bitsOfPR.length -1]);
      // Show the spot if its price is below the threshold
      if (spotPrice <= newMax) {
        obj.marker.marker.setVisible(true);
      } else {
        obj.marker.marker.setVisible(false);
      }
    }
  }
}

/*
 * Shows only spots with prices higher than newMin
 */
function showSpotsAboveThisPrice(allMarkers, newMin) {
  var allMarkersLength = allMarkers.length;
  for (var i = 0; i < allMarkersLength; i++) {
    var obj = allMarkers[i];
    var parkingRestriction = getSpotParkingRestriction(obj);

    // If the spot has any pricing restrictions
    if (parkingRestriction !== undefined) {
      var bitsOfPR = splitParkingRestriction(parkingRestriction);
      var spotPrice = getSpotPrice(bitsOfPR[bitsOfPR.length-1]);
      if (spotPrice >= newMin) {
        obj.marker.marker.setVisible(true);
      } else {
        obj.marker.marker.setVisible(false);
      }
    }
  }
}

/*
 * Shows only spots within the date range
 */
function showSpotsByTimeOfOperation(allMarkers, targetTime) {
  for (var i = 0; i < allMarkers.length; i++) {
    var obj = allMarkers[i];
    var parkingRestriction = getSpotParkingRestriction(obj);
    // If there is any parking restriction for this spot
    if (parkingRestriction !== undefined) {
      // Splits the parking restriction string into bits
      var bitsOfPR = splitParkingRestriction(parkingRestriction);
      // Get indexes for the days of week
      var initDIndex = dayOfWeekToIndex(bitsOfPR[0]);
      var endDIndex = dayOfWeekToIndex(bitsOfPR[1]);
      var targetDIndex = dateToDayOfWeekIndex(targetTime);
      // convert string times into Date object
      var initTime = getRestrictionTime(bitsOfPR[3], targetTime);
      var endTime = getRestrictionTime(bitsOfPR[5], targetTime);
      // Show the spots if allowed
      if (isAllowedByWeekDay(initDIndex, endDIndex, targetDIndex) &&
          isAllowedByTime(initTime, endTime, targetTime)) {
        obj.marker.marker.setVisible(true);
      } else {
        obj.marker.marker.setVisible(false);
      }
    }
  }
}

/*
 * Checks if the spot is available in the target date
 */
function isAllowedByWeekDay(initDay, endDay, targetDay) {
  var isAllowed = false;
  if (endDay !== -1) {
    if (targetDay >= initDay && targetDay <= endDay) {
      isAllowed = true;
    }
  } else {
    if (targetDay === initDay) {
      isAllowed = true;
    }
  }
  return isAllowed;
}

/*
 * Checks if the spot is available in the target time
 */
function isAllowedByTime(initTime, endTime, targetTime) {
  var isAllowed = false;
  if (targetTime >= initTime && targetTime <= endTime) {
    isAllowed = true;
  }
  return isAllowed;
}

/*
 * Extracts the parking restriction
 */
function getSpotParkingRestriction(obj) {
  return obj.spot.formatted_details.pricing_restrictions[0];
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
  priceStr = priceStr.replace('$', '');
  return parseFloat(priceStr);
}

/*
 * Splits the parking restriction string into an array
 */
function splitParkingRestriction(parkingRestriction) {
  parkingRestriction = parkingRestriction.toLowerCase();
  return parkingRestriction.split(/-| |: /);
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
  var s = parseInt(hs[2]);
  return new Date(d, M, y, h, m, s);
}

function getTargetTime(stringDate, stringTime) {
  var dateBits = stringDate.split(/\//);
  var d = parseInt(dateBits[0]);
  var M = parseInt(dateBits[1]);
  var y = parseInt(dateBits[2]);
  var timeBits = stringTime.split(/:/);
  var h = parseInt(timeBits[0]);
  var m = parseInt(timeBits[1]);
  var s = parseInt(timeBits[2]);
  return new Date(d, M, y, h, m, s);
}
