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
         Continuity.game.load.tilemap('terrain', 'assets/main.json', null, Phaser.Tilemap.TILED_JSON);
         Continuity.game.load.image('terrain', 'assets/main.png');
         Continuity.game.load.image('grassTile', 'assets/grass.png');
           
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