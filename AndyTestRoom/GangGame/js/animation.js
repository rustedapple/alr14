"use strict";
var animation = {
   "load" : function () {
      var i = 0, j = 0;
      document.getElementById("grid").innerHTML = Grid.createGridHtml();
      Grid.initializeGrid();
   },
};

const DECAY_RATE = 0.9;
const BLEED_FACTOR = 0.0252; // Use ~"(1-DECAY_RATE)/4" for good balance.

var TileType = {
   "None" : {
      "index" : 0,
      "color" : [180, 180, 122, 1],
   },

   "Wall" : {
      "index" : 1,
      "color" : [60, 60, 60, 1],
   },

   "Fire" : {
      "index" : 2,
      "color" : [210, 4, 4, 1],
      
   },
   "Farmland": {
      "index" : 3,
      "color" : [41, 176, 10, 1],
   },
};

var Grid = {
   "NUM_ROWS" : 60,
   "NUM_COLUMNS" : 60,
   "mGrid" : [],
   "mRegions" : [],
   
   "createGridHtml" : function () {
      var i, j, result = "";
      for (i = 0; i < Grid.NUM_COLUMNS; i++) {
         result += "<div>";
         for (j = 0; j < Grid.NUM_ROWS; j++) {
            result += '<div id="gridsquare" class="square" \
               onclick="Square.OnClick($(this));" \
               onmouseenter="Square.OnEnter($(this));" \
               onmouseleave="Square.OnLeave($(this));" \
            ></div>\n';
         }
         result += "</div>";
      }
      return result;
   },
   
   "initializeGrid" : function () {
      var i, j, tile;
      for (i = 0; i < Grid.NUM_COLUMNS; i++) {
         this.mGrid[i] = [];
         for (j = 0; j < Grid.NUM_ROWS; j++) {
            this.mGrid[i][j] = Grid.createTile(i,j);
         }
      };
      for (i = 0; i < Grid.NUM_COLUMNS; i++) {
         for (j = 0; j < Grid.NUM_ROWS; j++) {
            tile = Grid.getTile(i,j);
            tile.top    = Grid.getTile(i,j-1);
            tile.right  = Grid.getTile(i+1,j);
            tile.bottom = Grid.getTile(i,j+1);
            tile.left   = Grid.getTile(i-1,j);
         }
      };
      $(".square").each(function (index, div) {
         i = Math.floor(index % Grid.NUM_COLUMNS);
         j = Math.floor(index / Grid.NUM_COLUMNS);

         tile = Grid.getTile(i,j);
         tile.div = $(this);
         tile.div.data("tile", tile);
         
      });

      setInterval(Grid.updateGrid, 16);
      setInterval(Grid.renderGrid, 16);

      //setTimeout(function() {setInterval(Grid.createFireRandomly, 500);}, 3000);
   },
   
   "renderGrid" : function () {
      var i,j;
      for (i = 0; i < Grid.NUM_COLUMNS; i++) {
         for (j = 0; j < Grid.NUM_ROWS; j++) {
            var tile = Grid.getTile(i,j);
            tile.render();
         }
      };
   },
   
   "updateGrid" : function () {
      var i,j;
      for (i = 0; i < Grid.NUM_COLUMNS; i++) {
         for (j = 0; j < Grid.NUM_ROWS; j++) {
            var tile = Grid.getTile(i,j);
            tile.update();
         }
      };
   },
   
   "calculateRegions" : function () {
      var i, j, startTile, regionN, unSortedTiles = [];
      this.mRegions = [];
      
      for (i = 0; i < Grid.NUM_COLUMNS; i++) {
         for (j = 0; j < Grid.NUM_ROWS; j++) {
            unSortedTiles.push(Grid.getTile(i,j));
         }
      };
      while (unSortedTiles.length > 0) {
         startTile = unSortedTiles[0];
         regionN = startTile.getNeighborhood();
         //unSortedTiles = unSortedTiles.diff(regionN); // TODO Remove RegionN tiles from unsortedTiles
         this.mRegions.push(regionN);
      }
      
      // Optional part:
      for (i = 0; i < this.mRegions.Length; i++) {
         regionN = mRegion[i];
         var randomColor = createRandomColor();
         for (j = 0; j < regionN.Length; j++) {
            var tile = mRegion[i];
            tile.overrideColor = randomColor;
            tile.colorChanged = true;
         }
      };
   },

   "createFireFromRight" : function () {
      var j;
      for (j = 0; j < Grid.NUM_COLUMNS; j++) {
         var tile = Grid.getTile(Grid.NUM_ROWS - 1,j);
         if (tile !== null) {
            tile.originalStrength = 99;
            tile.createFire(99, 99);
         }
      }
   },

   "createFireRandomly" : function () {
      var i,j;
      i = Math.floor(Math.random() * Grid.NUM_ROWS);
      j = Math.floor(Math.random() * Grid.NUM_COLUMNS);

      var tile = Grid.getTile(i,j);
      if (tile !== null)
      {
         tile.originalStrength = 8;
         tile.createFire(25, 25);
      }
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
         "type" : TileType.None,
         "strength" : 0,
         "originalStrength" : 0,
         "additionalColor" : [255,0,0,1],
         "alpha" : 1,
         "overrideColor" : null,
         "colorChanged" : false,
         "floodFillCheck" : false,

         "getNeighbors" : function () {
            return [tile.top, tile.right, tile.bottom, tile.left];
         },
         "getNeighborhood" : function () {
            return [tile.top, tile.right, tile.bottom, tile.left];
         },
         "toggleWall" : function () {
            if (tile.type != TileType.Wall) {
               tile.type = TileType.Wall;
            } 
            else if (tile.type == TileType.Wall) {
               tile.type = TileType.None;
            }

            tile.colorChanged = true;
            tile.render();
            
            // Not yet ready...
            //Grid.calculateRegions();
            //Grid.render();
         },
         "onEnter" : function () {
            tile.alpha = 0.5;
            tile.colorChanged = true;
            tile.render();
         },
         "onLeave" : function () {
            tile.alpha = 1;
            tile.colorChanged = true;
            tile.render();
         },
         "update" : function () {
            if (tile.type == TileType.Empty) {
               tile.strength = 0;
               tile.originalStrength = 0;
               tile.alpha = 1;
            }
         },
         "render" : function () {
            //var red = tile.brightness * 255;
            //var blue = (1 - tile.brightness) * 255;
            if (tile.colorChanged == true)
            {
               var color = tile.type.color;
               tile.colorChanged = false;
               // if (tile.originalStrength !== 0) {
                   var combinedColor = [0, 0, 0, 1];
                  for (i = 0; i < 3; i++)
                  {
                     //if (color[i] !== 0) {
                        //combinedColor[i] = Math.round((tile.additionalColor[i] + color[i]) / 2);
                     //} 
                  }
                  //console.log(tile.additionalColor);
               //    console.log(combinedColor);
                   //color = combinedColor;
               //    //tile.alpha = tile.strength / tile.originalStrength;
               //    //console.log(tile.alpha);
               // }

               color[3] = tile.alpha;
               
               if (tile.overrideColor !== null) {
                  color = tile.overrideColor;
               }
               
               tile.div.css('background', rgbaToString(color));
            }
         },
         "canCreateFire" : function () {
            return (tile.type !== TileType.Wall && tile.type !== TileType.Fire);
         },
         "createFire" : function (strength, originalStrength) {
            if (tile.canCreateFire())
            {
               
               tile.type = TileType.Fire;
               tile.strength = strength;
               tile.originalStrength = originalStrength;
               tile.colorChanged = true;
               tile.spreadFire();
               //setTimeout(tile.killFire, Math.round(600 * ((tile.strength / tile.originalStrength))));
               setTimeout(tile.killFire, Math.round(200));

               // if (tile.type == TileType.Fire) {
               //    var neighbors = tile.getNeighbors();
               //    for (var i = 0; i < neighbors.length; i++) {
               //       var neighbor = neighbors[i];
               //       if (neighbor !== null && neighbor.type == TileType.None) {
               //          for (i = 0; i < 3; i++) {
               //             neighbor.additionalColor[i] = Math.round(((TileType.None.color[i] * (1 - tile.strength / tile.originalStrength)) + (TileType.Fire.color[i] * (tile.strength / tile.originalStrength))) / 2);
               //          }                     
               //       }
               //    };
               // }
            }
         },
         "spreadFire" : function () {
            var neighbors = tile.getNeighbors();
            for (var i = 0; i < neighbors.length; i++) {
               var neighbor = neighbors[i];
               if (neighbor !== null && neighbor.canCreateFire() && tile.strength !== 0) {
                  setTimeout(neighbor.createFire(tile.strength - 1, tile.originalStrength), 50);
               }
            };
         },
         "killFire" : function () {
            if (tile.type == TileType.Fire) {
               tile.type = TileType.None;
               tile.colorChanged = true;

               tile.strength = 0;
               tile.originalStrength = 0;
               tile.alpha = 1;

               tile.additionalColor = [0,0,0,1];
               var neighbors = tile.getNeighbors();
               for (var i = 0; i < neighbors.length; i++) {
                  var neighbor = neighbors[i];
                  if (neighbor !== null && neighbor.type == TileType.None) {
                     neighbor.additionalColor = [0,0,0,1];
                  }
               };
            }
         },
      };
      if (this.mGrid[i] == undefined) {
         this.mGrid[i] = [];
      }
      this.mGrid[i][j] = tile;
      return tile;
   },
   "getTile" : function (i, j) {
      if (0 <= i && i < Grid.NUM_COLUMNS && 0 <= j && j < Grid.NUM_ROWS) {
         return this.mGrid[i][j];
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
      tile.toggleWall();
   },
   "OnEnter" : function (div) {
      var tile = div.data("tile");
      tile.onEnter();
   },
   "OnLeave" : function (div) {
      var tile = div.data("tile");
      tile.onLeave();
   },
};