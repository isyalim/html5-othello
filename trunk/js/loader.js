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
			document.getElementById("mainscreen").style.display = "none";
			document.getElementById("gamescreen").style.display = "none";
			document.getElementById("loginbutton").addEventListener("click", function(){
			document.getElementById("login").style.display = "none";
			document.getElementById("gamescreen").style.display= "block";

			});
			Othello.client.game.init();
			Othello.client.game.draw();
			console.log("load");
			
		}
	}]);
}, false);