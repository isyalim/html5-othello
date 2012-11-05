var game = Othello.namespace("client.game");

game = function() {
	// Constants
	var EMPTY = 0, WHITE = 1, BLACK = 2;

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
		tempCanvas = document.createElement("canvas");
		tempCanvas.width = 400;
		tempCanvas.height = 400;
		tempCtx = tempCanvas.getCtx("2d");

		// Green board
		tempCtx.fillStyle = "#4C9E00";
		tempCtx.fillRect(0, 0, 150, 175);

		// Draw white piece

		// Draw black piece
	}

	// Draws game board and pieces
	draw = function() {
		// Draw board image to screen

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
		draw : draw
	}
}();