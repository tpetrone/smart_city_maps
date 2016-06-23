function setupUser(){

  User = function(){
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

  User.prototype.doLogin = function(email,password) {
    var self = this;
    this.configRoot();

    $.auth.emailSignIn({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password
    })
    .then(function(resp) {
      console.log(resp);
      // msg = handleAuthSuccess(msg);
      // updatePanel(msg, success)
      self.isLoggedIn = true;
    })
    .fail(function(resp) {
      msg = resp.data.errors;
      self.updatePanel(msg, "error");
    });
  };

  User.prototype.doSignup = function(email,password,password_confirmation) {
    var self = this;
    this.configRoot();

    $.auth.emailSignUp({
      token: Rails.config.smartParkingAPI.token,
      email: email,
      password: password,
      password_confirmation: password_confirmation
    })
    .then(function(user) {
      console.log(user);
      email = user.data.email;
      msg = ["An email was sent to " + email];
      this.updatePanel(msg, "success");
    })
    .fail(function(resp) {
      msg = resp.data.errors.full_messages;
      self.updatePanel(msg, "error");
    });
  };

  User.prototype.updatePanel = function (msgs, condition){
    var msg = "";
    $.each(msgs, function(index,value){
      msg += "<li>" + value + "</li>";
    });
    if (condition == 'error'){
      $("#panel").removeClass("panel-success");
      $("#panel").addClass("panel-error");
    }else{
      $("#panel").addClass("panel-success");
      $("#panel").removeClass("panel-error");
    }
    $("#panel").html(msg);
  };
}

/**
 * Setup event listeners.
 */
$(function () {
  $("#link-auth").click(function() {
    var elementDialog = document.querySelector("#dialog-form");
    var modal_form = new Modal(elementDialog);
    modal_form.show();
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
    current_user.doLogin(email,password);
  });

  $("#form-btn-signup").click(function() {
    var email = $("#txt-email").val();
    var password = $("#txt-pass").val();
    var password_confirmation = $("#txt-conf").val();
    current_user.doSignup(email,password,password_confirmation);
  });
});