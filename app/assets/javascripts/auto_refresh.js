$(function () {
  var refresh;
  $("#switch-1, #time-slider").on('click', function(){
    if($("#switch-1").prop('checked') == true){
      time = $("#time-slider").prop("value")* 1000;
      clearInterval(refresh);
      refresh = setInterval(function(){
        get_spots(map);
        }
      , time);
    }else{
      clearInterval(refresh);
    }
  });
});