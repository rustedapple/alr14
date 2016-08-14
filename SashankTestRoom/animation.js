"use strict";
var animation = {
   "load" : function () {
      var i = 0, j = 0;
      document.getElementById("grid").innerHTML = createGridHtml();
      $("#gridsquare").each(function (index) {
         var i = index % NUM_COLUMNS;
         var j = index / NUM_COLUMNS;
         var gridObject = Grid.createGridObject(i,j);
         $(this).data(gridObject);
      });
   },
   "run" : function ()
   {
   }
};

var NUM_ROWS = 50;
var NUM_COLUMNS = 50;
var mGrid = [];

var Grid = {
   "createGridObject" : function (i, j) {
      var gridObject = {
         "i" : i,
         "j" : j,
         "brightness" : 0,
         "top" : null,
         "right" : null,
         "bottom" : null,
         "left" : null,
      };
      if (mGrid[i] == null) {
         mGrid[i] = [];
      }
      mGrid[i][j] = gridObject;
      return gridObject;
   },
   "getSquare" : function (i, j) {
      return mGrid[i][j];
   }
};


var createGridHtml = function () {
   var i, j, result = "";
   for (i = 0; i < NUM_COLUMNS; i++) {
      result += "<div>";
      for (j = 0; j < NUM_ROWS; j++) {
         result += '<div id="gridsquare" class="square" \
            onmouseenter="Square.OnEnter($(this));" \
            onmouseleave="Square.OnLeave($(this));" \
         ></div>\n';
      }
      result += "</div>";
   }
   return result;
};

var Square = {
   "OnEnter" : function (div) {
      var gridObject = $(this).data();
      div.css('background-color', 'blue');
   },

   "OnLeave" : function (div) {
      div.css('background-color', 'red');
   },
};
