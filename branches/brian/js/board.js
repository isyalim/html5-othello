function Board(curBoard,gID,p1,p2){
				//ivars - unique for every instance
				this.layout=curBoard;
				this.gameId=gameId;
				this.player1=p1;
				this.player2=p2;
				this.whoseTurn=this.player1;
			}
			
			
			
		//Bullet methods - all instances share one copy of each function through .prototype
			Board.prototype.updateBoard = function(newBoard){
				this.layout=newBoard;
			};