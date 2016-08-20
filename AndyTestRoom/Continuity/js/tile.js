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