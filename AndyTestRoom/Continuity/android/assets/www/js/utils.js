/**
 * @author       
 * @copyright    2016
 */
"use strict";

var Continuity = window.Continuity || {}; // Namespace

(function() {

  /**
   * A static utility class for common methods.
   *
   */
  Continuity.Utils = {};

  /**
   * Seed from string
   */
  Continuity.Utils.createSeed = function(s) {
    if ( typeof s !== "string" ) {
      return s;
    }

    var nums = 0;
    var i = 0, l = s.length, c;
    for ( i; i < l; i++ ) {
      c = s.charCodeAt(i);
      nums += (c * (31 ^ (i-1)));
    }

    return Math.abs(nums);
  };

})();

