function Modal(elementDialog) {

  var self = this;
  this.elementDialog = elementDialog;
  this.dialogContent = $("#" + elementDialog.id + "> .mdl-dialog__content > p");
  this.isVisible = false;

  this.show = function(msg) {
    if (msg){
      this.dialogContent.html(msg);
    }
    this.elementDialog.showModal();
    this.isVisible = true;
  };

  this.hide = function() {
    if (this.isVisible) {
      this.elementDialog.close();
      this.isVisible = false;
    }
  };

  // Modal dialog button click handler
  $('.close').bind('click', function(event) {
    self.hide();
  });
}
