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
   * Display a message with a longer timeout.
   */
  this.showAndWait = function(msg) {
    self.show(msg, 120000);
  }

  /**
   * Display a generic message to the user using Material Design's snackbar
   * component.
   */
  this.show = function(msg, timeout) {
    var data = {
      message: msg,
      timeout: timeout || self.snackbarContainer.timeout_
    };
    self.snackbarContainer.MaterialSnackbar.showSnackbar(data);
  }

  /**
   * Hide all current and enqueued toasts.
   */
  this.hideAll = function() {
    self.snackbarContainer.MaterialSnackbar.cleanup_();
  };
});

/**
 * Perform activities on page load.
 */
$(function() {
  NotificationCenter.snackbarContainer = document.querySelector('#demo-toast-example');
})
