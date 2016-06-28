/**
 * An object that contain methods to communicate events to the user.
 */
NotificationCenter = new (function() {
  var self = this;

  /**
   * Display an error message to the user.
   * TODO: think about styling the message differently because it's an error.
   */
  this.error = function(msg) {
    self.show(msg);
  }

  /**
   * Display an error message to the user.
   * TODO: think about styling the message differently because it's a success
   * message.
   */
  this.success = function(msg) {
    self.show(msg);
  }

  /**
   * Display a generic message to the user using Material Design's snackbar
   * component.
   */
  this.show = function(msg) {
    var snackbarContainer = document.querySelector('#demo-toast-example');
    var data = {
      message: msg
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }
});
