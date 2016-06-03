function Modal() {

  var dialogLoader = document.querySelector("#dialog-loader");
  var dialogMsg = document.querySelector("#dialog-msg");
  var dialogContent = $(".mdl-dialog__content > p");
  var self = this;
  var isVisible = false;
  var isMsgVisible = false;

  this.showLoader = function() {
    dialogLoader.showModal();
    isVisible = true;
  };

  this.hideLoader = function() {
    if (isVisible) {
      dialogLoader.close();
      isVisible = false;
    }
  };

  this.showMsg = function(msg) {
    dialogContent.html(msg);
    dialogMsg.showModal();
    isMsgVisible = true;
  };

  this.hideMsg = function() {
    if (isMsgVisible) {
      dialogMsg.close();
      isMsgVisible = false;
    }
  };

  // Modal dialog button click handler
  $('#dialog-button')[0].addEventListener('click', function(event) {
    self.hideMsg();
  });
}
