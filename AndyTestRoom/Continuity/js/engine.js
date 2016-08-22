var game = new Phaser.Game(1440, 1024, Phaser.AUTO, 'test', null, true, false);

var BasicGame = function (game) { };

BasicGame.Boot = function (game) { };

var isoGroup, sorted;

BasicGame.Boot.prototype =
{
    preload: function () {
        game.load.image('cube', '../assets/tiles/grass.png');

        game.time.advancedTiming = true;

        // Add and enable the plug-in.
        game.plugins.add(new Phaser.Plugin.Isometric(game));

        // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
        // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
        game.iso.anchor.setTo(0.5, 0.2);

                
    },
    create: function () {
        // Create a group for our tiles, so we can use Group.sort
        isoGroup = game.add.group();

        // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
        var cube;
        for (var xx = 9999; xx > 0; xx -= 48) {
            for (var yy = 9999; yy > 0; yy -= 48) {
                // Create a cube using the new game.add.isoSprite factory method at the specified position.
                // The last parameter is the group you want to add it to (just like game.add.sprite)
                cube = game.add.isoSprite(xx, yy, 0, 'cube', 0, isoGroup);
                cube.anchor.set(0.5)

                // Store the old messed up ordering so we can compare the two later.
                cube.oldZ = cube.z;

                // Add a slightly different tween to each cube so we can see the depth sorting working more easily.
                game.add.tween(cube).to({ isoZ: 10 }, 100 * ((xx + yy) % 10), Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
            }
        }

        // Just a var so we can tell if the group is sorted or not.
        sorted = false;

        // Toggle sorting on click/tap.
        game.input.onDown.add(function () {
            sorted = !sorted;
            if (sorted) {
                game.iso.simpleSort(isoGroup);
            }
            else {
                isoGroup.sort('oldZ');
            }
        }, this);
                
    },
    update: function () {

    },
    render: function () {
        game.debug.text("Click to toggle! Sorting enabled: " + sorted, 2, 36, "#ffffff");
        game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
    }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');

// var Continuity = window.Continuity || {};
// var isoGroup;
// (function() {
//    Continuity.Engine = function (canvasWidth, canvasHeight, dom) {
//       this.game = new Phaser.Game(canvasWidth, canvasHeight, Phaser.AUTO, dom, {preload: this._onPreload, create: this._onCreate, update: this._onUpdate, render: this._onRender}, false, false);
//       Continuity.game = this.game;
//       this.map = null;
//    }

//    Continuity.Engine.prototype = {
//       destroy: function() {
//          this.game.destroy();
//        },
//        _onPreload: function() {
//          Continuity.game.time.advancedTiming = true;
//          //Continuity.game.load.tilemap('terrain', 'assets/main.json', null, Phaser.Tilemap.TILED_JSON);
//          //Continuity.game.load.image('terrain', 'assets/main.png');
//          Continuity.game.load.image('grass', 'assets/tiles/grass.png');
//          Continuity.game.load.image('fire', 'assets/tiles/fire.png');
//          Continuity.game.load.image('resource', 'assets/tiles/resource.png');
//          Continuity.game.load.image('wall', 'assets/tiles/wall.png');
//          Continuity.game.plugins.add(new Phaser.Plugin.Isometric(Continuity.game));
//          //Continuity.game.iso.anchor.setTo(0.5, 0.2);
//        },
//        _onCreate: function() {
//          Continuity.game.world.setBounds(0, 0, Continuity.Map.WORLD_SIZE, Continuity.Map.WORLD_SIZE);
//          Continuity.game.stage.backgroundColor = "#000000";
   
//          //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
//          Continuity.game.stage.disableVisibilityChange = true;
   
//          this.map = new Continuity.Map(this.game, {});
//          this.map.draw(Continuity.game.camera.x, Continuity.game.camera.y);


//          // Create a group for our tiles, so we can use Group.sort
//         isoGroup = Continuity.game.add.group();
//         // Let's make a load of cubes on a grid, but do it back-to-front so they get added out of order.
//         var cube;
//         for (var xx = 512; xx > 0; xx -= 48) {
//             for (var yy = 512; yy > 0; yy -= 48) {
//                 // Create a cube using the new game.add.isoSprite factory method at the specified position.
//                 // The last parameter is the group you want to add it to (just like game.add.sprite)
//                 cube = Continuity.game.add.isoSprite(xx, yy, 0, 'grass', 0);
//                 //cube.anchor.set(0.5)
//                 console.log("creating tile");
//                 // Store the old messed up ordering so we can compare the two later.
//                 cube.oldZ = cube.z;

//                 // Add a slightly different tween to each cube so we can see the depth sorting working more easily.
//                 //Continuity.game.add.tween(cube).to({ isoZ: 10 }, 100 * ((xx + yy) % 10), Phaser.Easing.Quadratic.InOut, true, 0, Infinity, true);
//             }
//         }
//        },
//        _onUpdate: function() {
//          if (Continuity.game.input.activePointer.isDown) {
   
//           if (Continuity.game.origDragPoint) {
//              // move the camera by the amount the mouse has moved since last update
//              var xChange = Continuity.game.origDragPoint.x - Continuity.game.input.activePointer.position.x;
//              var yChange = Continuity.game.origDragPoint.y - Continuity.game.input.activePointer.position.y;
//              Continuity.game.camera.x += xChange;
//              Continuity.game.camera.y += yChange;
//           }
   
//           // set new drag origin to current position
//           Continuity.game.origDragPoint = Continuity.game.input.activePointer.position.clone();
//           this.map.draw(Continuity.game.camera.x, Continuity.game.camera.y);
//          }
//          else {
//           Continuity.game.origDragPoint = null;
//          }
//        },
//        _onRender: function()
//        {
//          Continuity.game.debug.text(Continuity.game.time.fps || '--', 2, 14, "#00ff00");
//          Continuity.game.debug.cameraInfo(Continuity.game.camera, 32, 32);
//        }
//    };
//    Continuity.Engine.prototype.constructor = Continuity.Engine;
// })();