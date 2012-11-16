Othello.client.messageHandler = function() {

	init = function() {
		window.addEventListener("keydown", function(e){
			if(e.keyCode==13){
				if(gameState==1){
				sendMainChat();
				}
				else if (gameState==2){
				sendGameChat();
				}
		}});
		// Open socket connection to server
		 socket = new WebSocket(serverurl, "echo-protocol");
		 socket.addEventListener("open", function(event) {
		 
          document.getElementById('serverstatus').src = "icons/accept.png";
		  loginbutton.disabled=false;  
		  
        });
		 socket.addEventListener("close", function(event) { 
          document.getElementById('serverstatus').src = "icons/exclamation.png";
		  loginbutton.disabled=true;
        });
		socket.addEventListener("message", function(event) {
         var receivedData=eval('(' + event.data + ')');
		
		//NOTES ON THE JSON KEYCODES
		//0:Client->Server, asking if username is ok/asking to login
		//1:Server->Client, Username is OK, log in
		//2:Server->Client, Username is Not OK
		//3:Server->Client,Player has left, remove them from everyone's user list
		//4:Server->Client, Player was added, add them to the user list
		//5:Client->Server, Chat data while in the main menu
		//6:Server->Client, Returns the formatted chat data to all users
		//7:Client->Server, Sends a game invite to the target player
		//8:Server->Client, Recieves an invite from a player.
		//9:Client->Server, Accepts invitation from another player
		//10:Client->Server, Declines invitation from another player
		//11:Server->Client, Start game between 2 people
		//12:Server->Client, Error starting game, returns what went wrong as a message
		//13:Client->Server, Move made, update other player
		//14:Server->Client, Opponent has made a move, update player
		//15:Client->Server, Player wishes to return to main menu
		//16:Client->Server, Chat data while in the game
		//17:Server->Client, Returns the formatted chat data to users in game
		switch(receivedData.keyCode) {
			//user logs into the main screen, load all users
			case 1:
				playerName=logininput.value;
				document.getElementById("login").style.display = "none";
				document.getElementById("mainscreen").style.display= "block";
				gameState=1;
				var curPlayerList= receivedData.players;
				document.getElementById("userlist").innerHTML="";
				for(var i=0; i<curPlayerList.length;i++)
				{
					document.getElementById("userlist").innerHTML+="<a onclick=inviteselect(\"" + curPlayerList[i]+ "\")>"+curPlayerList[i] + "</a><br/>";
				}
			break;
			//player stays in the main menu because his name is already taken
			case 2:
				  document.getElementById('serverstatus').innerHTML = "this name is already taken/is invalid";
			break;
			
			//changes the player list when a player leaves the main screen
			case 3:
				var curPlayerList= receivedData.players;
				document.getElementById("userlist").innerHTML="";
				for(var i=0; i<curPlayerList.length;i++)
				{
					document.getElementById("userlist").innerHTML+="<a onclick=inviteselect(\"" + curPlayerList[i]+ "\")>"+curPlayerList[i] + "</a><br/>";
				}
				
				if(personToInvite!="" && receivedData!=receivedData.removedPlayer)
				document.getElementById("userlist").innerHTML=document.getElementById("userlist").innerHTML.replace("onclick=\"inviteselect(&quot;"+personToInvite + "&quot;","style=\"color:red\" onclick=\"inviteselect(&quot;" + personToInvite + "&quot;");
				
			break;
			//changes the player list when a player enters the main screen
			case 4:
				var curPlayerList= receivedData.players;
				document.getElementById("userlist").innerHTML="";
				for(var i=0; i<curPlayerList.length;i++)
				{
					document.getElementById("userlist").innerHTML+="<a onclick=inviteselect(\"" + curPlayerList[i]+ "\")>"+curPlayerList[i] + "</a><br/>";
				}
				
				if(personToInvite!="")
				document.getElementById("userlist").innerHTML=document.getElementById("userlist").innerHTML.replace("onclick=\"inviteselect(&quot;"+personToInvite + "&quot;","style=\"color:red\" onclick=\"inviteselect(&quot;" + personToInvite + "&quot;");
				
			break;
			
			//chat data received for the main menu
			case 6:
				var newChatLine= receivedData.chatData + "<br/>";
				document.getElementById("mainchat").innerHTML+=newChatLine;
				
			break;
			
			//game invite received from another player
			case 8:
				var inviteFrom=receivedData.inviteFrom;
				var newChatLine= "Game invite recieved from " + inviteFrom + ".<input type=\"button\" onclick=\"acceptInvite(\'"+ inviteFrom + "\')\" value=\"Accept\"></input>";
				newChatLine+= "<input type=\"button\" onclick=\"declineInvite(\'"+ inviteFrom + "\')\" value=\"Decline\"></input><br/>";
				document.getElementById("mainchat").innerHTML+=newChatLine;
			break;
			
			//the player enters the game
			case 11:
				ctx = canvas.getContext("2d");
				document.getElementById("mainscreen").style.display = "none";
				document.getElementById("mainchat").innerHTML = "";
				document.getElementById("gamescreen").style.display= "block";
				document.getElementById("gamechat").innerHTML = "";
					gameState=2;
				gameData=receivedData.newGame;	
					
				//initializes the board	
				board.init();
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 400, 400);
				ctx.restore();
				
				draw();
				board.grid= new Array();
				board.pieces= new Array();
				board.init();
				ctx.save();
				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.clearRect(0, 0, 400, 400);
				ctx.restore();
				draw();
				
				
				//figures out whose turn it is
				if(gameData.whoseTurn==playerName)
				{
					var addedText="It is your turn!";
					
					if(playerName==gameData.player1)
					addedText+="(Black)<br/>";
					else
					addedText+="(White)<br/>";
					document.getElementById("gamechat").innerHTML+=addedText;
				}
				else
				{
					var addedText="It is " + gameData.whoseTurn+ "'s turn.";
					if(playerName==gameData.player1)
					addedText+="(White)<br/>";
					else
					addedText+="(Black)<br/>";
					document.getElementById("gamechat").innerHTML+=addedText;
				}
			break;
			
			//new chat line added to the main chat associated with errros joining the game
			case 12:
				var errorMsg= receivedData.errorMsg;
				document.getElementById("mainchat").innerHTML+=(errorMsg+ "<br/>");
			break;
			
			//player receives an updated board when an opponent makes a move
			case 14:
				var sentBoard= receivedData.gameBoard;
				var sentPieces=  receivedData.gamePieces;
				var addedText="It is your turn!";
					
				if(playerName==gameData.player1)
				addedText+="(Black)<br/>";
				else
				addedText+="(White)<br/>";
				document.getElementById("gamechat").innerHTML+=addedText;
				board.grid=sentBoard;
				board.pieces=sentPieces;
				draw();
				
				//chacks to see if the game is over
				switch(checkGameOver())
				{
					case 1:				
					changeTurn();
					document.getElementById("gamechat").innerHTML+="No valid moves. You skip your turn.<br/>" + gameData.whoseTurn ;
					break;
					case 2:
					gameOver();
					
					break;
				}
				gameData.whoseTurn=playerName;
			break;
			//adds a new chat line to the player screeen
			case 17:
				var newChatLine= receivedData.chatData + "<br/>";
				document.getElementById("gamechat").innerHTML+=newChatLine;	
			break;
		 }
        });	
		 socket.addEventListener("error", function(event) {
          alert("Error: " + event);
        });
		
		//logs in the user when the login button is pressed
		loginbutton.addEventListener("click",function(){
						var strippedvalue = logininput.value.replace(/(<([^>]+)>)/ig,"");
			var objToSend={
			keyCode:0,
			loginData:strippedvalue
			}
			
			logininput.value = strippedvalue;
			socket.send(JSON.stringify(objToSend));
		});
		
		
		//sends the main chat when the main chat button is pressed
		// mainchatbutton.addEventListener("click",function(){
		// sendMainChat();
		// });
		
		//when the invite button is pressed, a player is invited to a game
		invitebutton.addEventListener("click",function(){
		if(personToInvite==playerName)
			alert("cannot invite yourself to a game");
		else if(personToInvite!="" && personToInvite!=" " && personToInvite!=null)
		{
			var objToSend={
			keyCode:7,
			inviteTo:personToInvite,
			inviteFrom: playerName
			}
			socket.send(JSON.stringify(objToSend));
			document.getElementById("mainchat").innerHTML+="invite to " + personToInvite + " sent.<br/>";
		}
		});
		
		// gamechatbutton.addEventListener("click",function(){
		// sendGameChat();
		// });
	
	}
	
	//when a player's name is clicked, that player's name changed red, to note that he has been selected
	inviteselect= function(playerToInvite){
		personToInvite=playerToInvite;
		var oldHTML=document.getElementById("userlist").innerHTML;
		oldHTML=oldHTML.replace("style=\"color:red\"","");
		var newHTML=oldHTML.replace("onclick=\"inviteselect(&quot;"+playerToInvite + "&quot;","style=\"color:red\" onclick=\"inviteselect(&quot;"+ playerToInvite + "&quot;");
		document.getElementById("userlist").innerHTML=newHTML;
	}
	
	
	//sends a message when an invite is accepted
	acceptInvite = function(targetPlayer){
		var o={
			keyCode:9,
			sentFrom:playerName,
			acceptedPlayer: targetPlayer
			}
		socket.send(JSON.stringify(o));
		removeInvites(targetPlayer);
	}
	
	//sends a message when an invite is declined
	declineInvite = function(targetPlayer){
		var o={
			keyCode:10,
			sentFrom:playerName,
			declinedPlayer: targetPlayer
			}
		socket.send(JSON.stringify(o));
		removeInvites(targetPlayer);
	}
	
	//removes the invites from a certain player whenever an invite is accepted or declined
	removeInvites = function(nameToRemove){
	var inviteText="Game invite recieved from " + nameToRemove + ".<input type=\"button\" onclick=\"acceptInvite(\'"+ nameToRemove + "\')\" value=\"Accept\">";
				inviteText+= "<input type=\"button\" onclick=\"declineInvite(\'"+ nameToRemove + "\')\" value=\"Decline\"><br>";
		var re= new RegExp(inviteText,"g");
		document.getElementById("mainchat").innerHTML=document.getElementById("mainchat").innerHTML.split(inviteText).join("")
	}
}();