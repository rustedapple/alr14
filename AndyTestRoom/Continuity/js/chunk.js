/**
 * @author       
 * @copyright    2016
 */
"use strict";

var Continuity = window.Continuity || {}; // Namespace

(function() {

/**
 * @class Continuity.Chunk
 * @constructor
 * @param {Phaser.Game} game - Game reference to the currently running game.
 * @param {Continuity.Map} map - Map reference to the owning map.
 * @param {string} tileset - The texture name of the tileset to use when rendering this chunk - TODO - swap this for a tile factory
 * @param {number} chunkX - Not being used at the moment, will be when Phaser supports multiple camera
 * @param {number} chunkY - Position of the camera on the X axis
 */
Continuity.Chunk = function (game, map, tileset, chunkX, chunkY) {
  this.game = game;
  this.world = game.world;
  this.map = map;
  this.x = chunkX;
  this.y = chunkY;
  this.tileMap = game.add.tilemap();
  this.tileset = tileset;
  this.tileMapLayer = null;
  this._create();
};

Continuity.Chunk.prototype = {
  _create: function() {
    var chunkX      = this.x;
    var chunkY      = this.y;

    var startingXPos = Continuity.Map.CHUNK_SIZE_X * chunkX;
    var startingYPos = Continuity.Map.CHUNK_SIZE_Y * chunkY;

    this.tileMap.addTilesetImage(this.tileset, null, Continuity.Map.HEXAGON_WIDTH, Continuity.Map.HEXAGON_HEIGHT_ugh, 2, 3);
    this.tileMapLayer = this.tileMap.create("tilemap", Continuity.Map.CHUNK_TILES, Continuity.Map.CHUNK_TILES, Continuity.Map.HEXAGON_WIDTH, Continuity.Map.HEXAGON_HEIGHT);
    this.tileMapLayer.fixedToCamera = false;
    this.tileMapLayer.scrollFactorX = 0;
    this.tileMapLayer.scrollFactorY = 0;
    this.tileMapLayer.position.set(startingXPos, startingYPos);
    this.tileMapLayer.inputEnabled = true;
    
    //this.tileMap.tileWidth = Continuity.Map.HEXAGON_WIDTH;
    //this.tileMap.tileHeight = Continuity.Map.HEXAGON_HEIGHT;
    var self = this;
    this.tileMapLayer.events.onInputDown.add(function(sprite, pointer){
      var chunkIndex = self.map.getChunkIndexForCoordinate(pointer.worldX, pointer.worldY);
      console.log("digging at chunk:", chunkIndex, "with rect", self.rect);
    }, this.tileMapLayer);

    var tile;
    for(var i = 0; i < Continuity.Map.CHUNK_TILES; i++){
      for(var j = 0; j < Continuity.Map.CHUNK_TILES; j++){
        tile = this.map.tileFactory.createTile(chunkX, chunkY, i, j, this.tileMapLayer);
        

        //var tilePosX = Math.random() * 60 + startingXPos + Continuity.Map.HEXAGON_WIDTH * i + (Continuity.Map.HEXAGON_WIDTH / 2) * (j % 2);
        //var tilePosY = startingYPos + Continuity.Map.HEXAGON_HEIGHT * j / 4 * 3;
        
        //var posX = HEXAGON_WIDTH * x + (HEXAGON_WIDTH / 2) * (y % 2);
//       var posY = HEXAGON_HEIGHT * y / 4 * 3;
        var posX = startingXPos + Continuity.Map.HEXAGON_WIDTH * j + (Continuity.Map.HEXAGON_WIDTH / 2) * (i % 2);
        var posY = startingYPos+ Continuity.Map.HEXAGON_HEIGHT * i / 4 * 3;
        console.log(posX + "," + posY);        
        
        //this.tileMap.putTileWorldXY(tile, tilePosX, tilePosY, Continuity.Map.HEXAGON_WIDTH, Continuity.Map.HEXAGON_HEIGHT);
        //this.tileMap.putTile(tile, tile.x, tile.y);
        //constructTile(tile.x, tile.y, i, j, "grassTile");
        //    var tile;

    tile = Continuity.game.add.sprite(posX, posY,  'grassTile');
    tile.autoCull = true;

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
      }
    }

    //this.tileMapLayer.resize(Continuity.Map.CHUNK_SIZE, Continuity.Map.CHUNK_SIZE);
  },

  destroy: function() {
    this.tileMap.destroy();
    this.tileMapLayer.destroy();
    this.tileMap = null;
    this.tileMapLayer = null;
    this.map = null;
    this.game = null;
  },

  getTile: function(x, y) {
    return null; //todo
  }
};

Continuity.Chunk.prototype.constructor = Continuity.Chunk;

Object.defineProperty(Continuity.Chunk.prototype, "rect", {
    get: function () {
        return new Phaser.Rectangle((this.x * Continuity.Map.CHUNK_SIZE), (this.y * Continuity.Map.CHUNK_SIZE), Continuity.Map.CHUNK_SIZE, Continuity.Map.CHUNK_SIZE);
    }
});

})();
