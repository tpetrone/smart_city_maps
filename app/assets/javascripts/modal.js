function Modal(elementDialog) {

  var self = this;
  this.elementDialog = elementDialog;
  this.dialogContent = $("#" + elementDialog.id + "> .mdl-dialog__content > p");
  this.isVisible = false;

  // Detect Chrome Browser
  this.isChrome = /Chrome/i.exec(navigator.userAgent);

  this.show = function(msg) {
    if (msg) {
      this.dialogContent.html(msg);
    }
    this.isVisible = true;

    // Check browser compatibility before showing modal programmatically
    try {
      this.elementDialog.showModal();
    } catch(err) {
      // REVISIT: maybe display a notification when this happens? Do this for
      // the two other occurrences below too.
      console.log("Can't show <dialog>. Your browser is not supported.");
    }
  };

  this.hide = function() {
    if (this.isVisible) {
      this.isVisible = false;
    }
    // Check browser compatibility before closing modal programmatically
    try {
      this.elementDialog.close();
      return true;
    } catch(err) {
      console.log("Can't close the <dialog>. Your browser is not supported.");
      return false;
    }
  };
}

$(function () {

  /**
   * Try to close a dialog.
   */
  function closeDialog(selector) {
    try {
      document.querySelector(selector).close();
    }
    catch(err) {
      console.log("Can't close the <dialog>. Your browser is not supported.");
    }
  }

  // Close dialog message on click.
  $('.close-msg').bind('click', function(event) {
    if (!currentUser.modalMessage.hide()) {
      // Only use this method of closing the dialog if the call
      // to hide() didn't succeed.
      closeDialog("#dialog-msg");
    }
  });

  // Close dialog message on click.
  $('.close-reset').bind('click', function(event) {
    if (!currentUser.modalReset.hide()) {
      // Only use this method of closing the dialog if the call
      // to hide() didn't succeed.
      closeDialog("#dialog-form-reset");
    }
  });

  // Close dialog form on click.
  $('.close-form').bind('click', function(event) {
    closeDialog("#dialog-form");
  });
});
