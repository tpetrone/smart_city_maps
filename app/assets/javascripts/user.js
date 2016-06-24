  function setupUser(){

  User = function(){
    this.modal_form = new Modal(document.querySelector("#dialog-form"));
    this.modal_msg = new Modal(document.querySelector("#dialog-msg"));
    this.isLoggedIn = false;
    this.email = "";
    this.id = "";
    this.token = "";
  };

  User.prototype.constructor = User;

  User.prototype.configRoot = function(){
    $.auth.configure({
      apiUrl: Rails.config.smartParkingAPI.url,
      storage:'localStorage'
    });
  };

  User.prototype.doSignUp = function(email,password,password_confirmation) {
    var self = this;
    this.configRoot();

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

  User.prototype.doSignIn = function(email,password) {
    var self = this;
    this.configRoot();

    $.auth.emailSignIn({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password
    })
    .then(function(user) {
      self.isLoggedIn = true;
      msg = ["Succesful logged in as " + user.data.email];
      self.updateLayout(msg,"signin",false);
    })
    .fail(function(resp) {
      msg = resp.data.errors;
      self.updateLayout(msg,"signin",true);
    });
  };


  User.prototype.doSignOut = function() {
    var self = this;
    this.configRoot();

    // Append token to data payload via ajaxSetup since J-Toker
    // does not allow.
    $.ajaxSetup({
       data: { "token" : Rails.config.smartParkingAPI.token }
    });

    $.auth.signOut()
    .then(function(resp) {
      console.log(resp);
      self.isLoggedIn = false;
      msgs = ["Succesfully Signout"];
      self.updateLayout(msgs,"signout",false);
    })
    .fail(function(resp) {
      msgs = ["There was an error. Try again."];
      self.updateLayout(msgs,"signout",true);
    });
  };

  User.prototype.updateLayout = function (msgs,condition,error){
    var msg = "";
    // Break messages Array in <li> elements
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

    switch(condition) {
      case "signin":
        if (!error){
          this.modal_form.hide();
          $("#link-signin").hide();
          $("#link-signout").show();
          // Show respective message
          this.modal_msg.show(msg);
        }
        break;
      case "signout":
        if (!error){
          $("#link-signin").show();
          $("#link-signout").hide();
          this.modal_msg.show(msg);
        }
        break;
      case "signup":
        // Show respective message
        $("#panel").html(msg);
        break;
    }
  };
}

/**
 * Setup event listeners.
 */
$(function () {
  $("#link-signin").click(function() {
    $("#panel").html("");
    current_user.modal_form.show();
  });

  $("#tab-login").click(function() {
    $("#pass_confirmation").hide(400);
    $("#form-btn-signup").hide();
    $("#form-btn-login").show(400);
    $("#panel").html("");
  });

  $("#tab-signup").click(function() {
    $("#pass_confirmation").show(400);
    $("#form-btn-login").hide();
    $("#form-btn-signup").show(400);
    $("#panel").html("");
  });

  $("#form-btn-login").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    current_user.doSignIn(email,password);
  });

  $("#form-btn-signup").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    var password_confirmation = $("#txt-conf").val();
    current_user.doSignUp(email,password,password_confirmation);
  });

  $("#link-signout").click(function() {
    current_user.doSignOut();
  });
});