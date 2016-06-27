exports.spec = function(casper, test, other) {
  casper.then(function() {
    console.log(other.colorizer.colorize("Test file: _user_spec.js", "INFO_BAR"));
    var map = casper.evaluate(function() {
      return window.map;
    });
    test.assert(typeof(map) === "object", "Map is loaded");
  });

  /**
   * Fill in Login Form with wrong credentials
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Begining of SignUp test");
    console.log("***");
    casper.evaluate(function() {
      $("#link-signin").click();
      $("#tab-signup").click();
      $("#txt-email").val("user@not-valid.com");
      $("#form-btn-signup").click();
    });
  });

  /**
   * Wait for results and
   * perform assertions.
   */
  casper.wait(1000, function() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert if Modal is shown
    status = casper.evaluate(function() {
      return current_user.modal_form.isVisible;
    });
    test.assertEquals(status, "true", "Form successfully shown");

    // Assert error message
    var error_msg = casper.evaluate(function() {
      return $("#panel").html()[0];
    });
    test.assertEquals(error_msg, "<", "The user could not SignUp");
  });

  /**
   * Fill in Login Form with RIGHT credentials
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("#txt-email").val("user@valid.com");
      $("#form-btn-signup").click();
    });
  });

  /**
   * Wait for results and
   * perform assertions.
   */
  casper.wait(1000, function() {
    console.log("*** Successful case assertions ***");
    // Assert error msg on panel
    var error_msg = casper.evaluate(function() {
      return $("#panel").html()[0];
    });
    test.assertEquals(error_msg, "A", "The user Signed Up successfuly");
  });

  /**
   * Fill in Login Form with wrong credentials
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Begining of SignIn tests ***");
    console.log("***");
    casper.evaluate(function() {
      $("#tab-login").click();
      $("#txt-email").val("user@not-valid.com");
      $("#form-btn-login").click();
    });
  });

  /**
   * Wait for results and
   * perform assertions
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return current_user.isLoggedIn;
    });
  }, function then() {}, function timeout() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert user status
    var status = casper.evaluate(function() {
      return current_user.isLoggedIn;
    });

    // Assert error message on the panel
    test.assertEquals(status, false, "The user could not login");
    var error_msg = casper.evaluate(function() {
      return $("#panel").html()[0];
    });
    test.assertEquals(error_msg, "I", "Error messages shown correctly");
  }, 2000);


  /**
   * Fill in Login Form with right credentials
   */
  casper.then(function() {
    casper.evaluate(function() {
      $("#txt-email").val("user@valid.com");
      $("#form-btn-login").click();
    });
  });

  /**
   * Wait for results.
   */
  casper.waitFor(function() {
    return casper.evaluate(function() {
      return current_user.isLoggedIn;
    });
  // Perform Assertions.
  }, function then() {
    console.log("*** Successful case assertions ***");
    var status = casper.evaluate(function() {
      return current_user.isLoggedIn;
    });
    test.assertEquals(status, true, "User successfully logged in");

    // Assert if Modal is closed
    var isVisible = casper.evaluate(function() {
      $(".close-form").click();
      return current_user.modal_form.isVisible;
    });
    test.assertEquals(isVisible, false, "Form successfully hidden");

    // Assert success message
    var msg = casper.evaluate(function() {
      return $("#dialog-msg > .mdl-dialog__content > p").html()[0];
    });
    test.assertEquals(msg, "S", "Success messages shown correctly");

    // Assert modal closed
    isVisible = casper.evaluate(function(){
      $(".close-msg").click();
      return current_user.modal_msg.isVisible;
      });
    test.assertEquals(isVisible, false, "Message successfully hidden");

  }, function timeout() {}, 2000);



  /**
   * Click on the Menu.
   */
  casper.then(function() {
    console.log("***");
    console.log("*** Begining of SignOut tests ***");
    console.log("***");
    casper.evaluate(function() {
      $("#link-signout").click();
    });
  });

  casper.wait(1000, function() {
    console.log("*** Successful case assertions ***");
    // Assert user status
    status = casper.evaluate(function() {
      return current_user.isLoggedIn;
    });
    test.assertEquals(status, "false", "User successful logged out");

    // Assert modal appearence
    modal = casper.evaluate(function() {
      return current_user.modal_msg.isVisible;
    });
    test.assertEquals(modal, true, "Modal is opened");

    // Assert success message
    var msg = casper.evaluate(function() {
      return $("#dialog-msg > .mdl-dialog__content > p").html()[0];
    });
    test.assertEquals(msg, "S", "Success message shown correctly");
  });

  /**
   * Insert Error parameter to force unsuccessful Sign Out
   */
  casper.then(function() {
    casper.evaluate(function() {
      $.ajaxSetup({
       data: { "error" : "error" }
      });
      $("#link-signout").click();
    });
  });

  /**
   * Perform assertions.
   */
  casper.then(function() {
    console.log("*** Unsuccessful case assertions ***");
    // Assert error message
    var error_msg = casper.evaluate(function() {
      return $("#dialog-msg > .mdl-dialog__content > p").html()[0];
    });
    test.assertEquals(error_msg, "T", "Error messages shown correctly");
  });
};
