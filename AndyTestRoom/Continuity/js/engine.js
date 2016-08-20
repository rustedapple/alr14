/**
 * @author       
 * @copyright    2016
 */
"use strict";

var Continuity = window.Continuity || {};

(function() {
   Continuity.Engine = function (canvasWidth, canvasHeight, dom) {
      this.game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, dom, {preload: this._onPreload, create: this._onCreate, update: this._onUpdate, render: this._onRender}, false, false);
      Continuity.game = this.game;
      this.map = null;
   }

   Continuity.Engine.prototype = {
      destroy: function() {
         this.game.destroy();
       },
       _onPreload: function() {
         Continuity.game.time.advancedTiming = true;
         Continuity.game.load.image('terrain', 'assets/terrain.png');
         //Continuity.game.load.image('terrain', 'assets/tileTypes.png');
       },
       _onCreate: function() {
         Continuity.game.world.setBounds(0, 0, Continuity.Map.WORLD_SIZE, Continuity.Map.WORLD_SIZE);
         Continuity.game.stage.backgroundColor = "#000000";
   
         //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
         Continuity.game.stage.disableVisibilityChange = true;
   
         this.map = new Continuity.Map(this.game, {});
         this.map.draw(Continuity.game.camera.x, Continuity.game.camera.y);
       },
       _onUpdate: function() {
         if (Continuity.game.input.activePointer.isDown) {
   
          if (Continuity.game.origDragPoint) {
             // move the camera by the amount the mouse has moved since last update
             var xChange = Continuity.game.origDragPoint.x - Continuity.game.input.activePointer.position.x;
             var yChange = Continuity.game.origDragPoint.y - Continuity.game.input.activePointer.position.y;
             Continuity.game.camera.x += xChange;
             Continuity.game.camera.y += yChange;
          }
   
          // set new drag origin to current position
          Continuity.game.origDragPoint = Continuity.game.input.activePointer.position.clone();
          this.map.draw(Continuity.game.camera.x, Continuity.game.camera.y);
         }
         else {
          Continuity.game.origDragPoint = null;
         }
       },
       _onRender: function()
       {
         Continuity.game.debug.text(Continuity.game.time.fps || '--', 2, 14, "#00ff00");
         Continuity.game.debug.cameraInfo(Continuity.game.camera, 32, 32);
       }
   };
   Continuity.Engine.prototype.constructor = Continuity.Engine;
})();













// const HEXAGON_WIDTH = 70;
// const HEXAGON_HEIGHT = 26; //26//80
// const GRID_SIZE_X = 28;
// const GRID_SIZE_Y = 36; //36

// var game;
// var minRow = 0;
// var marker;
// var hexagonGroup;
// var hexagonArray = [];
// var cursors;
// var playerCol = 2;
// var playerRow = 0;
// var playerMove = true;
// var columns = [Math.ceil(GRID_SIZE_X / 2), Math.floor(GRID_SIZE_X / 2)];
// var moveIndex;
// var sectorWidth = HEXAGON_WIDTH;
// var sectorHeight = HEXAGON_HEIGHT / 4 * 3;
// var gradient = (HEXAGON_HEIGHT / 4) / (HEXAGON_WIDTH / 2);

// window.onload = function() {
//    game = new Phaser.Game("100%", "100%");
//    game.state.add("PlayGame", playGame);
//    game.state.start("PlayGame");
// };

// var playGame = function(game) {};

// playGame.prototype = {
//    preload: function() {
      
//       game.time.advancedTiming = true;
//    },
//    create: function() {
//       hexagonGroup = game.add.group();
//       game.stage.backgroundColor = "#ffffff";
//       cursors = game.input.keyboard.createCursorKeys();
//       for (var i = 0; i < GRID_SIZE_Y; i++) {
//          addHexagonRow(i);
//       }
//       hexagonGroup.x = (game.width - HEXAGON_WIDTH * GRID_SIZE_X) / 2;
//       hexagonGroup.y = 20;
//    },
//    update: function() {
//       var destroyedRow = false;
//       for (var i = minRow; i < GRID_SIZE_Y; i++) {
//          for (var j = 0; j < GRID_SIZE_X; j++) {
//             if ((i % 2 == 0 || j < GRID_SIZE_X - 1) && hexagonArray[i][j].world.y < 0) {
//                var destroyTween = game.add.tween(hexagonArray[i][j]).to({
//                   alpha: 0,
//                   y: hexagonArray[i][j].y + HEXAGON_HEIGHT / 2
//                }, 200, Phaser.Easing.Quadratic.Out, true);
//                destroyTween.onComplete.add(function(e) {
//                   e.destroy();
//                })
//                destroyedRow = true;
//             }
//          }
//       }
//       if (destroyedRow) {
//          minRow++;
//       }
      
//       hexagonGroup.sort('z', Phaser.Group.SORT_ASCENDING);
//    },
//    render: function() {
//       game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
//       game.debug.cameraInfo(game.camera, 32, 32);
//    }
// }

// function addHexagonRow(y) {
//    var rand;
//    var tile;
//    hexagonArray[y] = [];
//    for (var x = 0; x < GRID_SIZE_X - y % 2; x++) {
//       var posX = HEXAGON_WIDTH * x + (HEXAGON_WIDTH / 2) * (y % 2);
//       var posY = HEXAGON_HEIGHT * y / 4 * 3;
//       rand = Math.floor(Math.random() * 50);
//       if (rand == 0) {
//          tile = new BaseTile(game, posX, posY, x, y, "wallTile");
//          //constructTile(posX, posY, y, x, "wallTile");
//       }
//       else if (rand >= 1 && rand <= 2) {
//          tile = new BaseTile(game, posX, posY, x, y, "grassTile");
//          //constructTile(posX, posY, y, x, "grassTile");
//          //constructTile(posX, posY, i, j, "emptyTile");
//       }
//       else if (rand == 3) {
//          tile = new BaseTile(game, posX, posY, x, y, "resourceTile");
//          //constructTile(posX, posY, y, x, "resourceTile");
//       }
//       else {
//          tile = new BaseTile(game, posX, posY, x, y, "grassTile");
//          //constructTile(posX, posY, y, x, "grassTile");
//       }
      
//       hexagonGroup.add(tile);
//       hexagonArray[x][y] = tile;
//    }
// }

// function over(tile) {
//    tile.tint = 0x999900;
// }

// function up(tile) {
//    tile.tint = 0xffffff;
// }

// function over1() {
//    //tile.tint = 0x999900;
// }

// /*var hexagonText = game.add.text(0 + HEXAGON_WIDTH / 3 + 5, 0 + 15, i + "," + j);
// hexagonText.font = "arial";
// hexagonText.align = "center";
// hexagonText.fontSize = 10;
// grassTile.addChild(hexagonText);  */

// // var destroyTween = game.add.tween(tile).to({
//    //    alpha: 0,
//    //    y: tile.y - HEXAGON_HEIGHT * 3
//    // }, 400, Phaser.Easing.Quadratic.Out, true);

//    // destroyTween.onComplete.add(function(e) {
//    //    e.destroy();
//    // })

//    // constructTile(tile.x, tile.y, i, j, "grassTile");
