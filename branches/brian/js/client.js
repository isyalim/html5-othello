var game = Othello.namespace("client.game");
// console.log(game);

game = function() {
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
	}


	// Draws resused images and saves them
	cacheImages = function() {
		var tempCanvas, tempCtx;

		// Draw board
		var boardWidth = NUM_COLS * GRID_SIZE, boardHeight = NUM_ROWS * GRID_SIZE;
		tempCanvas = document.createElement("canvas");
		tempCanvas.width = boardWidth;
		tempCanvas.height = boardHeight;
		tempCtx = tempCanvas.getCtx("2d");

		// Green board
		tempCtx.fillStyle = "#4C9E00";
		tempCtx.fillRect(0, 0, boardWidth, boardHeight);

		// Grid lines
		for (var i = 1; i < NUM_ROWS - 1; i++) {
			for (var j = 1; j < NUM_COLS - 1; j++) {
				ctx.moveTo(i * GRID_SIZE, 0);
				ctx.lineTo(i * GRID_SIZE, boardHeight);
				ctx.stroke();
			}

			ctx.moveTo(0, j * GRID_SIZE);
			ctx.lineTo(boardWidth, j * GRID_SIZE);
			ctx.stroke();
		}

		

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