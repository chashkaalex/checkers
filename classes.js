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
		this.pieces = [];
	}
	pieces
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

	moveProcedure(player) {
		moveProcedureChechkers(player, this.board)
	}
}

class GameKnightChase extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	
	populateBoard(){
		populateBoardKnightChase(this.board);
	}
	moveProcedure(player) {
		moveProcedureKnightChase(player, this.board)
	}
	
}

class GameChess extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	
	populateBoard(){
		populateBoardChess(this.board);
	}
}

//---------Piece Classes----------------------------------

class Piece {
	constructor(color, hor, ver) {
		this.color = color;
		this.ver = ver;
		this.hor = hor;
		this.isAlive = true;		
	}

}

class CheckerPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	eligibleMoves() {		
		let moveArray = [];
		let d = (this.color === 'white') ? 1 : -1;			//'d' is a movement direction 
		if (withinBoard(this.hor+1 , this.ver+d)){
			moveArray.push([this.hor+1 , this.ver+d]);
		}
		
		if (withinBoard(this.hor-1 , this.ver+d)){
			moveArray.push([this.hor-1 , this.ver+d]);
		}
		
		return (moveArray)
	}
	character() {
		return((this.color === 'white') ? '\u26c0' : '\u26c2')
	}
}

class KnightPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	eligibleMoves() {
		const vectors = [[-1,-2],[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2]];
		let moveArray = [];
			for(const vec of vectors){
				if (withinBoard(this.hor+vec[0] , this.ver+vec[1])){
					moveArray.push([this.hor+vec[0] , this.ver+vec[1]]);
				}
			}
		return (moveArray)
	}
	character() {
		return((this.color === 'white') ? '\u2658' : '\u265e')
	}
}

