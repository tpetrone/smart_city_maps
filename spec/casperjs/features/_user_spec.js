exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _user_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Fill in login form with wrong credentials.
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Beginning of SignUp test");
    console.log("***");
    casper.evaluate(function() {
      $("#link-signin").click();
      $("#tab-signup").click();
      $("input[name='email']").val("user@not-valid.com");
      $("#form-btn-signup").click();
    });
  });

  /**
   * Wait for results and perform assertions.
   */
  casper.wait(2000, function() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert if Modal is shown
    status = casper.evaluate(function() {
      return currentUser.modalForm.isVisible;
    });
    test.assertEquals(status, "true", "Form successfully shown");

    // Assert error message
    var error_msg = casper.evaluate(function() {
      return $("#panel-signup > .panel-msg").html()[0];
    });
    test.assertEquals(error_msg, "<", "The user could not sign up");
  });

  /**
   * Fill in login form with right credentials.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("input[name='email']").val("user@valid.com");
      $("#form-btn-signup").click();
    });
  });

  /**
   * Wait for results and perform assertions.
   */
  casper.wait(1000, function() {
    console.log("*** Successful case assertions ***");
    // Assert error msg on panel
    var error_msg = casper.evaluate(function() {
      return $("#panel-signup > .panel-msg").html()[0];
    });
    test.assertEquals(error_msg, "A", "The user signed up successfuly");
  });

  /**
   * Fill in login form with wrong credentials.
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Beginning of SignIn tests ***");
    console.log("***");
    casper.evaluate(function() {
      $("#tab-signin").click();
      $("input[name='email']").val("user@not-valid.com");
      $("#form-btn-signin").click();
    });
  });

  /**
   * Wait for results and perform assertions
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return currentUser.isLoggedIn;
    });
  }, function then() {}, function timeout() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert user status
    var status = casper.evaluate(function() {
      return currentUser.isLoggedIn;
    });
    test.assertEquals(status, false, "The user could not login");

    // Assert error message on the panel
    var error_msg = casper.evaluate(function() {
      return $("#panel-signin > .panel-msg").html()[0];
    });
    test.assertEquals(error_msg, "I", "Error messages shown correctly");
  }, 2000);


  /**
   * Fill in Login Form with right credentials
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("input[name='email']").val("user@valid.com");
      $("#form-btn-signin").click();
    });
  });

  /*
   * Wait for results.
  */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return currentUser.isLoggedIn;
    });
  // Perform Assertions.
  }, function then() {
    console.log("*** Successful case assertions ***");
    var status = casper.evaluate(function() {
      return currentUser.isLoggedIn;
    });
    test.assertEquals(status, true, "User successfully signed in");

    // Assert if Modal is closed
    var isVisible = casper.evaluate(function() {
      $(".close-form").click();
      return currentUser.modalForm.isVisible;
    });
    test.assertEquals(isVisible, false, "Form successfully hidden");

    // Assert success message
    var msg = casper.evaluate(function() {
      return $("#dialog-msg > .mdl-dialog__content > p").html()[0];
    });
    test.assertEquals(msg, "S", "Success messages shown correctly");

    // Assert success message
    var email = casper.evaluate(function() {
      return $(".user-id").html()[0];
    });
    test.assertEquals(email, "L", "User email shown correctly");

    // Assert modal closed
    isVisible = casper.evaluate(function(){
      $(".close-msg").click();
      return currentUser.modalMessage.isVisible;
      });
    test.assertEquals(isVisible, false, "Message successfully hidden");

  }, function timeout() {}, 3000);

  /**
   * Click on the menu.
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Beginning of sign out tests ***");
    console.log("***");
    casper.evaluate(function() {
      $("#link-signout").click();
    });
  });

  casper.wait(1000, function() {
    console.log("*** Successful case assertions ***");
    // Assert user status
    status = casper.evaluate(function() {
      return currentUser.isLoggedIn;
    });
    test.assertEquals(status, "false", "User successful logged out");

    // Assert modal appearence
    modal = casper.evaluate(function() {
      return currentUser.modalMessage.isVisible;
    });
    test.assertEquals(modal, true, "Modal is opened");

    // Assert success message
    var msg = casper.evaluate(function() {
      return $("#dialog-msg > .mdl-dialog__content > p").html()[0];
    });
    test.assertEquals(msg, "S", "Success message shown correctly");
  });

  /**
   * Insert error parameter to force unsuccessful sign out.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $.ajaxSetup({
        data: { "error" : 1 }
      });
      $("#link-signout").click();
    });
  });

  /**
   * Perform assertions.
   */
  casper.wait(1000, function() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert error message
    var error_msg = casper.evaluate(function() {
      return $("#dialog-msg > .mdl-dialog__content > p").html()[0];
    });
    test.assertEquals(error_msg, "T", "Error messages shown correctly");
  });



  /**
   * Click on the menu.
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Beginning of reset password tests ***");
    console.log("***");
    casper.evaluate(function() {
      $.ajaxSetup({
        data: { "error" : 1 }
      });
      $("#link-reset-password").click();
    });
  });

  casper.wait(1000, function() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert error message
    var error_msg = casper.evaluate(function() {
      return $(".panel-msg").html()[0];
    });
    test.assertEquals(error_msg, "U", "Error messages shown correctly");
  });

  /**
   * Delete error parameter to force successful reset.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $.ajaxSetup({
        data: { "error" : 0 }
      });
      $("#link-reset-password").click();
    });
  });

  /**
   * Perform assertions.
   */
  casper.wait(1000, function() {
    console.log("*** Successful case assertions ***");

    // Assert success message
    var msg = casper.evaluate(function() {
      return $(".panel-msg").html()[0];
    });
    test.assertEquals(msg, "S", "Success message shown correctly");
  });

  /**
   * Click on the menu.
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Beginning of update password tests ***");
    console.log("***");
    casper.evaluate(function() {
      $.ajaxSetup({
        data: { "error" : 1 }
      });
      $("#form-btn-reset").click();
    });
  });

  casper.wait(1000, function() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert error message
    var error_msg = casper.evaluate(function() {
      return $(".panel-msg").html()[0];
    });
    test.assertEquals(error_msg, "<", "Error messages shown correctly");
  });

  /**
   * Insert error parameter to force unsuccessful sign out.
   */
  casper.then(function() {
    casper.evaluate(function() {
      $.ajaxSetup({
        data: { "error" : 0 }
      });
      $("#form-btn-reset").click();
    });
  });

  /**
   * Perform assertions.
   */
  casper.wait(1000, function() {
    console.log("*** Successful case assertions ***");

    // Assert success message
    var msg = casper.evaluate(function() {
      return $(".panel-msg").html();
    });
    test.assertEquals(msg, "Succesfully updated your password", "Success message shown correctly");
  });
};
