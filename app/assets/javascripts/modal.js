function Modal(){

 var dialog_loader = document.querySelector('#dialog-loader');
 var dialog_msg = document.querySelector('#dialog-msg');
 var dialogContent = $('.mdl-dialog__content>p');
 var self = this;
 var loaderFlag = false;

 this.showLoader = function(){
  dialog_loader.showModal();
  loaderFlag = true;
 };


 this.hideLoader = function(){
  loaderFlag = false;
  dialog_loader.close();
 };

 this.showMsg = function(msg){
  dialogContent.html(msg);
 dialog_msg.showModal();
  msgFlag = true;
 };

 this.hideMsg = function(){
  if(msgFlag){dialog_msg.close();}
  msgFlag = false;
 };

 this.isMsgActive = function(){
  return msgFlag;
 };

 //Modal dialog button click handler
 dialogButton.addEventListener('click', function(event) {
  self.hideMsg();
 });

}