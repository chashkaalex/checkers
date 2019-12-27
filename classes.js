class ChessBoard {
	constructor() {
		//this.gameType = gameType;
		
		this.contents = [["1,1", "1,2", "1,3", "1,4", "1,5", "1,6", "1,7", "1,8"],
							  ["2,1", "2,2", "2,3", "2,4", "2,5", "2,6", "2,7", "2,8"],
							  ["3,1", "3,2", "3,3", "3,4", "3,5", "3,6", "3,7", "3,8"],
							  ["4,1", "4,2", "4,3", "4,4", "4,5", "4,6", "4,7", "4,8"],
							  ["5,1", "5,2", "5,3", "5,4", "5,5", "5,6", "5,7", "5,8"],
							  ["6,1", "6,2", "6,3", "6,4", "6,5", "6,6", "6,7", "6,8"],
							  ["7,1", "7,2", "7,3", "7,4", "7,5", "7,6", "7,7", "7,8"],
							  ["8,1", "8,2", "8,3", "8,4", "8,5", "8,6", "8,7", "8,8"]]
	}
	
	
}

class Player {
	constructor(name, color) {
		this.name = name;
		this.color = color;
	}
}

//---------Game Classes----------------------------------

class Game {
	constructor(player1Name, player2Name) {		
		this.player1 = new Player(player1Name, 'white');
		this.player2 = new Player(player2Name, 'black');
		this.board = new ChessBoard();
		this.numOfMoves = 0;
		this.isEnded = false;
	}
		
	endGame(){}		
}

class GameCheckers extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	populateBoard(){		
		populateBoardCheckers(this.board);
	}
}

class GameKnightChase extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	
	populateBoard(){
		populateBoardTwoKnights();
	}
}

class GameChess extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	
	populateBoard(){
		populateBoardChess();
	}
}

//---------Piece Classes----------------------------------

class Piece {
	constructor(color, ver, hor) {
		this.color = color;
		this.ver = ver;
		this.hor = hor;
		this.isAlive = true;		
	}

}

class CheckerPiece extends Piece {
	constructor(color, ver, hor) {
		super(color, ver, hor)
	}
	eligibleMoves() {
		let moveArray = [];
		let d = (this.color === 'white') ? 1 : -1;			//this is a direction 
		moveArray.push([this.ver+d,this.hor+1]);
		moveArray.push([this.ver+d,this.hor-1]);
		return (moveArray)
	}
	character() {
		return((this.color === 'white') ? '\u26c0' : '\u26c2')
	}
}

