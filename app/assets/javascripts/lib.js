/**
 * Utilities methods.
 */

Utils = {

  /**
   * Capitalizes a string (converts the first letter of each word to uppser
   * case).
   */
  capitalize: function(str) {
    return str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
      return letter.toUpperCase();
    });
  }
};
