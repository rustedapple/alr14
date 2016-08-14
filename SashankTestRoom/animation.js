"use strict";
var animation = {
   "load" : function () {
      var i = 0, j = 0;
      document.getElementById("grid").innerHTML = Grid.createGridHtml();
      Grid.initializeGrid();
   },
   "run" : function ()
   {
   }
};

var NUM_ROWS = 50;
var NUM_COLUMNS = 50;
var mGrid = [];

var Grid = {
   "createGridHtml" : function () {
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
   },
   
   "initializeGrid" : function () {
      var i, j, gridObject;
      for (i = 0; i < NUM_COLUMNS; i++) {
         mGrid[i] = [];
         for (j = 0; j < NUM_ROWS; j++) {
            mGrid[i][j] = Grid.createGridObject(i,j);
         }
      };
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            gridObject = Grid.getSquare(i,j);
            gridObject.top    = Grid.getSquare(i,j-1);
            gridObject.right  = Grid.getSquare(i+1,j);
            gridObject.bottom = Grid.getSquare(i,j+1);
            gridObject.left   = Grid.getSquare(i-1,j);
         }
      };
      $(".square").each(function (index) {
         i = Math.floor(index % NUM_COLUMNS);
         j = Math.floor(index / NUM_COLUMNS);
         console.log(i + ", " + j);
         gridObject = Grid.getSquare(i,j);
         $(this).data(gridObject); // TODO this does not work so well...
         gridObject.div = $(this);
         
         $(this).css('background-color', 'green');
         gridObject.brightness = (i+j) % 2
         gridObject.render();
      });
   },
   
   "renderGrid" : function () {
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            var gridObject = Grid.getSquare(i,j);
            gridObject.render();
         }
      };
   },
   
   "updateGrid" : function () {
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            var gridObject = Grid.getSquare(i,j);
            gridObject.update();
         }
      };
   },
   
   "createGridObject" : function (i, j) {
      var gridObject = {
         "div" : null,
         "i" : i,
         "j" : j,
         "brightness" : 0,
         "top" : null,
         "right" : null,
         "bottom" : null,
         "left" : null,
         "onEnter" : function () {
            brightness += 1;
            top.brightness += 0.25;
            right.brightness += 0.25;
            bottom.brightness += 0.25;
            left.brightness += 0.25;
         },
         "update" : function () {
            //brightness -= 1;
            gridObject.brightness = Math.min(1, Math.max(0, brightness));
         },
         "render" : function () {
            var red = gridObject.brightness * 255;
            var blue = (1 - gridObject.brightness) * 255;
            gridObject.div.css('background-color', "rgb(" + Math.floor(red) + ", 0, " + Math.floor(blue) + ")");
         },
      };
      if (mGrid[i] == undefined) {
         mGrid[i] = [];
      }
      mGrid[i][j] = gridObject;
      return gridObject;
   },
   
   "getSquare" : function (i, j) {
      if (0 <= i && i < NUM_COLUMNS && 0 <= j && j < NUM_ROWS)
      {
         return mGrid[i][j];
      }
      return null;
   }
};

var Square = {
   "OnEnter" : function (div) {
      var gridObject = $(this).data();
      //gridObject.onEnter();
   },

   "OnLeave" : function (div) {
      var gridObject = $(this).data();
      //gridObject.onLeave();
   },
};
