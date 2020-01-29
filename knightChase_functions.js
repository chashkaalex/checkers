
const populateBoardKnightChase = (board) => {		
	emptyTheBoard();	
	placeTheKnight(board, 'white');
	placeTheKnight(board, 'black');
	
};

const placeTheKnight = (board, color) => {
	const randCoords = randomBoardLocation();		//randomly getting the coordinates
	const hor = randCoords.hor;
	const ver = randCoords.ver;
	const coordString = hor+','+ver;
	const boardHtmlElement = document.getElementById(coordString);
	board.contents[hor-1][ver-1] = new KnightPiece(color, hor, ver);
	boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
};

const moveProcedureKnightChase = (game, player) => {
	if (!gameIsRunning) {
		game.isEnded = true;
		return;
	}
	return new Promise(function(resolve, reject) {
	const activeKnight = player.pieces()[0];
	const knightMoves = activeKnight.eligibleMoves()
		setTimeout(function(){ 
			//alert("Hello"); 
			for (knightMove of knightMoves) {				
				if (isFoe(player.board, knightMove, player.color)) {					
					moveThePieceKnightChase (activeKnight, knightMove, player.board);
					game.isEnded = true;
					console.log("gameIsEnded is now", game.isEnded);
					resolve();
					return;
				}
			}
			const randInd = Math.floor(Math.random() * Math.floor(knightMoves.length));
			const randMove = knightMoves[randInd];
			moveThePieceKnightChase (activeKnight, randMove, player.board);
			resolve();
		}, 1000);
	});
};

const randomBoardLocation = () => {
	const randHor = Math.floor(Math.random() * Math.floor(8))+1;
	const randVer = Math.floor(Math.random() * Math.floor(8))+1;
	return {hor: randHor, ver: randVer};
};

const moveThePieceKnightChase = (piece, dest, board) => {
	removeThePiece(piece.coords(), board);		
	piece.hor = dest.hor;
	piece.ver = dest.ver;
	htmlElem = getPieceHtmlElem(piece);
	htmlElem.innerHTML = piece.character();
	board.contents[dest.hor-1][dest.ver-1] = piece;	
};