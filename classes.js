
class ChessBoard {
	constructor() {		
		this.contents = [["1,1", "1,2", "1,3", "1,4", "1,5", "1,6", "1,7", "1,8"],
						 ["2,1", "2,2", "2,3", "2,4", "2,5", "2,6", "2,7", "2,8"],
						 ["3,1", "3,2", "3,3", "3,4", "3,5", "3,6", "3,7", "3,8"],
						 ["4,1", "4,2", "4,3", "4,4", "4,5", "4,6", "4,7", "4,8"],
						 ["5,1", "5,2", "5,3", "5,4", "5,5", "5,6", "5,7", "5,8"],
						 ["6,1", "6,2", "6,3", "6,4", "6,5", "6,6", "6,7", "6,8"],
						 ["7,1", "7,2", "7,3", "7,4", "7,5", "7,6", "7,7", "7,8"],
						 ["8,1", "8,2", "8,3", "8,4", "8,5", "8,6", "8,7", "8,8"]];
	}
}

class Player {
	constructor(name, color, board) {
		this.name = name;
		this.color = color;
		this.board = board;		
	}
	pieces() {
		const playerPieces = [];
		this.board.contents.flat().forEach((tile) => {
			if(typeof  tile === 'object'){								
				let thePiece = tile;					//this is made for  readability purposes only
				if(thePiece.color === this.color){
					playerPieces.push(thePiece);
				}
			}
		});
		return playerPieces;
	}
	activePieces = [];
}

//---------Game Classes----------------------------------

class Game {
	constructor(player1Name, player2Name) {		
		this.board = new ChessBoard();
		this.player1 = new Player(player1Name, 'white', this.board);
		this.player2 = new Player(player2Name, 'black', this.board);		
		this.numOfMoves = 0;
	}		
	isEnded = false;		
}

class GameCheckers extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	populateBoard(){		
		populateBoardCheckers(this.board);
	}

	async moveProcedure(game, player) {
		await moveProcedureCheckers(game, player);
	}
}

class GameKnightChase extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	
	populateBoard(){
		populateBoardKnightChase(this.board);
	}
	async moveProcedure(game, player) {
		await moveProcedureKnightChase(game, player);
	}
	
}

class GameChess extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}	
	populateBoard(){
		populateBoardChess(this.board);
	}
	
	async moveProcedure(game, player) {
		await moveProcedureChess(game, player);
	}	
}

class NullGame extends Game {
	constructor(player1Name, player2Name) {
		super(player1Name, player2Name)
	}
	isEnded = true;
}

const gameClasses = {
    GameCheckers,
    GameKnightChase,
	GameChess
};

class DynamicGameClass {
    constructor (className, player1Name, player2Name) {		
		if (className in gameClasses) {
			console.log("This game exists!");
			return new gameClasses[className](player1Name, player2Name);			
		}
		return new NullGame(player1Name, player2Name);
    }
}
//---------Piece Classes----------------------------------

class Piece {
	constructor(color, hor, ver) {
		this.color = color;
		this.ver = ver;
		this.hor = hor;		
	}
	contElem() {
		return document.getElementById((this.hor)+','+(this.ver));
	}
	
	coords() {
		return {hor: this.hor, ver: this.ver};
	}
}

class CheckerPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)		
	}	
	
	justMoved = false;
	isKing = false;	
	vectors = [[-1,-1],[-1,1],[1,1],[1,-1]];
	
	d() {
		return (this.color === 'white') ? 1 : -1;		//'d' is a movement direction 
	}
	
	eligibleMoves() {	
		const moveArray = [];				
		if (this.isKing) {
			for(let i=1;i<8;i++) {
				for(const vec of this.vectors){
					if (withinBoard(this.hor+vec[0]*i , this.ver+vec[1]*i)){
						moveArray.push({hor: this.hor+vec[0]*i , ver: this.ver+vec[1]*i});
					}
				}				
			}
		} else {
			if (withinBoard(this.hor+1 , this.ver+this.d())){			
				moveArray.push({hor: this.hor+1 , ver: this.ver+this.d()});
			}
			if (withinBoard(this.hor-1 , this.ver+this.d())){
				moveArray.push({hor: this.hor-1 , ver: this.ver+this.d()});
			}
			
			if(this.justMoved) {								
				if (withinBoard(this.hor+1 , this.ver-this.d())){			
					moveArray.push({hor: this.hor+1 , ver: this.ver-this.d()});
				}
				if (withinBoard(this.hor-1 , this.ver-this.d())){
					moveArray.push({hor: this.hor-1 , ver: this.ver-this.d()});
				}
			}
		}
		return (moveArray);
	}
	
	character() {
		if (this.isKing){
			return((this.color === 'white') ? whiteKing : blackKing);
		} else {
			return((this.color === 'white') ? whiteMan : blackMan);
		}
		
	}
}

//---------Chess Piece Classes----------------------------------


class KingPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	vectors = [[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]];
	eligibleMoves() {
		const moveArray = [];
			for(const vec of this.vectors){
				if (withinBoard(this.hor+vec[0] , this.ver+vec[1])){
					moveArray.push({hor: this.hor+vec[0] , ver: this.ver+vec[1]});
				}
			}
		return (moveArray);
	}
	character() {
		return((this.color === 'white') ? whiteChessKing : blackChessKing);
	}
}

class KnightPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	vectors = [[-1,-2],[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2]];
	eligibleMoves() {		
		const moveArray = [];
			for(const vec of this.vectors){
				if (withinBoard(this.hor+vec[0] , this.ver+vec[1])){
					moveArray.push({hor: this.hor+vec[0] , ver: this.ver+vec[1]});
				}
			}
		return (moveArray)
	}
	character() {
		return((this.color === 'white') ? whiteKnight : blackKnight)
	}
}

class BishopPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	vectors = [[-1,-1],[-1,1],[1,1],[1,-1]];
	eligibleMoves() {
		const moveArray = [];
		for(let i=1;i<8;i++) {
			for(const vec of this.vectors){
				if (withinBoard(this.hor+vec[0] , this.ver+vec[1])){
					moveArray.push({hor: this.hor+vec[0] , ver: this.ver+vec[1]});
				}
			}
		}
		return (moveArray);
	}
	character() {
		return((this.color === 'white') ? whiteBishop : blackBishop);
	}
}

class RookPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	vectors = [[-1,0],[0,1],[1,0],[0,-1]];
	eligibleMoves() {
		const moveArray = [];
		for(let i=1;i<8;i++) {
			for(const vec of this.vectors){ 
				if (withinBoard(this.hor+vec[0]*i , this.ver+vec[1]*i)){
					moveArray.push({hor: this.hor+vec[0]*i , ver: this.ver+vec[1]*i});
				}				
			}			
		}
		return (moveArray);
	}
	character() {
		return((this.color === 'white') ? whiteRook : blackRook);
	}
}

class QueenPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	vectors = [[-1,-1],[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1]];
	eligibleMoves() {
		const moveArray = [];
		for(let i=1;i<8;i++) {
			for(const vec of this.vectors){ 
				if (withinBoard(this.hor+vec[0]*i , this.ver+vec[1]*i)){
					moveArray.push({hor: this.hor+vec[0]*i , ver: this.ver+vec[1]*i});
				}				
			}
		}
		return (moveArray);
	}
	character() {
		return((this.color === 'white') ? whiteQueen : blackQueen);
	}
}

class PawnPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}	
	
	hasMoved = false;	
	doubleMoved = false;

	d() {
			return (this.color === 'white') ? 1 : -1;		//'d' is a movement direction 
		}	
	eligibleMoves() {
		const moveArray = [];
		if (withinBoard(this.hor , this.ver+this.d())) {			
			moveArray.push({hor: this.hor, ver: this.ver+this.d()});
			if (!this.hasMoved) {
				moveArray.push({hor: this.hor, ver: this.ver+2*this.d()});
			}
		}
		if (withinBoard(this.hor+1 , this.ver+this.d())) {
			moveArray.push({hor: this.hor+1, ver: this.ver+this.d()});			
		}
		if (withinBoard(this.hor-1 , this.ver+this.d())) {
			moveArray.push({hor: this.hor-1, ver: this.ver+this.d()});			
		}
		return (moveArray);
	}
	character() {
		return((this.color === 'white') ? whitePawn : blackPawn);
	}
}

const chessClasses = {
    PawnPiece,
    KnightPiece,
	BishopPiece,
	RookPiece,
	QueenPiece,
	KingPiece
};

class DynamicChessClass {
    constructor (className, color, hor, ver) {
        return new chessClasses[className](color, hor, ver);
    }
}
