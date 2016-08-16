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

var NUM_ROWS = 20;
var NUM_COLUMNS = 20;
var mGrid = [];
var DECAY_RATE = 0.9;
var BLEED_FACTOR = 0.0252; // Use ~"(1-DECAY_RATE)/4" for good balance.

var Grid = {
   "createGridHtml" : function () {
      var i, j, result = "";
      for (i = 0; i < NUM_COLUMNS; i++) {
         result += "<div>";
         for (j = 0; j < NUM_ROWS; j++) {
            result += '<div id="gridsquare" class="square" \
               onclick="Square.OnClick($(this));" \
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
      $(".square").each(function (index, div) {
         i = Math.floor(index % NUM_COLUMNS);
         j = Math.floor(index / NUM_COLUMNS);
         //console.log(i + ", " + j);
         gridObject = Grid.getSquare(i,j);
         gridObject.div = $(this);
         //$(this).data("gridObject", gridObject); // TODO why does this not work?
         // Theory: $() returns a jquery object, whereas you need to operate on the DOM element
         // But then why does the passed in div not work? Goddammit...
         gridObject.div.data("gridObject", gridObject);
         
         /*$(this).css('background-color', 'green');
         gridObject.brightness = (i+j) % 2
         gridObject.render();*/
      });

      setInterval(Grid.updateGrid, 1);
      setInterval(Grid.renderGrid, 1);
   },
   
   "renderGrid" : function () {
      var i,j;
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            var gridObject = Grid.getSquare(i,j);
            gridObject.render();
         }
      };
   },
   
   "updateGrid" : function () {
      var i,j;
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
         "color" : [0, 0, 0, 1],

         "onClick" : function () {
            //gridObject.brightness += 1;
            gridObject.color = [0, 0, 0, 1];
            
            Grid.renderGrid();
         },
         "onLeave" : function () {
            Grid.renderGrid();
         },
         "update" : function () {
            if (gridObject.brightness > 0) {
               if (gridObject.top !== null)
                  gridObject.top.brightness += BLEED_FACTOR * gridObject.brightness;
               if (gridObject.right !== null)
                  gridObject.right.brightness += BLEED_FACTOR * gridObject.brightness;
               if (gridObject.bottom !== null)
                  gridObject.bottom.brightness += BLEED_FACTOR * gridObject.brightness;
               if (gridObject.left !== null)
                  gridObject.left.brightness += BLEED_FACTOR * gridObject.brightness;
               
               gridObject.brightness *= DECAY_RATE;
               gridObject.brightness = Math.min(1, Math.max(0, gridObject.brightness));
            }
         },
         "render" : function () {
            //var red = gridObject.brightness * 255;
            //var blue = (1 - gridObject.brightness) * 255;

            var red = [255, 0, 0, 1];
            var blue = [0, 255, 0, 1];
            var black = [0, 0, 0, 1];

            var combinedColor = [0, 0, 0, 0];
            for (i = 0; i < 4; i++)
            {
               combinedColor[i] = Math.round((red[i] + blue[i]) / 2);
            }

            

            var color = rgbaToString(gridObject.color);
            
            //gridObject.div.css('background', color);
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

var rgbaToString = function (color) {


   return "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + color[3] + ")";
};

var Square = {
   "OnClick" : function (div) {
      var gridObject = div.data("gridObject");
      for (var property in gridObject) {
         if (gridObject.hasOwnProperty(property)) {
            // console.log(property + ": " + gridObject[property]);
         }
      }
      gridObject.onClick();
   },

   "OnLeave" : function (div) {
      var gridObject = div.data("gridObject");
      gridObject.onLeave();
   },
};
