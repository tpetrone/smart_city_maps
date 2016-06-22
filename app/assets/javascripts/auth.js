/**
 * Login form
 */
function showLoginForm(elementDialog) {
  var modal_form = new Modal(elementDialog);
  modal_form.show();

}

/**
 * Setup event listeners.
 */
$(function () {
  $("#link-auth").click(function() {
    var elementDialog = document.querySelector("#dialog-form");
    showLoginForm(elementDialog);
  });

  $("#signup").click(function() {
    $("#pass_confirmation").show(400);
  });

  $(".close").click(function() {
    $("#pass_confirmation").hide();
  });
});