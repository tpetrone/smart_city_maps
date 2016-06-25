  function setupUser(){

  User = function(){
    // Initialize attribute
    this.id = null;
    this.isLoggedIn = false;

    // Instatiate modals will be used to show related messages
    this.modal_form = new Modal(document.querySelector("#dialog-form"));
    this.modal_msg = new Modal(document.querySelector("#dialog-msg"));


    // Perform J-toker configuration on User creation
    this.configJtoker();
  };

  User.prototype.constructor = User;


  // Method to configure J-Toker
  User.prototype.configJtoker = function(){
    $.auth.configure({
      apiUrl: Rails.config.smartParkingAPI.url,
      storage:'localStorage'
    });
  };

  // Method to perform SignUp
  User.prototype.doSignUp = function(email,password,password_confirmation){
    var self = this;

    // Call J-Toker helper and set its promises
    // Sets the message to be displayed
    // Update User interface
    $.auth.emailSignUp({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    })
    .then(function(user) {
      msg = ["An email was sent to " + user.data.email];
      self.updateLayout(msg,"signup",false);
    })
    .fail(function(resp) {
      msg = resp.data.errors.full_messages;
      self.updateLayout(msg,"signup",true);
    });
  };

  // Method to perform SignIn
  User.prototype.doSignIn = function(email,password) {
    var self = this;

    // Call J-Toker helper and set its promises
    // Keep track of user attributes
    // Sets the message to be displayed
    // Update User interface
    $.auth.emailSignIn({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password
    })
    .then(function(user) {
      console.log(user);
      self.id = user.data.id;
      self.isLoggedIn = true;
      msg = ["Succesful logged in as " + user.data.email];
      self.updateLayout(msg,"signin",false);
    })
    .fail(function(resp) {
      msg = resp.data.errors;
      self.updateLayout(msg,"signin",true);
    });
  };

  // Method to perform SignOut
  User.prototype.doSignOut = function() {
    var self = this;

    // Append token to data payload via ajaxSetup since J-Toker
    // does not allow.
    $.ajaxSetup({
       data: { "token" : Rails.config.smartParkingAPI.token }
    });

    // Call J-Toker helper and set its promises
    // Keep track of user attributes
    // Sets the message to be displayed
    // Update User interface
    $.auth.signOut()
    .then(function(resp) {
      self.id = null;
      self.isLoggedIn = false;
      msgs = ["Succesfully Signout"];
      self.updateLayout(msgs,"signout",false);
    })
    .fail(function(resp) {
      msgs = ["There was an error. Try again."];
      self.updateLayout(msgs,"signout",true);
    });
  };

  // Method to update user interface SignOut
  User.prototype.updateLayout = function (msgs,condition,error){
    var msg = "";

    // In case error messages are more than one
    // break messages Array in <li> elements
    $.each(msgs, function(index,value){
      if (msgs.length > 1){
        msg += "<li>" + value + "</li>";
      }else{
        msg += value;
      }
    });

    // Change color of the message
    if (error){
      $("#panel").removeClass("panel-success");
      $("#panel").addClass("panel-error");
    }else{
      $("#panel").addClass("panel-success");
      $("#panel").removeClass("panel-error");
    }

    // Treat different events (signup / signin / signout).
    // For each one hide what user should not see, show what it should,
    // and display the pertinent message
    switch(condition) {
      // SignIn
      // Upon sucess: show message on a modal and close the form,
      // hide Login/Register link and show Signout link.
      // Upon failure: show message on the form panel.
      case "signin":
        if (!error){
          this.modal_form.hide();
          $("#link-signin").hide();
          $("#link-signout").show();
          this.modal_msg.show(msg);
        }else{
          $("#panel").html(msg);
        }
        break;
      // SignOut
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
      // SignUp
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

  // Open Login form
  $("#link-signin").click(function() {
    $("#panel").html("");
    current_user.modal_form.show();
  });

  // When user selects Login tab inside Login form
  // Hide password confirmation field
  // Hide Signup button
  // Show Login button
  // Clear the panel where error messages appear
  $("#tab-login").click(function() {
    $("#pass_confirmation").hide(400);
    $("#form-btn-signup").hide();
    $("#form-btn-login").show(400);
    $("#panel").html("");
  });

  // When user selects Signup tab inside Signup form
  // Show password confirmation field
  // Show Signup button
  // Hide Login button
  // Clear the panel where error messages appear
  $("#tab-signup").click(function() {
    $("#pass_confirmation").show(400);
    $("#form-btn-login").hide();
    $("#form-btn-signup").show(400);
    $("#panel").html("");
  });

  // When user click on login button
  // Fetch text fields infos and try to perform Login
  $("#form-btn-login").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    current_user.doSignIn(email,password);
  });

  // When user click on signup button
  // Fetch text fields infos and try to perform Signup
  $("#form-btn-signup").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    var password_confirmation = $("#txt-conf").val();
    current_user.doSignUp(email,password,password_confirmation);
  });

  // When user click on signout link
  // Try to perform Signup
  $("#link-signout").click(function() {
    current_user.doSignOut();
  });
});