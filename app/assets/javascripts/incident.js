function Incident(){

CATEGORIES = {
  'wrong adress': 'location_off',
  'wrong schedule': 'restore',
  'wrong price': 'info_outline',
  'good': 'thumb_up'
};

  function refreshLastComment(obj){
    if (obj != null){
      $('div#comment').html('<span><strong>' + obj.attributes.description + '</strong></span>');
      var icon = (obj.attributes.category == null) ? 'thump_up': CATEGORIES['wrong schedule'];
      $('div#category').html('<i class="small material-icons">' + icon + '</i><span><strong>' + obj.attributes.category +'</strong></span>');
    }
  }

  this.lastComment = function(spot_id) {
    $("#incident-controls").show();
    return $.get(Rails.config.smartParkingAPI.url + "/incidents/show", {
      token: Rails.config.smartParkingAPI.token,
      spot: spot_id
    }).done(function(response) {
      obj=response.data[0];
      refreshLastComment(obj);
      console.log("done!");
    }).fail(function() {
      console.log("error");
    });
  };

  this.submitComment=function(spot_id){
    return $.post(Rails.config.smartParkingAPI.url + "/incidents", {
      token: Rails.config.smartParkingAPI.token, incident: {
      user: 1,
      spot: spot_id,
      category: $( "#incident-option" ).val(),
      description: $( "#comment-input" ).val()}
    }).done(function(response) {
      $( "#comment-input" ).val("");
      obj=response.data[0];
      refreshLastComment(obj);
    }).fail(function() {
      console.log("error");
    });
  };
}