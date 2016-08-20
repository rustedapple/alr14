/**
 * @author       
 * @copyright    2016
 */
"use strict";

var Continuity = window.Continuity || {}; // Namespace

(function() {
  Continuity.ChunkFactory = {};
  Continuity.ChunkFactory.createSeed = function(s) {
  };

  /**
   * Generate Simplex noise for a given coordinate. This noise data is then used
   * to determine what the map should look like at the specific coordinate.
   *
   * @method Continuity.Map#generate
   * @param {number} cx - Chunk x index
   * @param {number} cy - Chunk y index
   * @param {number} tx - Tile x index
   * @param {number} ty - Tile y index
   * @param {number} layer - The layer of noise to generate
   * @return {number} A value between 0 and 1 representing the level of noise at this point.
   */
  Continuity.ChunkFactory.generate = function(cx, cy, tx, ty, layer) {
    layer = (typeof layer === 'undefined') ? 0 : layer;
    var d = this.generation._delta;
    var s = this.generation._float;
    var n = this.noise.snoise(
      ((((cx * Continuity.Map.CHUNK_TILES) + (tx))) / s) / d,
      ((((cy * Continuity.Map.CHUNK_TILES) + (ty))) / s) / d,
      layer);

    return n;
  };
})();

/**
 * @author       
 * @copyright    2016
 */
"use strict";

var WorldSim = window.Continuity || {}; // Namespace

(function() {
  WorldSim.ChunkFactory = function (map, params) {
    this.map = map;

    /**
     * @property {object} generation - An object of values that are used when generating simplex noise for the map.
     * @default
     */
    this.generation    = {
      min       : WorldSim.Map.DEFAULT_GEN_MIN,
      max       : WorldSim.Map.DEFAULT_GEN_MAX,
      quality   : WorldSim.Map.DEFAULT_GEN_QUAL,
      seed      : WorldSim.Map.DEFAULT_GEN_SEED,
      _delta    : -1,
      _num      : 0,
      _float    : 0.0
    };

    //populate with values from params argument
    for ( var i in params ) {
      if ( this.generation.hasOwnProperty(i) ) {
        this.generation[i] = params[i];
      }
    }
    this.generation._num   = WorldSim.Utils.createSeed(this.generation.seed);
    this.generation._float = parseFloat('0.' + Math.abs(this.generation._num));
    this.generation._delta = this.generation.quality + this.generation._float;

    /**
     * @property {Continuity.SimplexNoise} noise - A reference to Simplex Noise generator
     */
    this.noise = new WorldSim.SimplexNoise(this.generation._num);

    this.textureIndexByType = {
      'none' : 0,
      'fire': 1,
      'resource' : 2,
      'grass' : 3,
      'hexagon': 4,
      'wall': 5
    };

    var ttype   = '';
    var subtype = '';

    this.v=0;
    this.vv=0;
    this.z=0;
  };


  WorldSim.ChunkFactory.prototype = {

    /**
     * Generate Simplex noise for a given coordinate. This noise data is then used
     * to determine what the map should look like at the specific coordinate.
     *
     * @method Continuity.ChunkFactory#_generate
     * @param {number} cx - Chunk x index
     * @param {number} cy - Chunk y index
     * @param {number} tx - Tile x index
     * @param {number} ty - Tile y index
     * @param {number} [layer] - The layer of noise to generate
     * @return {number} A value between 0 and 1 representing the level of noise at this point.
     * @private
     */
    _generate: function(cx, cy, tx, ty, layer) {
      layer = (typeof layer === 'undefined') ? 0 : layer;
      var d = this.generation._delta;
      var s = this.generation._float;
      var n = this.noise.snoise(
        ((((cx * WorldSim.Map.CHUNK_TILES) + (tx))) / s) / d,
        ((((cy * WorldSim.Map.CHUNK_TILES) + (ty))) / s) / d,
        layer);

      return n;
    },
    
    createTile: function(chunkX, chunkY, tileX, tileY, layer) {
      this.v = this._generate(chunkX, chunkY, tileX, tileY);

      this.ttype = 'none';
      this.subtype = '';
      if ( this.v > 0 ) {
        if ( this.v <= 0.1 ) {
          this.ttype = 'grass';
        } else if ( this.v <= 0.4 ) {
          this.ttype = 'grass';
          if ( this.v >= 0.30 && this.v <= 0.35 ) {
            this.subtype = 'resource';
          }
        } else {
          this.ttype = 'wall';
        }
      }

      return new Phaser.Tile(layer, this.textureIndexByType[this.ttype], tileX, tileY, WorldSim.Map.TILE_SIZE, WorldSim.Map.TILE_SIZE)
    }
    
  };

  WorldSim.ChunkFactory.prototype.constructor = WorldSim.ChunkFactory;

})();
