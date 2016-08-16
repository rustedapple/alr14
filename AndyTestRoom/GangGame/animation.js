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

var TileType = {
   "Empty" : {
      "index" : 0,
      "color" : [180, 180, 122, 1],
   },

   "Wall" : {
      "index" : 0,
      "color" : [60, 60, 60, 1],
   },

   "Fire" : {
      "index" : 0,
      "color" : [255, 0, 0, 1],
   },
};

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
      var i, j, tile;
      for (i = 0; i < NUM_COLUMNS; i++) {
         mGrid[i] = [];
         for (j = 0; j < NUM_ROWS; j++) {
            mGrid[i][j] = Grid.createTile(i,j);
         }
      };
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            tile = Grid.getSquare(i,j);
            tile.top    = Grid.getSquare(i,j-1);
            tile.right  = Grid.getSquare(i+1,j);
            tile.bottom = Grid.getSquare(i,j+1);
            tile.left   = Grid.getSquare(i-1,j);
         }
      };
      $(".square").each(function (index, div) {
         i = Math.floor(index % NUM_COLUMNS);
         j = Math.floor(index / NUM_COLUMNS);

         tile = Grid.getSquare(i,j);
         tile.div = $(this);
         tile.div.data("tile", tile);
         
      });

      setInterval(Grid.updateGrid, 1);
      setInterval(Grid.renderGrid, 1);
   },
   
   "renderGrid" : function () {
      var i,j;
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            var tile = Grid.getSquare(i,j);
            tile.render();
         }
      };
   },
   
   "updateGrid" : function () {
      var i,j;
      for (i = 0; i < NUM_COLUMNS; i++) {
         for (j = 0; j < NUM_ROWS; j++) {
            var tile = Grid.getSquare(i,j);
            tile.update();
         }
      };
   },
   
   "createTile" : function (i, j) {
      var tile = {
         "div" : null,
         "i" : i,
         "j" : j,
         "brightness" : 0,
         "top" : null,
         "right" : null,
         "bottom" : null,
         "left" : null,
         "type" : TileType.Empty,

         "onClick" : function () {
            //tile.brightness += 1;
            tile.type = TileType.Wall;
            
            Grid.renderGrid();
         },
         "onLeave" : function () {
            Grid.renderGrid();
         },
         "update" : function () {
            if (tile.brightness > 0) {
               if (tile.top !== null)
                  tile.top.brightness += BLEED_FACTOR * tile.brightness;
               if (tile.right !== null)
                  tile.right.brightness += BLEED_FACTOR * tile.brightness;
               if (tile.bottom !== null)
                  tile.bottom.brightness += BLEED_FACTOR * tile.brightness;
               if (tile.left !== null)
                  tile.left.brightness += BLEED_FACTOR * tile.brightness;
               
               tile.brightness *= DECAY_RATE;
               tile.brightness = Math.min(1, Math.max(0, tile.brightness));
            }
         },
         "render" : function () {
            //var red = tile.brightness * 255;
            //var blue = (1 - tile.brightness) * 255;

            var red = [255, 0, 0, 1];
            var blue = [0, 255, 0, 1];
            var black = [0, 0, 0, 1];

            var combinedColor = [0, 0, 0, 0];
            for (i = 0; i < 4; i++)
            {
               combinedColor[i] = Math.round((red[i] + blue[i]) / 2);
            }



            var color = rgbaToString(tile.type.color);
            
            tile.div.css('background', color);
         },
      };
      if (mGrid[i] == undefined) {
         mGrid[i] = [];
      }
      mGrid[i][j] = tile;
      return tile;
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
      var tile = div.data("tile");
      for (var property in tile) {
         if (tile.hasOwnProperty(property)) {
            // console.log(property + ": " + tile[property]);
         }
      }
      tile.onClick();
   },

   "OnLeave" : function (div) {
      var tile = div.data("tile");
      tile.onLeave();
   },
};
