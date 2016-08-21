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

    var startingXPos = Continuity.Map.CHUNK_SIZE * chunkX;
    var startingYPos = Continuity.Map.CHUNK_SIZE * chunkY;

    this.tileMap.addTilesetImage(this.tileset, null, Continuity.Map.HEXAGON_WIDTH, Continuity.Map.HEXAGON_HEIGHT_ugh, 2, 3);
    //this.tileMap.width = 80;
    
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
        this.tileMap.putTile(tile, tile.x, tile.y);
        
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
