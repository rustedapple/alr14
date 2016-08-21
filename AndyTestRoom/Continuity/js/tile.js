// /**
//  * @author       
//  * @copyright    2016
//  */
// "use strict";

// tile = function (game, posX, posY, x, y, tileType) {

//     //  We call the Phaser.Sprite passing in the game reference
//     //  We're giving it a random X/Y position here, just for the sake of this demo - you could also pass the x/y in the constructor
//     //Phaser.Sprite.call(this, game, posX, posY, TileType);
    
    
    
//     TileType = tileType;
    
//     constructTile(game, posX, posY, x, y, tileType);
    
//     game.add.existing(this);
// };

// const HEXAGON_WIDTH = 70;
// const HEXAGON_HEIGHT = 26; //26//80
// var TileType;

// tile.prototype = Object.create(Phaser.Sprite.prototype);
// tile.prototype.constructor = tile;

// tile.prototype.update = function() {

// };

// function preload() {

//    game.load.image("grassTile", "assets/grass.png");
//    game.load.image("fireTile", "assets/fire.png");
//    game.load.image("wallTile", "assets/wall.png");
//    game.load.image("resourceTile", "assets/resource.png");
//    game.load.image("emptyTile", "assets/empty.png");
//    game.load.image("marker", "assets/marker.png");

// }

// function constructTile(game, posX, posY, x, y, tileType) {
//    var tile;

//    tile = game.add.sprite(posX, posY, tileType);

//    tile.inputEnabled = true;
//    tile.events.onInputOver.add(over, this);
//    tile.events.onInputOut.add(up, this);

//    tile.events.onInputDown.add(function() {
//       onClick(tile, x, y);
//    }, this);

//    tile.input.pixelPerfectOver = true;
//    tile.input.pixelPerfectClick = true;
//    console.log(x);
//    tile.z = x;
//    tile.autoCull = true;
   
//    var hexagonText = game.add.text(0 + HEXAGON_WIDTH / 3 + 5, 0 + 15, x + "," + y);
//    hexagonText.font = "arial";
//    hexagonText.align = "center";
//    hexagonText.fontSize = 10;
//    tile.addChild(hexagonText);
   

//    if (tileType == "wallTile") {
//       var tweenTile;
//       tweenTile = game.add.tween(tile);
//       tweenTile.to({
//          alpha: 1,
//          y: posY - HEXAGON_HEIGHT * 0.8
//       }, 3000, Phaser.Easing.Bounce.Out, true);
//    }
//    if (tileType == "resourceTile") {
//       var tweenTile;
//       tweenTile = game.add.tween(tile);
//       tweenTile.to({
//          alpha: 1,
//          y: posY - HEXAGON_HEIGHT * 0.8
//       }, 3000, Phaser.Easing.Bounce.Out, true);
//       //tweenTile.to({ alpha:1, y: posY - HEXAGON_HEIGHT * 2}, 400,  Phaser.Easing.Quadratic.Out, true);
//       // tweenTile.onComplete.add(function() {
//       //      tweenTile.to({ alpha:1, y: posY - HEXAGON_HEIGHT * 0.5}, 2000,  Phaser.Easing.Quadratic.In, true);
//       //      tweenTile.start;
//       // });
//    }
   
//    return tile;
// }

// function onClick(tile, i, j) {
//    tile.loadTexture("wallTile");
//    var tweenTile;
//    tweenTile = game.add.tween(tile);
//       tweenTile.to({
//          alpha: 1,
//          y: tile.y - HEXAGON_HEIGHT * 0.8
//       }, 3000, Phaser.Easing.Bounce.Out, true);
// }







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
// var moveIndex;

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
