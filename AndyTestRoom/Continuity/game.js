var game;
var hexagonWidth = 70;
var hexagonHeight = 27;//35
var minRow = 0;
var gridSizeX = 14;
var gridSizeY = 36;
var marker;
var hexagonGroup;
var hexagonArray = [];
var cursors;
var playerCol = 2;
var playerRow = 0;
var playerMove = true;

window.onload = function() {	
	game = new Phaser.Game(1024, 1024);
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}
var playGame = function(game){}
playGame.prototype = {
     preload: function(){
     	game.load.image("grassTile", "grass.png");
          game.load.image("fireTile", "fire.png");
          game.load.image("wallTile", "wall.png");
     },
     create: function(){
          hexagonGroup = game.add.group();
          game.stage.backgroundColor = "#ffffff";
          cursors = game.input.keyboard.createCursorKeys();
          for(var i = 0; i < gridSizeY; i ++){
               addHexagonRow(i);
          }
          hexagonGroup.x = (game.width - hexagonWidth * gridSizeX) / 2;
          hexagonGroup.y = 20;
     },
     update: function(){
          var destroyedRow = false;
          for(var i = minRow; i < gridSizeY; i ++){
			for(var j = 0; j < gridSizeX; j ++){
				if((i % 2 == 0 || j < gridSizeX - 1) && hexagonArray[i][j].world.y < 0){
                         var destroyTween = game.add.tween(hexagonArray[i][j]).to({
                              alpha:0,
                              y: hexagonArray[i][j].y + hexagonHeight / 2
                         }, 200,  Phaser.Easing.Quadratic.Out, true);
                         destroyTween.onComplete.add(function(e){
                              e.destroy();     
                         })
                         destroyedRow = true;                        
				}
			}
		}
          if(destroyedRow){
               minRow ++;
          }    
     }
}

var tweenTiles = [];
function addHexagonRow(i){
     hexagonArray[i] = [];

	for(var j = 0; j < gridSizeX - i % 2; j ++){
          var hexagonX = hexagonWidth * j + (hexagonWidth / 2) * (i % 2);
          var hexagonY = hexagonHeight * i / 4 * 3;
          var tile;

          if (Math.floor(Math.random() * 20) == 0) {
               var tweenTile;
               var badf;
               tile = game.add.sprite(hexagonX, hexagonY, "wallTile");
               
               tweenTiles.push(tweenTile);
               badf = tweenTiles.length - 1;
               tweenTile = game.add.tween(tile);
               tweenTile.to({ alpha:1, y: hexagonY - hexagonHeight * 1.2}, 1200,  Phaser.Easing.Bounce.Out, true);
               tweenTile.onComplete.add(function() {
                    tweenTile.to({ alpha:1, y: hexagonY}, 1200,  Phaser.Easing.Bounce.Out, true);
                    tweenTile.start;
               });
          } else {
               tile = game.add.sprite(hexagonX, hexagonY, "grassTile");
          }

          hexagonGroup.add(tile);
          hexagonArray[i][j] = tile;    
          
	}
}

/*var hexagonText = game.add.text(0 + hexagonWidth / 3 + 5, 0 + 15, i + "," + j);
hexagonText.font = "arial";
hexagonText.align = "center";
hexagonText.fontSize = 10;
grassTile.addChild(hexagonText);  */ 