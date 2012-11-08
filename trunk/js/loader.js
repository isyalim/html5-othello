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
			console.log("load");
			document.getElementById("mainscreen").style.visibility = "hidden";
			document.getElementById("gamescreen").style.visibility="hidden";
			document.getElementById("loginbutton").addEventListener("click", function(){
			document.getElementById("login").style.visibility = "hidden";
			document.getElementById("gamescreen").style.visibility = "visible";

			});
			Othello.client.game.init();
			Othello.client.game.draw();
			console.log("load");
			
		}
	}]);
}, false);