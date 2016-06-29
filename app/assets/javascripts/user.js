function setupUser() {

  User = function() {
    // Initialize attributes.
    this.id = null;
    this.email = null;
    this.isLoggedIn = false;

    // Instantiate modals that will be used to show user messages.
    this.modalForm    = new Modal(document.querySelector("#dialog-form"));
    this.modalMessage = new Modal(document.querySelector("#dialog-msg"));
    this.modalReset = new Modal(document.querySelector("#dialog-form-reset"));

    // Configure jToker.
    this.configJtoker(this);
  };

  User.prototype.constructor = User;

  /**
   * Configure jToker.
   */
  User.prototype.configJtoker = function(user) {
    $.auth.configure({
      apiUrl: Rails.config.smartParkingAPI.url,
      storage:'localStorage',

    confirmationSuccessUrl:  function() {
      url = window.location.href + "confirmation_token";
      return url;
    },

    passwordResetSuccessUrl: function() {
      url = window.location.href + "reset_password_token";
      return url;
    }

    })
    .done(function() {
      if ($.auth.user.id) {
        user.id = $.auth.user.id;
        user.isLoggedIn = true;
      }
    });
  };

  /**
   * Sign up.
   */
  User.prototype.doSignUp = function(email, password, password_confirmation) {
    var self = this;

    // - Call jToker helper and set its promises;
    // - Set the message to be displayed; and
    // - Update UI.
    $.auth.emailSignUp({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    })
    .then(function(user) {
      var msg = ["An email was sent to " + user.data.email];
      self.updateLayout(msg, "signup", false);
    })
    .fail(function(resp) {
      var msg = resp.data.errors.full_messages;
      self.updateLayout(msg, "signup", true);
    });
  };

  /**
   * Sign in.
   */
  User.prototype.doSignIn = function(email, password) {
    var self = this;

    // - Call jToker helper and set its promises;
    // - Keep track of user attributes;
    // - Set the message to be displayed; and
    // - Update UI.
    $.auth.emailSignIn({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password
    })
    .then(function(user) {
      self.id = user.data.id;
      self.email = user.data.email;
      self.isLoggedIn = true;
      var msg = ["Successfully signed in as " + user.data.email];
      self.updateLayout(msg, "signin", false);
    })
    .fail(function(resp) {
      var msg = resp.data.errors;
      self.updateLayout(msg, "signin", true);
    });
  };

  /**
   * Sign out.
   */
  User.prototype.doSignOut = function() {
    var self = this;

    // - Call jToker helper and set its promises;
    // - Keep track of user attributes;
    // - Set the message to be displayed; and
    // - Update UI.
    $.auth.signOut()
    .then(function(resp) {
      self.id = null;
      self.isLoggedIn = false;
      var msgs = ["Succesfully signed out"];
      self.updateLayout(msgs, "signout", false);
    })
    .fail(function(resp) {
      var msgs = ["There was an error. Try again."];
      self.updateLayout(msgs, "signout", true);
    });
  };

  /**
   * Reset Password.
   */
  User.prototype.doResetPassword = function(email) {
    var self = this;

    $.auth.requestPasswordReset({email: email})
    .then(function(resp) {
      var msgs = ["Succesfully sent email instructions"];
      self.updateLayout(msgs, "reset", false);
    })
    .fail(function(resp) {
      var msgs = ["Use the email field to type in your email correctly"];
      self.updateLayout(msgs, "reset", true);
    });
  };

  /**
   * Update Password.
   */
  User.prototype.doUpdatePassword = function(password, password_confirmation) {
    var self = this;

    $.auth.updatePassword({
      password: password,
      password_confirmation: password_confirmation
    })
    .then(function(resp) {
      var msgs = ["Succesfully updated your password"];
      self.updateLayout(msgs, "update", false);
    })
    .fail(function(resp) {
      var msg = resp.data.errors.full_messages;
      self.updateLayout(msg, "reset", true);
    });
  };

  /**
   * Show error and success messages.
   */
  User.prototype.updateLayout = function (msgs, condition, error){
    var msg = "";

    // In case error messages are more than one
    // break messages array into <li> elements.
    $.each(msgs, function(index,value){
      if (msgs.length > 1){
        msg += "<li>" + value + "</li>";
      } else {
        msg += value;
      }
    });

    // Change color of the message.
    if (error) {
      $(".panel-msg").removeClass("panel-success");
      $(".panel-msg").addClass("panel-error");
    } else {
      $(".panel-msg").addClass("panel-success");
      $(".panel-msg").removeClass("panel-error");
    }

    // Treat different events (signup / signin / signout).
    // For each one hide what user should not see, show what it should,
    // and display the pertinent message.
    switch (condition) {
      // Sign in
      // Upon sucess: show message on a modal and close the form,
      // hide Login/Register link and show Signout link.
      // Upon failure: show message on the form panel.
      case "signin":
        if (!error){
          this.modalForm.hide();
          $(".user-id").html("Logged in as " + this.email);
          $("#link-signin").hide();
          $("#link-signout").show();
          this.modalMessage.show(msg);
        } else {
          $("#panel-signin > .panel-msg").html(msg);
        }
        break;
      // Sign out
      // Upon sucess: Show message on a modal,
      // hide Signout link and show Login/Register link.
      // Upon failure: Show message on a modal.
      case "signout":
        if (!error){
          $(".user-id").html("Not Logged In");
          $("#link-signin").show();
          $("#link-signout").hide();
        }
        this.modalMessage.show(msg);
        break;
      // Sign up
      // Upon sucess and failure: show message
      // on form panel.
      default:
        $(".panel-msg").html(msg);
        break;
    }
  };

}

/**
 * Setup event listeners.
 */
$(function () {

  $("#form-signin").submit(function(event){
    event.preventDefault();
    var inputs = $("#form-signin").serializeArray();
    currentUser.doSignIn(inputs[0].value,inputs[1].value);
  });

  $("#form-signup").submit(function(event){
    event.preventDefault();
    var inputs = $("#form-signup").serializeArray();
    currentUser.doSignUp(inputs[0].value,inputs[1].value,inputs[2].value);
  });

  $("#form-reset").submit(function(event){
    event.preventDefault();
    var inputs = $("#form-reset").serializeArray();
    currentUser.doUpdatePassword(inputs[0].value,inputs[1].value);
  });

  // Open sign in form.
  $("#link-signin").click(function() {
    $(".panel-msg").html("");
    currentUser.modalForm.show();
  });

  // When user selects the signin tab inside the signin form:
  // - Hide password confirmation field;
  // - Hide sign up button;
  // - Show signin button; and
  // - Clear the panel where error messages appear.
  $("#tab-signin").click(function() {
    $("#password-confirm-field").hide(400);
    $("#form-btn-signup").hide();
    $("#form-btn-signin").show(400);
    $(".panel-msg").html("");
  });

  // When user selects the sign up tab inside the sign up form:
  // - Show password confirmation field;
  // - Show sign up button;
  // - Hide signin button; and
  // - Clear the panel where error messages appear
  $("#tab-signup").click(function() {
    $("#password-confirm-field").show(400);
    $("#form-btn-signin").hide();
    $("#form-btn-signup").show(400);
    $(".panel-msg").html("");
  });

  // When the user clicks on the reset password link:
  // - Try to perform reset password.
  $("#link-reset-password").click(function() {
    email = $("input[name='email']").val();
    currentUser.doResetPassword(email);
  });

  // When the user clicks on the signout link:
  // - Try to perform sign up.
  $("#link-signout").click(function() {
    currentUser.doSignOut();
  });

});
