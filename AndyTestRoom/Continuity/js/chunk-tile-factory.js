/**
 * @author       
 * @copyright    2016
 */
"use strict";

var Continuity = window.Continuity || {}; // Namespace

(function() {

  /**
   * A static factory for creating Phase.Tiles for use by Chunks
   *
   */
  Continuity.TileFactory = {};


  Continuity.TileFactory.createSeed = function(s) {


  };

  /**
   * Generate Simplex noise for a given coordinate. This noise data is then used
   * to determine what the map should look like at the specific coordinate.
   *
   * @method ChunkMap.Map#generate
   * @param {number} cx - Chunk x index
   * @param {number} cy - Chunk y index
   * @param {number} tx - Tile x index
   * @param {number} ty - Tile y index
   * @param {number} layer - The layer of noise to generate
   * @return {number} A value between 0 and 1 representing the level of noise at this point.
   */
  Continuity.TileFactory.generate = function(cx, cy, tx, ty, layer) {
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

  /**
   * The TileFactory generates a tile for a given coordinate on the map.
   *
   * @class WorldSim.TileFactory
   * @constructor
   * @param {WorldSim.Map} map - reference to the map we will be drawing tiles for.
   */
  WorldSim.TileFactory = function (map, params) {

    /**
     * @property {ChunkMap.Map} map - A reference to the owning map.
     */
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
     * @property {ChunkMap.SimplexNoise} noise - A reference to Simplex Noise generator
     */
    this.noise = new WorldSim.SimplexNoise(this.generation._num);

    this.textureIndexByType = {
      'none' : 0,
      'fire': 1,
      'grass' : 2,
      'hexagon' : 3,
      'resource': 4,
      'wall': 5

/*      'wall' : 0,
      'grass': 1,
      'resource' : 2,
      'fire' : 3,
      'hexagon': 4,
      'none': 5*/
    };

    //var ttype   = '';
    var subtype = '';

    this.v=0;
    this.vv=0;
    this.z=0;
  };


  WorldSim.TileFactory.prototype = {

    /**
     * Generate Simplex noise for a given coordinate. This noise data is then used
     * to determine what the map should look like at the specific coordinate.
     *
     * @method ChunkMap.TileFactory#_generate
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

    /**
     * Puts a tile of the given index value at the coordinate specified.
     * If you pass `null` as the tile it will pass your call over to Tilemap.removeTile instead.
     *
     * @method ChunkMap.TileFactory#createTile
     * @param {number} chunkX - X position of the Chunk this tile will live in (given in tile units, not pixels)
     * @param {number} chunkY - Y position of the Chunk this tile will live in (given in tile units, not pixels)
     * @param {number} tileX - X position of the tile relative to the parent Chunk (given in tile units, not pixels)
     * @param {number} tileY - Y position of the tile relative to the parent Chunk (given in tile units, not pixels)
     * @param {Phaser.TilemapLayer} layer - The layer in the Tilemap data that this tile belongs to.
     * @return {Phaser.Tile} The Tile object that was created
     */
    createTile: function(chunkX, chunkY, i, j, posX, posY, layer, isHorizontal) {
      var tile;
      var ttype = 'grass';
      var hexagonGroup = Continuity.game.add.group();
      var direction;
      this.v = this._generate(chunkX, chunkY, i, j);

      
      this.subtype = '';
      if ( this.v > 0 ) {
        if ( this.v <= 0.1 ) {
          ttype = 'grass';
          if ( this.v >= 0.04 && this.v <= 0.05 ) {
            ttype = 'wall';
          }
          if ( this.v >= 0.08 && this.v <= 0.09 ) {
            if (Math.floor(Math.random() * 4) == 0)
            ttype = 'resource';
          }
        } else if ( this.v <= 0.4 ) {
          ttype = 'grass';
          if ( this.v >= 0.20 && this.v <= 0.21 ) {
            ttype = 'wall';
          }
          if ( this.v >= 0.30 && this.v <= 0.4 ) {
            ttype = 'wall';
          }
        } else {
          ttype = 'resource';
        }
      }
      
      tile = Continuity.game.add.sprite(posX, posY,  'main', this.textureIndexByType[ttype]);
      //tile.anchor.set(0.5);

      //tile.visible = false;
      tile.autoCull = true;
      tile.inputEnabled = true;
      tile.events.onInputOver.add(over, this);
      tile.events.onInputOut.add(up, this);
      tile.events.onInputDown.add(function() {
        onClick(tile, i, j, ttype, this.textureIndexByType);
      }, this);
  
      tile.input.pixelPerfectOver = true;
      tile.input.pixelPerfectClick = true;
      tile.alpha = 0;
      tile.y = tile.y;
      isHorizontal = true;
      if (isHorizontal)
      {
        direction = j;
      } else {
        direction = i;
      }
      setTimeout(function() {spawnTween(tile, ttype); }, direction * 70);
      

        //tweenTile.onComplete.add(function() {
       //       tweenTile.to({ alpha:1, y: posY - Continuity.HEXAGON_HEIGHT * 0.5}, 2000,  Phaser.Easing.Quadratic.In, true);
       //       tweenTile.start;
      //});
    
      
      return tile;

      //return new Phaser.Tile(layer, this.textureIndexByType[this.ttype], tileX, tileY)
    }

  };

  function spawnTween(tile, ttype) {
    var tweenTile;
    var originalY = tile.y;
    

    if (ttype == 'wall') {
      tile.y = tile.y - 175;
        //tile.y -= Continuity.Map.HEXAGON_HEIGHT_ugh * 0.2;
        tweenTile = Continuity.game.add.tween(tile);
        tweenTile.to({
            alpha: 1,
            y: originalY - Continuity.Map.HEXAGON_HEIGHT_ugh * 0.2
        }, 1200, Phaser.Easing.Bounce.Out, true);
      } else if (ttype == "resource") {
        tile.y = tile.y - 150;
        //tile.y -= Continuity.Map.HEXAGON_HEIGHT_ugh * 0.2;
        tweenTile = Continuity.game.add.tween(tile);
        tweenTile.to({
            alpha: 1,
            y: originalY - Continuity.Map.HEXAGON_HEIGHT_ugh * 0.2
        }, 1200, Phaser.Easing.Bounce.Out, true);
      } else {
        tile.y = tile.y - 50;
        tweenTile = Continuity.game.add.tween(tile);
        tweenTile.to({
            alpha: 1,
            y: originalY
        }, 600, Phaser.Easing.Bounce.Out, true);
      } 
  }
  
  function over(tile) {
    tile.tint = 0x999900;
  }
  
  function up(tile) {
    tile.tint = 0xffffff;
  }

  function onClick(tile, i, j, tileType, textureIndex) {
    if (tileType == 'grass') {
      tile.frame = textureIndex['wall'];
      var tweenTile;
      tweenTile = Continuity.game.add.tween(tile);
        tweenTile.to({
            alpha: 1,
            y: tile.y - Continuity.Map.HEXAGON_HEIGHT_ugh * 0.2
        }, 1000, Phaser.Easing.Bounce.Out, true);
    }  else if (tileType == 'wall') {
      tile.frame = textureIndex['grass'];
      var tweenTile;
      tweenTile = Continuity.game.add.tween(tile);
        tweenTile.to({
            alpha: 1,
            y: tile.y + Continuity.Map.HEXAGON_HEIGHT_ugh * 0.2
        }, 1000, Phaser.Easing.Bounce.Out, true);
    }
  }
  
  WorldSim.TileFactory.prototype.constructor = WorldSim.TileFactory;

})();
