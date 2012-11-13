#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
var playerList= new Array();
var boardList= new Array();
var gameIDCounter=0;


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(9090, function() {
    console.log((new Date()) + ' Server is listening on port 9090');
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    var connection = request.accept('echo-protocol', request.origin);
	console.log(request.data);
	
	
	
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
            console.log('Received Message: ' + message.utf8Data);
			var receivedData=eval('(' + message.utf8Data + ')');
			switch(receivedData.keyCode){
				case 0:
					var playerName=receivedData.loginData;
					var playerExists=false;
					for(var i=0; i<playerList.length;i++)
					{
						if(playerList[i].name==playerName)
						playerExists=true;
					}
					if(!playerExists){
						var newPlayer= new ClientPlayer(playerName,connection);
						playerList.push(newPlayer);
						var o={
							keyCode:1,
							players:currentPlayers()
						}
						connection.send(JSON.stringify(o));
						
						var addedData={
							keyCode:4,
							players:currentPlayers()
						}
						for(var i=0;i<playerList.length;i++){
							var p=playerList[i];
							playerList[i].connection.send(JSON.stringify(addedData));
						}
					}
					else{
						var o={
							keyCode:2
						}
						connection.send(JSON.stringify(o));
					}
					
				break;
				  
				  case 5:
				  var chatData= receivedData.chatData;
				  var sentFrom= receivedData.sentFrom;
				  var now= new Date();
				  
				  var sentMessage = sentFrom + "(" +  (now.getHours() +1) +  ":" +now.getMinutes() +  ":" +now.getSeconds() + "): " + chatData;
				  var o={
							keyCode:6,
							chatData:sentMessage
						}
					console.log(sentMessage);
						
						for(var i=0;i<playerList.length;i++){
							var p=playerList[i];
							p.connection.send(JSON.stringify(o));
						}
				
				  break;
				  
				  case 7:
				  var inviteTo=receivedData.inviteTo;
				  var invitefrom=receivedData.inviteFrom;
				  for(var i=0; i<playerList.length;i++)
				  {
					var p= playerList[i];
					if(p.name==inviteTo)
					{
						 var o={
							keyCode:8,
							inviteFrom:invitefrom
						}
						p.connection.send(JSON.stringify(o));
					}
				  }
				  break;
				  
				  case 9:
					var sentFrom=receivedData.sentFrom;
					var acceptedPlayer=receivedData.acceptedPlayer;
					var playerToFind="";
					var sentFromPlayer="";
					var toFindIndex=-1
					var sentFromIndex=-1;
					for(var i=0; i<playerList.length;i++){
						var p=playerList[i];
						if(p.name==acceptedPlayer)
						{
							playerToFind=p;
							toFindIndex=i;
						}
						else if(p.name==sentFrom)
						{
							sentFromPlayer=p;
							sentFromIndex=i;
						}
					}
					//both accepted
					if(playerToFind!="" && !playerToFind.inGame){
						gameIDCounter++;
						var createdGame=new GameBoard(new Array([0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,1,2,0,0,0],[0,0,0,2,1,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]),gameIDCounter,sentFromPlayer.name,playerToFind.name);
						var o={
							keyCode:11,
							newGame:createdGame
						}
						playerList[toFindIndex].inGame=true;
						playerList[toFindIndex].gameID=gameIDCounter;
						playerList[sentFromIndex].inGame=true;
						playerList[sentFromIndex].gameID=gameIDCounter;
						sentFromPlayer.connection.send(JSON.stringify(o));
						playerToFind.connection.send(JSON.stringify(o));
					}
					//accepted, but other player not found
					else if(playerToFind==""){
						var o={
							keyCode:12,
							errorMsg:"Player " + acceptedPlayer+ " not found."
						}
						sentFromPlayer.connection.send(JSON.stringify(o));
					}
					//accepted, but other player already in game
					else if(playerToFind.inGame){
						var o={
							keyCode:12,
							errorMsg:"Player " + acceptedPlayer +" is already in game."
						}
						sentFromPlayer.connection.send(JSON.stringify(o));
					}
				  break;
				  case 10:
					
					var sentFrom=receivedData.sentFrom;
					var declinedPlayer=receivedData.declinedPlayer;
					var playerToFind="";
					for(var i=0; i<playerList.length;i++){
						var p=playerList[i];
						if(p.name==declinedPlayer)
						{
							
							playerToFind=p;
							console.log(p.name + " " + playerToFind);
						}
					}
					if(playerToFind!=""){
						var o={
							keyCode:12,
							errorMsg:"Player " + sentFrom +" has declined your invitation."
						}
						console.log("sent 12");
						playerToFind.connection.send(JSON.stringify(o));
					}
					else
					{
						console.log("breaks");
					}
				  break;
			}
			
    });
    connection.on('close', function(reasonCode, description) {
		
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		var id=-1;
		var removedP="";
		for(var i=0;i<playerList.length;i++){
			var p=playerList[i];
			if(p.connection==connection){
				id=playerList.indexOf(p);
				removedP=p.name;
			}
		}
		if(id!=-1)
		playerList.splice(id,1);
		
		var o={
			keyCode:3,
			removedPlayer:removedP,
			players:currentPlayers()
		}
		for(var i=0;i<playerList.length;i++){
			var p=playerList[i];
			p.connection.send(JSON.stringify(o));
		}
		
    });
});

//returns an array of a list of the current players in the area
function currentPlayers()
{
	var returnedArray= new Array();
	for(var i=0; i<playerList.length;i++)
	{
		if(!playerList[i].inGame)
		{
			returnedArray.push(playerList[i].name);
		}
	}
	return returnedArray;
	
}


//ITEMS
function GameBoard(curBoard,gID,p1,p2){
				//ivars - unique for every instance
				this.layout=curBoard;
				this.gameId=gID;
				this.player1=p1;
				this.player2=p2;
				this.whoseTurn=this.player1;
			}
function ClientPlayer(pName,conn){
				//ivars - unique for every instance
				this.name=pName;
				this.inGame=false;
				this.gameId=0;
				this.connection=conn;
			}
function DataMessage(type,data,sentFrom){
				//ivars - unique for every instance
				this.msgType=type;
				this.sender=sentFrom;
				this.data=data;
			}

function Challenge(p1,p2,cID){
				//ivars - unique for every instance
				this.player1=p1;
				this.player2=p2;
				this.challengeID=this.cID;
			}