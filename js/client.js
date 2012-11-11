Othello.client.game = function() {
	// Constants
	var EMPTY = 0, WHITE = 1, BLACK = 2;
	var NUM_ROWS = 8;var NUM_COLS = 8;
	var GRID_SIZE = 50;
	var boardWidth=NUM_ROWS*GRID_SIZE;
	var boardHeight=NUM_COLS*GRID_SIZE;
	var loginbutton=document.getElementById('loginbutton');
	// Variables
	var boardImage;
	var whitePieceImage;
	var blackPieceImage;
	var playerName;
	var canvas, ctx;
	var personToInvite="";
	var socket;
	var serverurl="ws://localhost:9090";

	init = function() {
		// Get canvas context
		canvas = document.querySelector("#gameBoard");
		ctx = canvas.getContext("2d");

		// Create cached images
		cacheImages();

		// Open socket connection to server
		 socket = new WebSocket(serverurl, "echo-protocol");
		 socket.addEventListener("open", function(event) {
		 
          document.getElementById('serverstatus').innerHTML = "Server Connected";
		  loginbutton.disabled=false;  
		  
        });
		 socket.addEventListener("close", function(event) { 
          document.getElementById('serverstatus').innerHTML = "Server Disconnected";
		  loginbutton.disabled=true;
        });
		socket.addEventListener("message", function(event) {
         var recievedData=eval('(' + event.data + ')');
	//	 alert(recievedData.keyCode);
		 switch(recievedData.keyCode)
		 {
			case 1:
				playerName=logininput.value;
				document.getElementById("login").style.display = "none";
				document.getElementById("mainscreen").style.display= "block";
				var curPlayerList= recievedData.players;
				document.getElementById("userlist").innerHTML="";
				for(var i=0; i<curPlayerList.length;i++)
				{
					document.getElementById("userlist").innerHTML+="<a onclick=inviteselect(\"" + curPlayerList[i]+ "\")>"+curPlayerList[i] + "</a><br/>";
				}
			break;
			case 2:
				  document.getElementById('serverstatus').innerHTML = "this name is already taken/is invalid";
			break;
			
			case 3:
				var curPlayerList= recievedData.players;
				document.getElementById("userlist").innerHTML="";
				for(var i=0; i<curPlayerList.length;i++)
				{
					document.getElementById("userlist").innerHTML+="<a onclick=inviteselect(\"" + curPlayerList[i]+ "\")>"+curPlayerList[i] + "</a><br/>";
				}
				
				if(personToInvite!="" && recievedData!=recievedData.removedPlayer)
				document.getElementById("userlist").innerHTML=document.getElementById("userlist").innerHTML.replace("onclick=\"inviteselect(&quot;"+playerToInvite + "&quot;","style=\"color:red\" onclick=\"inviteselect(&quot;" + playerToInvite + "&quot;");
				
			break;
			//User added
			case 4:
				var curPlayerList= recievedData.players;
				document.getElementById("userlist").innerHTML="";
				for(var i=0; i<curPlayerList.length;i++)
				{
					document.getElementById("userlist").innerHTML+="<a onclick=inviteselect(\"" + curPlayerList[i]+ "\")>"+curPlayerList[i] + "</a><br/>";
				}
				
				if(personToInvite!="")
				document.getElementById("userlist").innerHTML=document.getElementById("userlist").innerHTML.replace("onclick=\"inviteselect(&quot;"+playerToInvite + "&quot;","style=\"color:red\" onclick=\"inviteselect(&quot;" + playerToInvite + "&quot;");
				
			break;
		 }
        });	
		 socket.addEventListener("error", function(event) {
          alert("Error: " + event);
        });
		
		loginbutton.addEventListener("click",function(){
			var objToSend={
			keyCode:0,
			loginData:logininput.value
			}
			socket.send(JSON.stringify(objToSend));
		});
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
	
		
	inviteselect= function(playerToInvite){
	personToInvite=playerToInvite;
	var oldHTML=document.getElementById("userlist").innerHTML;
	oldHTML=oldHTML.replace("style=\"color:red\"","");
	//alert(oldHTML);
	var newHTML=oldHTML.replace("onclick=\"inviteselect(&quot;"+playerToInvite + "&quot;","style=\"color:red\" onclick=\"inviteselect(&quot;" + playerToInvite + "&quot;");
	document.getElementById("userlist").innerHTML=newHTML;
	//alert(newHTML);
	}

	// Update board cell to new state
	updateCell = function(x, y, state) {
		// Update local version of board

		// Push update to server
	}

	// Sends move to game server
	sendMove = function(x, y) {
		// Put information into JSON object
		var position = {
			x : x, 
			y : y
		};

		// Send message to server

	}


	return {
		draw : draw,
		init : init
	}
}();