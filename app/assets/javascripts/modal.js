function Modal(elementDialog) {

  var self = this;
  this.elementDialog = elementDialog;
  this.dialogContent = $("#" + elementDialog.id + "> .mdl-dialog__content > p");
  this.isVisible = false;

  // Detect Chrome Browser
  this.isChrome = /Chrome/i.exec(navigator.userAgent);

  this.show = function(msg) {
    if (msg){
      this.dialogContent.html(msg);
    }
    this.isVisible = true;

    // Check browser compatibiliy before showing modal programmatically
    try {
      this.elementDialog.showModal();
    } catch(err) {
      console.log("Can't close the <dialog>. Your browser is not supported =(");
    }
  };

  this.hide = function() {
    if (this.isVisible) {
      this.isVisible = false;
    }
    // Check browser compatibiliy before closing modal programmatically
    try {
      this.elementDialog.close();
    } catch(err) {
      console.log("Can't close the <dialog>. Your browser is not supported =(");
    }
  };
}

$(function () {
  // Modal dialog button click handler
  $('.close-msg').bind('click', function(event) {
    try {
      current_user.modal_msg.hide();
      document.querySelector("#dialog-msg").close();
    }
    catch(err) {
      console.log("Sorry. Your browser is not supported =(");
    }
  });

  // Modal dialog button click handler
  $('.close-form').bind('click', function(event) {
    try {
      document.querySelector("#dialog-form").close();
    }
    catch(err) {
      console.log("Sorry. Your browser is not supported =(");
    }
  });
});
