function CheckIn(spotId, userId){

  this.spotId = spotId;
  this.userId = userId;

  this.saveCheckIn = function(){
     Spot.checkin(this.spotId, this.userId);
  };
}
