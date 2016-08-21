/**
 * @author       
 * @copyright    2016
 */
"use strict";

var Continuity = window.Continuity || {}; // Namespace

(function() {

Continuity.Map = function (game, params) {
  this.game = game;
  this.world = game.world;
  this._tileCache = {};

  this.tileFactory = new Continuity.TileFactory(this, params);

  console.group('Continuity::Map()', 'New Map instance created.');
  console.log('World', this.generation);
  console.groupEnd();
};

Continuity.Map.WORLD_SIZE        = 8192;//px
Continuity.Map.CHUNK_SIZE        = 2048;//px
Continuity.Map.CHUNK_SIZE_X      = 2048;//px
Continuity.Map.CHUNK_SIZE_Y      = 750;//px -
Continuity.Map.HEXAGON_WIDTH     = 70//70;//px;
Continuity.Map.HEXAGON_HEIGHT    = 32;//px;
Continuity.Map.HEXAGON_HEIGHT_ugh= 80;
Continuity.Map.WORLD_CHUNKS      = Continuity.Map.WORLD_SIZE / Continuity.Map.CHUNK_SIZE;
Continuity.Map.CHUNK_TILES       = Continuity.Map.CHUNK_SIZE / Continuity.Map.HEXAGON_WIDTH;
Continuity.Map.WORLD_TILES       = Continuity.Map.WORLD_CHUNKS * Continuity.Map.CHUNK_TILES;

Continuity.Map.DEFAULT_GEN_MIN   = 0;
Continuity.Map.DEFAULT_GEN_MAX   = 32;
Continuity.Map.DEFAULT_GEN_SEED  = Math.random() * 99999;//"default";
Continuity.Map.DEFAULT_GEN_QUAL  = 128.0;

Continuity.Map.prototype = {

  draw: function(cameraX, cameraY) {
    var currentChunkIndex = this.getChunkIndexForCoordinate(cameraX, cameraY);
    var x = currentChunkIndex.x;
    var y = currentChunkIndex.y;

    //!!
    //TODO - improve performance by getting currentChunkIndex and rendering/destroying chunks without iterating through
    //the entire map. Since map could be near infinite, we can't assume we can iterate it. This only works because we have a small map.
    //!!

    //loop through all chunks and destroy or render based on if they are a neighbour or not
    for(var i = 0; i <= Continuity.Map.WORLD_CHUNKS; i++){
      for(var j = 0; j <= Continuity.Map.WORLD_CHUNKS; j++){

        if( (i == x-1 || i==x || i==x+1) &&
          (j == y-1 || j==y || j==y+1)) {
          this.renderChunk(i, j);
        } else {
          this.destroyChunk(i, j);
        }
      }
    }
  },

  /**
   * Destroy a specific Continuity.Chunk
   *
   * @method Continuity.Map#destroyChunk
   * @param {number} chunkX - The x index of the Continuity.Chunk to destroy
   * @param {number} chunkY - The y index of the Continuity.Chunk to destroy
   */
  destroyChunk: function(chunkX, chunkY) {
    //destroy the chunk!
    var id = this._hashPair(chunkX, chunkY);
    var chunk = this._tileCache[id];

    if(chunk) {
      console.log("Continuity.Map#destroyChunk", "destroying chunk:", id, "with index:", chunkX, chunkY);
      chunk.destroy();
      delete this._tileCache[id];
    }
  },

  /**
   * Render a specific Continuity.Chunk
   *
   * @method Continuity.Map#renderChunk
   * @param {number} chunkX - The x index of the Continuity.Chunk to render
   * @param {number} chunkY - The y index of the Continuity.Chunk to render
   */
  renderChunk: function(chunkX, chunkY) {
    if(chunkX < 0 || chunkY < 0 || chunkX >= Continuity.Map.WORLD_CHUNKS || chunkY >= Continuity.Map.WORLD_CHUNKS)
      return;

    var id = this._hashPair(chunkX, chunkY);

    if(this._tileCache[id])
      return;

    console.log("Continuity.Map#renderChunk", "creating chunk:", id, "with index:", chunkX, chunkY);

    this._tileCache[id] = new Continuity.Chunk(this.game, this, 'terrain', chunkX, chunkY);
  },


  /**
   * Generate a unique Id for a given pair of numbers.
   * @method Continuity.Map#_hashPair
   * @private
   * @param {number} x - The x value of the pair to hash
   * @param {number} y - The y value of the pair to hash
   * @return {number} a number unique to the two passed params
   */
    _hashPair: function(x, y) {
      return (y << 16) ^ x; //((x + y)*(x + y + 1)/2) + y;
    },

    /**
     * Get a chunk's index based on a tile's world coordinates.
     * @method Continuity.Map#_getChunkIndexForTileCoordinate
     * @param {number} x - The world x coordinate of the tile in pixels
     * @param {number} y - The world y coordinate of the tile in pixels
     */
    getChunkIndexForCoordinate: function(x, y){
      
      //Get Tile Index Relative To World For the Coordinates.
      y = y<0 ? 0 : y;
      x = x<0 ? 0 : x;
      var tileX = Math.floor(x/Continuity.Map.HEXAGON_WIDTH);
      var tileY = Math.floor(y/Continuity.Map.HEXAGON_HEIGHT);
      
      //Get Chunk Index For Tile Index.
      var chunkX = Math.floor(tileX / Continuity.Map.CHUNK_TILES);
      var chunkY = Math.floor(tileY / Continuity.Map.CHUNK_TILES);
      return {"x": chunkX, "y": chunkY};      
    }
};

Continuity.Map.prototype.constructor = Continuity.Map;

})();
