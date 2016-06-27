function setupUser() {

  User = function() {
    // Initialize attributes.
    this.id = null;
    this.isLoggedIn = false;

    // Instantiate modals that will be used to show user messages.
    this.modal_form = new Modal(document.querySelector("#dialog-form"));
    this.modal_msg = new Modal(document.querySelector("#dialog-msg"));

    // Configure jToker.
    this.configJtoker();
  };

  User.prototype.constructor = User;

  /**
   * Configure jToker.
   */
  User.prototype.configJtoker = function() {
    $.auth.configure({
      apiUrl: Rails.config.smartParkingAPI.url,
      storage:'localStorage'
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
      msg = ["An email was sent to " + user.data.email];
      self.updateLayout(msg, "signup", false);
    })
    .fail(function(resp) {
      msg = resp.data.errors.full_messages;
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
      // REVIEW: can we remove this?
      console.log(user);
      self.id = user.data.id;
      self.isLoggedIn = true;
      msg = ["Successfully logged in as " + user.data.email];
      self.updateLayout(msg, "signin", false);
    })
    .fail(function(resp) {
      msg = resp.data.errors;
      self.updateLayout(msg, "signin", true);
    });
  };

  /**
   * Sign out.
   */
  User.prototype.doSignOut = function() {
    var self = this;

    // Append token to data payload via ajaxSetup since jToker
    // does not allow.
    // REVIEW: does not allow...?
    $.ajaxSetup({
      // REVIEW: use our default style of declaring objects.
      data: { "token" : Rails.config.smartParkingAPI.token }
    });

    // - Call jToker helper and set its promises;
    // - Keep track of user attributes;
    // - Set the message to be displayed; and
    // - Update UI.
    $.auth.signOut()
    .then(function(resp) {
      self.id = null;
      self.isLoggedIn = false;
      msgs = ["Succesfully signed out"];
      self.updateLayout(msgs, "signout", false);
    })
    .fail(function(resp) {
      msgs = ["There was an error. Try again."];
      self.updateLayout(msgs, "signout", true);
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
      $("#panel").removeClass("panel-success");
      $("#panel").addClass("panel-error");
    } else {
      $("#panel").addClass("panel-success");
      $("#panel").removeClass("panel-error");
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
          this.modal_form.hide();
          $("#link-signin").hide();
          $("#link-signout").show();
          this.modal_msg.show(msg);
        } else {
          $("#panel").html(msg);
        }
        break;
      // Sign out
      // Upon sucess: Show message on a modal,
      // hide Signout link and show Login/Register link.
      // Upon failure: Show message on a modal.
      case "signout":
        if (!error){
          $("#link-signin").show();
          $("#link-signout").hide();
        }
        this.modal_msg.show(msg);
        break;
      // Sign up
      // Upon sucess and failure: show message
      // on form panel.
      case "signup":
        $("#panel").html(msg);
        break;
    }
  };
}

/**
 * Setup event listeners.
 */
$(function () {

  // Open sign in form.
  $("#link-signin").click(function() {
    $("#panel").html("");
    current_user.modal_form.show();
  });

  // When user selects the login tab inside the login form:
  // - Hide password confirmation field;
  // - Hide sign up button;
  // - Show login button; and
  // - Clear the panel where error messages appear.
  $("#tab-login").click(function() {
    // REVIEW: change pass_confirmation to password_confirmation.
    $("#pass_confirmation").hide(400);
    $("#form-btn-signup").hide();
    $("#form-btn-login").show(400);
    $("#panel").html("");
  });

  // When user selects the sign up tab inside the sign up form:
  // - Show password confirmation field;
  // - Show sign up button;
  // - Hide login button; and
  // - Clear the panel where error messages appear
  $("#tab-signup").click(function() {
    $("#pass_confirmation").show(400);
    $("#form-btn-login").hide();
    $("#form-btn-signup").show(400);
    $("#panel").html("");
  });

  // When the user clicks on login button:
  // - Fetch text fields infos and try to perform login.
  $("#form-btn-login").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    current_user.doSignIn(email, password);
  });

  // When the user clicks on the signup button:
  // - Fetch text fields infos and try to perform sign up.
  $("#form-btn-signup").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    var password_confirmation = $("#txt-conf").val();
    current_user.doSignUp(email, password, password_confirmation);
  });

  // When the user clicks on the signout link:
  // - Try to perform sign up.
  $("#link-signout").click(function() {
    current_user.doSignOut();
  });
});
