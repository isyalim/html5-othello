var Othello = {
	// Namespaces
	server : {

	},

	client : {

	}
};

// start loading when main document is loaded
window.addEventListener("load", function() {
	Modernizr.load([{
		load : [
			// Libraries
			// Scripts
			/*"js/utils.js"*/, "js/client.js"
		],

		complete : function() {
			console.log("All files have been loaded.", Othello);
			document.getElementById("mainscreen").style.display = "none";
			document.getElementById("gamescreen").style.display = "none";
			Othello.client.game.init();
			Othello.client.game.draw();
			
		}
	}]);
}, false);