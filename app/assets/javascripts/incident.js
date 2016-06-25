function Incident(){

CATEGORIES_ICONS = {
  0: 'assignment_late',
  1: 'location_off',
  2: 'restore',
  3: 'info_outline'
};

CATEGORIES = {
  0: 'Other',
  1: 'Incorrect address',
  2: 'Wrong schedule',
  3: 'Different price'
};

var user_id=1;

  function refreshLastComment(obj){
    $("#incident-controls").show();
    if (obj !== null){
      $('div#show-occurence').show();
      $('div#comment').html('<span>' + obj.attributes.comment + '</span>');
      var icon = CATEGORIES_ICONS[obj.attributes.category];
      $('div#category').html('<i class="small material-icons">' + icon + '</i><span><strong>' + CATEGORIES[obj.attributes.category] +'</strong></span>');
      $('div#user').html('<i class="small material-icons">person</i><span><strong>' + obj.attributes.name_user + '</strong></span>');
      $('div#time').html('<span>' + obj.attributes.time_last_comment + '</span>');
    }
    else{
      $('div#show-occurence').hide();
      $('div#category').html('<i class="small material-icons">done</i>');
    }
  }

  this.lastComment = function(spot_id) {
    return $.get(Rails.config.smartParkingAPI.url + "/incidents/last", {
      token: Rails.config.smartParkingAPI.token,
      spot: spot_id
    }).done(function(response) {
      obj = response.data[0];
      refreshLastComment(obj);
      console.log("done!");
    }).fail(function() {
      console.log("error");
    });
  };

  this.submitComment=function(spot_id){
    return $.post(Rails.config.smartParkingAPI.url + "/incidents", {
      token: Rails.config.smartParkingAPI.token, incident: {
      user: user_id,
      spot: spot_id,
      category: $( "#incident-option" ).val(),
      comment: $( "#comment-input" ).val()}
    }).done(function(response) {
      $( "#comment-input" ).val("");
    }).fail(function() {
      console.log("error");
    });
  };
}