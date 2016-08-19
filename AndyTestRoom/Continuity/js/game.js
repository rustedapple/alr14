const HEXAGON_WIDTH = 70;
const HEXAGON_HEIGHT = 26;//26//80
const GRID_SIZE_X = 14;
const GRID_SIZE_Y = 36;

var game;
var minRow = 0;
var marker;
var hexagonGroup;
var hexagonArray = [];
var cursors;
var playerCol = 2;
var playerRow = 0;
var playerMove = true;
var columns = [Math.ceil(GRID_SIZE_X/2),Math.floor(GRID_SIZE_X/2)];
var moveIndex;
var sectorWidth = HEXAGON_WIDTH;
var sectorHeight = HEXAGON_HEIGHT/4*3;
var gradient = (HEXAGON_HEIGHT/4)/(HEXAGON_WIDTH/2);

window.onload = function() {
	game = new Phaser.Game(1200, 1200);
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){}
playGame.prototype = {
     preload: function(){
     	game.load.image("grassTile", "assets/grass.png");
		game.load.image("fireTile", "assets/fire.png");
		game.load.image("wallTile", "assets/wall.png");
		game.load.image("resourceTile", "assets/resource.png");
		game.load.image("emptyTile", "assets/empty.png");
		game.load.image("marker", "assets/marker.png");
     },
     create: function(){
          hexagonGroup = game.add.group();
          game.stage.backgroundColor = "#ffffff";
          cursors = game.input.keyboard.createCursorKeys();
          for(var i = 0; i < GRID_SIZE_Y; i ++){
               addHexagonRow(i);
          }
          hexagonGroup.x = (game.width - HEXAGON_WIDTH * GRID_SIZE_X) / 2;
          hexagonGroup.y = 20;

          marker = game.add.sprite(0,0,"marker");
			marker.anchor.setTo(0.5);
		marker.visible=false;
		hexagonGroup.add(marker);
          moveIndex = game.input.addMoveCallback(checkHex, this);   
     },
     update: function(){
          var destroyedRow = false;
          for(var i = minRow; i < GRID_SIZE_Y; i ++){
			for(var j = 0; j < GRID_SIZE_X; j ++){
				if((i % 2 == 0 || j < GRID_SIZE_X - 1) && hexagonArray[i][j].world.y < 0){
                         var destroyTween = game.add.tween(hexagonArray[i][j]).to({
                              alpha:0,
                              y: hexagonArray[i][j].y + HEXAGON_HEIGHT / 2
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

function checkHex(){
      var candidateX = Math.floor((game.input.worldX-hexagonGroup.x)/sectorWidth);
      var candidateY = Math.floor((game.input.worldY-hexagonGroup.y)/sectorHeight);
      var deltaX = (game.input.worldX-hexagonGroup.x)%sectorWidth;
      var deltaY = (game.input.worldY-hexagonGroup.y)%sectorHeight; 
      if(candidateY%2==0){
           if(deltaY<((HEXAGON_HEIGHT/4)-deltaX*gradient)){
                candidateX--;
                candidateY--;
           }
           if(deltaY<((-HEXAGON_HEIGHT/4)+deltaX*gradient)){
                candidateY--;
           }
      }    
      else{
           if(deltaX>=HEXAGON_WIDTH/2){
                if(deltaY<(HEXAGON_HEIGHT/2-deltaX*gradient)){
                     candidateY--;
                }
           }
           else{
                if(deltaY<deltaX*gradient){
                     candidateY--;
                }
                else{
                     candidateX--;
                }
           }
      }
      placeMarker(candidateX,candidateY);
 }

function placeMarker(posX,posY){
 	 for(var i = 0; i < GRID_SIZE_Y; i ++){
		for(var j = 0; j < GRID_SIZE_X; j ++){
			if(GRID_SIZE_Y%2==0 || i+1<GRID_SIZE_Y || j%2==0){
				if (hexagonArray[i][j] != null) {
					hexagonArray[i][j].tint = 0xffffff;
				}
			}
		}
	}
	console.log(posX + " ___ " + GRID_SIZE_X);
	if(posX<0 || posY<0 || posY>=GRID_SIZE_Y || posX>=GRID_SIZE_X - posY%2){
		marker.visible=false;
	}
	else{
		marker.visible=true;
		marker.x = HEXAGON_WIDTH*posX;
		marker.y = HEXAGON_HEIGHT/4*3*posY+HEXAGON_HEIGHT/2;

		//for the halfway point
		if(posY%2==0){
			marker.x += HEXAGON_WIDTH/2;
		}
		else{
			marker.x += HEXAGON_WIDTH;
		}

		if (hexagonArray[posY][posX] != null) {
			hexagonArray[posY][posX].tint = 0x999900;
		}
		// if(markerY+markerX%2<GRID_SIZE_Y/2 && (GRID_SIZE_Y%2==0 || markerY<Math.floor(GRID_SIZE_Y/2))){
		// 	// left
		// 	// if(markerX-1>=0){
		// 	// 	hexagonArray[markerY+markerX%2][markerX-1].tint = 0xff0000;
		// 	// }
		// 	// // right
		// 	// if(markerX+1<GRID_SIZE_X){
		// 	// 	hexagonArray[markerY+markerX%2][markerX+1].tint = 0xff0000;
		// 	// }
		// } 
	}
}	

function addHexagonRow(i){
     var rand;
     hexagonArray[i] = [];
	for(var j = 0; j < GRID_SIZE_X - i % 2; j ++){
          var hexagonX = HEXAGON_WIDTH * j + (HEXAGON_WIDTH / 2) * (i % 2);
          var hexagonY = HEXAGON_HEIGHT * i / 4 * 3;
          rand = Math.floor(Math.random() * 50);
          if (rand == 0) {
               constructTile(hexagonX, hexagonY, i, j, "wallTile");
          } else if(rand >= 1 && rand <= 2)  {
               constructTile(hexagonX, hexagonY, i, j, "grassTile");
               //constructTile(hexagonX, hexagonY, i, j, "emptyTile");
          } else if(rand == 3)  {
               constructTile(hexagonX, hexagonY, i, j, "resourceTile");
          }else {
               constructTile(hexagonX, hexagonY, i, j, "grassTile");
          }
	}
}

function constructTile(hexagonX, hexagonY, i, j, tileType) {
     var tweenTile;
     var tile;
     tile = game.add.sprite(hexagonX, hexagonY, tileType);
     hexagonGroup.add(tile);
     hexagonArray[i][j] = tile; 
     if (tileType == "wallTile") {
          tweenTile = game.add.tween(tile);
          tweenTile.to({ alpha:1, y: hexagonY - HEXAGON_HEIGHT * 0.8}, 1200,  Phaser.Easing.Bounce.Out, true);
     }
     if (tileType == "resourceTile") {
			tweenTile = game.add.tween(tile);
          tweenTile.to({ alpha:1, y: hexagonY - HEXAGON_HEIGHT * 2}, 400,  Phaser.Easing.Quadratic.Out, true);
          tweenTile.onComplete.add(function() {
               tweenTile.to({ alpha:1, y: hexagonY - HEXAGON_HEIGHT * 0.5}, 2000,  Phaser.Easing.Quadratic.In, true);
               tweenTile.start;
          });

     }
}

/*var hexagonText = game.add.text(0 + HEXAGON_WIDTH / 3 + 5, 0 + 15, i + "," + j);
hexagonText.font = "arial";
hexagonText.align = "center";
hexagonText.fontSize = 10;
grassTile.addChild(hexagonText);  */ 