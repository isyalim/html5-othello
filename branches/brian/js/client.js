Othello.client.game = function() {
	// Constants
	var EMPTY = 0, WHITE = 1, BLACK = 2;
	var NUM_ROWS = 8, NUM_COLS = 8;
	var GRID_SIZE = 50;

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
		var boardWidth = NUM_COLS * GRID_SIZE, boardHeight = NUM_ROWS * GRID_SIZE;
		tempCanvas = document.createElement("canvas");
		tempCanvas.width = boardWidth;
		tempCanvas.height = boardHeight;
		tempCtx = tempCanvas.getContext("2d");

		// Green board
		tempCtx.fillStyle = "#4C9E00";
		tempCtx.fillRect(0, 0, boardWidth, boardHeight);

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

		// Draw black piece
	}

	// Draws game board and pieces
	draw = function() {
		// Draw board image to screen
		ctx.drawImage(boardImage, 0, 0);

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