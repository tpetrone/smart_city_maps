/*jshint esversion: 6 */
function Modal(elementDialog) {

  var self = this;
  this.elementDialog = elementDialog;
  this.dialogContent = $("#" + elementDialog.id + "> .mdl-dialog__content > p");
  this.isVisible = false;

  this.show = function(msg = null) {
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
  $('#dialog-button')[0].addEventListener('click', function(event) {
    self.hide();
  });
}
