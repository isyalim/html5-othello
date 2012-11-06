var Othello = {
	// Settings and constants here
};

// start loading when main document is loaded
window.addEventListener("load", function() {
	Modernizr.load([{
		load : [
			// Libraries
			
			// Scripts
			"js/utils.js", "js/client.js"
		],

		complete : function() {
			console.log("All files have been loaded.", Othello);
			
			Othello.game.init();
		}
	}]);
}, false);