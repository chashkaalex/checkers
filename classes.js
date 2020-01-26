const whiteMan = String.fromCharCode(parseInt('26c0', 16))			// '\u26c0';
const whiteKing = String.fromCharCode(parseInt('26c1', 16))			//'\u26c1';
const blackMan = String.fromCharCode(parseInt('26c2', 16))			//'\u26c2';
const blackKing = '\u26c3';
const blackKnight = '\u265e'
const whiteKnight = '\u2658' 



class ChessBoard {
	constructor() {		
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
		await moveProcedureCheckers(game, player)
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
		await moveProcedureKnightChase(game, player)
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
	isKing = false;	
	// coords() {
		// return {hor: this.hor, ver: this.ver};
	// }
	
	d() {
		return (this.color === 'white') ? 1 : -1;		//'d' is a movement direction 
	}
	
	eligibleMoves(chainMove) {		//chainmove is a boolean that determines if current move is a chain and thus the piece can also move backwards
		const moveArray = [];			//it also can be used to exercise the 'striking back' rule if needed.	
		if (this.isKing) {
			for(let i=1;i<8;i++) {
				if (withinBoard(this.hor+i , this.ver+i)){			
					moveArray.push({hor: this.hor+i , ver: this.ver+i});
				}
				if (withinBoard(this.hor-i , this.ver+i)){			
					moveArray.push({hor: this.hor-i , ver: this.ver+i});
				}
				if (withinBoard(this.hor+i , this.ver-i)){			
					moveArray.push({hor: this.hor+i , ver: this.ver-i});
				}
				if (withinBoard(this.hor-i , this.ver-i)){			
					moveArray.push({hor: this.hor-i , ver: this.ver-i});
				}
			}
		} else {
			if (withinBoard(this.hor+1 , this.ver+this.d())){			
				moveArray.push({hor: this.hor+1 , ver: this.ver+this.d()});
			}
			if (withinBoard(this.hor-1 , this.ver+this.d())){
				moveArray.push({hor: this.hor-1 , ver: this.ver+this.d()});
			}
			
			if(chainMove) {								
				if (withinBoard(this.hor+1 , this.ver-this.d())){			
					moveArray.push({hor: this.hor+1 , ver: this.ver-this.d()});
				}
				if (withinBoard(this.hor-1 , this.ver-this.d())){
					moveArray.push({hor: this.hor-1 , ver: this.ver-this.d()});
				}
			}
		}
		return (moveArray)
	}
	
	character() {
		if (this.isKing){
			return((this.color === 'white') ? whiteKing : blackKing);
		} else {
			return((this.color === 'white') ? whiteMan : blackMan);
		}
		
	}
}

//---------Chesss Piece Classes----------------------------------

class KnightPiece extends Piece {
	constructor(color, hor, ver) {
		super(color, hor, ver)
	}
	eligibleMoves() {
		const vectors = [[-1,-2],[-2,-1],[-2,1],[-1,2],[1,2],[2,1],[2,-1],[1,-2]];
		let moveArray = [];
			for(const vec of vectors){
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
