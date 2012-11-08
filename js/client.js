Othello.client.game = function() {
	// Constants
	var EMPTY = 0, WHITE = 1, BLACK = 2;
	var NUM_ROWS = 8;var NUM_COLS = 8;
	var GRID_SIZE = 50;
	var boardWidth=NUM_ROWS*GRID_SIZE;
	var boardHeight=NUM_COLS*GRID_SIZE;
	
	// Variables
	var boardImage;
	var whitePieceImage;
	var blackPieceImage;

	var canvas, ctx;

	init = function() {
		canvas = document.querySelector("#gameBoard");
		ctx = canvas.getContext("2d");

		cacheImages();
	}


	// Draws resused images and saves them
	cacheImages = function() {
		var tempCanvas, tempCtx;

		// Draw board
		var sideWidth = NUM_ROWS * GRID_SIZE;
		tempCanvas = document.createElement("canvas");
		tempCanvas.width = sideWidth;
		tempCanvas.height = sideWidth;
		tempCtx = tempCanvas.getContext("2d");

		// Green board
		tempCtx.fillStyle = "#4C9E00";
		tempCtx.fillRect(0, 0, sideWidth, sideWidth);

		// Grid lines
		for (var i = 1; i < NUM_ROWS; i++) {
			for (var j = 1; j < NUM_COLS; j++) {
				tempCtx.moveTo(j * GRID_SIZE, 0);
				tempCtx.lineTo(j * GRID_SIZE, boardHeight);
				tempCtx.stroke();
			}
			tempCtx.moveTo(0, i * GRID_SIZE);
			tempCtx.lineTo(boardWidth, i * GRID_SIZE);
			tempCtx.stroke();
		}
		
		boardImage = new Image();
		boardImage.src = tempCanvas.toDataURL();
		
		// Draw white piece
		tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
		console.log(tempCanvas.width);
		tempCtx.fillStyle = "#FFFFFF";
		tempCtx.beginPath();
		tempCtx.arc(20, 20, 20, 0, Math.PI*2, true); 
		tempCtx.closePath();
		tempCtx.fill();
		whitePieceImage = new Image();
		whitePieceImage.src = tempCanvas.toDataURL();
		// Draw black piece
		
		tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
		tempCtx.fillStyle = "#000000";
		tempCtx.beginPath();
		tempCtx.arc(20, 20, 20, 0, Math.PI*2, true); 
		tempCtx.closePath();
		tempCtx.fill();
		blackPieceImage = new Image();
		blackPieceImage.src = tempCanvas.toDataURL();
	}

	// Draws game board and pieces
	draw = function() {
		// Draw board image to screen
		ctx.drawImage(boardImage, 0, 0);
		for(var i=0; i<NUM_ROWS; i++)
		{
			for(var j=0; j<NUM_COLS; j++)
			{
				if(((i+10)-j)%2==0)
				ctx.drawImage(whitePieceImage,(i*50) + 5,(j*50) + 5);
				else
				ctx.drawImage(blackPieceImage,(i*50) + 5,(j*50) + 5);
			}
		}
		// Draw pieces based on current board state
	}

	// Check for game over conditions
	checkGameOver = function() {

	}

	// Update board cell to new state
	updateCell = function(x, y, state) {
		// Update local version of board

		// Push update to server
	}

	return {
		draw : draw,
		init : init
	}
}();