var check = false;
var checkmate = false;
const pieceOrder = ['RookPiece','KnightPiece','BishopPiece','QueenPiece','KingPiece','BishopPiece','KnightPiece','RookPiece'];
const populateBoardChess = (board) => {		
	emptyTheBoard();

	for(let hor=1;hor<9;hor++) {
		populateTileChess(board, pieceOrder[hor-1], 'white', hor, 1);
		populateTileChess(board, 'PawnPiece', 'white', hor, 2);
		populateTileChess(board, pieceOrder[hor-1], 'black', hor, 8);
		populateTileChess(board, 'PawnPiece', 'black', hor, 7);
	}
};

const populateTileChess = (board, pieceType, color, hor, ver) => {	
	let boardHtmlElement;
	let coordString = "";
	board.contents[hor-1][ver-1] = new DynamicChessClass(pieceType, color, hor, ver);
	coordString = hor+','+ver;
	boardHtmlElement = document.getElementById(coordString);									
	boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
	boardHtmlElement.classList.add("populated");
};

const moveProcedureChess = async (game, player) => {
	getPlayerActivePiecesChess(player);	
	if(player.activePieces.length>0){
		await getPlayerResponseChess(player);
		if (!gameIsRunning || checkmate) {
			game.isEnded = true;
			return;
		}	
	} else{
		if(player.pieces().length===0){
			game.isEnded = true;
		}
	}

	$(".movedPiece").removeClass("movedPiece");	
};

const getPlayerActivePiecesChess = (player) => {
	player.activePieces = [];		
	for (const thePiece of player.pieces()) {
		if(pieceHasMovesChess(thePiece, player.board) ){
			const pieceElem = thePiece.contElem();
			pieceElem.classList.add("activePiece");
			player.activePieces.push(thePiece);
		}					
	}

	console.log(player.name + ' has ' + player.pieces().length + ' pieces total.');
	console.log(player.name + ' has ' + player.activePieces.length + ' active pieces.');
};

const pieceHasMovesChess = (piece, board) => {
	const pieceType = piece.constructor.name;
		//debugger;
		if (pieceType === 'PawnPiece') {			
			for (const move of piece.eligibleMoves()) {
				if(pawnCanMove(board, move, piece)) {
					return true;
				}
			}	
		} else if (pieceType === 'KnightPiece' || pieceType === 'KingPiece') {
			for (const move of piece.eligibleMoves()) {
				if(knightKingCanMove(board, move, piece)) {
					return true;
				}
			}			
		} else {
			const dynamicMoves = getDynamicMoves(board, piece);
			if(dynamicMoves.length) {
				return true;
			}		
		}
	return false;
};

const pawnCanMove = (board, move, piece) => {
	if (move.hor === piece.hor) {
		if(isVacant(board, move)) {
			return true;
		}		
	} else {
		if(!isVacant(board, move)) {
			if (isFoe(board, move, piece.color)) {
					return true;
			}
		}		
	}
	return false;
};

const knightKingCanMove = (board, move, piece) => {
	if(isVacant(board, move)) {
		return true;
	} else if(isFoe(board, move, piece.color)) {
		return true;
	}	
	return false;
};

const getDynamicMoves = (board, piece) => {
	let pieceMoves = [];
	for(const vec of piece.vectors){
		pieceMoves = pieceMoves.concat(getPieceDirectionMoves(board, piece, vec[0], vec[1]));
	}	
	return pieceMoves;
};

const getPieceDirectionMoves = (board, piece, horDir, verDir) => {
	const dirMoves = [];
	let i = 1;
	let currentMove;
	while((piece.hor+i*horDir)>0 && (piece.hor+i*horDir)<9 && (piece.ver+i*verDir)>0 && (piece.ver+i*verDir)<9) {
		//debugger;
		currentMove = {hor: piece.hor+i*horDir, ver: piece.ver+i*verDir};
		if(isVacant(board, currentMove)) {
			dirMoves.push(currentMove);
		} else {
			if(isFoe(board, currentMove, piece.color)) {
				dirMoves.push(currentMove);
			}
			break;
		}
		i++;
	}
	return dirMoves;
}

const getPlayerResponseChess = (player) => {	
	return new Promise(function(resolve, reject) {
		let timer = 0;	
		let selectedPiece = null;
		let prevSelElem = document.createElement('div');
		prevSelElem.setAttribute("id", "noId");
		let hold = setInterval(() => { 				
		if (!gameIsRunning) {
			console.log("game stopped running!")
			clearInterval(hold);
			resolve();
		}
		let newDest = {hor: 0, ver: 0};
		let selElem;			
		if (pieceIsSelected()) {
			selElem = getSelectedElem('selectedPiece');				
			if(selElem.id !== prevSelElem.id) {									
				removePrevPosDes();
				selectedPiece = getPieceFromHtmlId(selElem.id, player.board);
				drawMovesChess(player.board, selectedPiece);				
				prevSelElem = selElem;					
			}			
			if(destinationSelected()) {			
				const destElem = getSelectedElem('selectedDestination');
				newDest.hor = parseInt(destElem.id.substr(0, destElem.id.indexOf(',')));
				newDest.ver = parseInt(destElem.id.substr(destElem.id.indexOf(',')+1, destElem.id.length-1));
				timer = Infinity;
			}
		}		
		timer++;					
		if(timer>moveDuration*10){
			clearInterval(hold);
			removePrevPosDes();
			if(selectedPiece && newDest.hor) {
				console.log(`Moving the piece from (${selectedPiece.hor},${selectedPiece.ver}) to (${newDest.hor},${newDest.ver})`);
				moveThePieceChess(selectedPiece, newDest, player.board);
			} else {
				console.log("The player didn't select a move, moving over to the next one.");
			}
			clearMoveClasses();	
			resolve();
		}			
		}, 100);
	});		
};

const drawMovesChess = (board, piece) => {
	const pieceType = piece.constructor.name;
	if (pieceType === 'PawnPiece') {
		for (const move of piece.eligibleMoves()) {
			if(pawnCanMove(board, move, piece)) {
				const posDesElem = document.getElementById((move.hor)+','+(move.ver));
				posDesElem.classList.add("possibleDestination");
			}
		}		
	} else if (pieceType === 'KnightPiece' || pieceType === 'KingPiece') {
		for (const move of piece.eligibleMoves()) {
			if(knightKingCanMove(board, move, piece)) {
				const posDesElem = document.getElementById((move.hor)+','+(move.ver));
				posDesElem.classList.add("possibleDestination");
			}					
		}
	} else {
		for (move of getDynamicMoves(board, piece)){
			const posDesElem = document.getElementById((move.hor)+','+(move.ver));
			posDesElem.classList.add("possibleDestination");			
		}
	}
};

const moveThePieceChess = (piece, dest, board) => {
	const pieceType = piece.constructor.name;
	removeThePiece(piece.coords(), board);	
	if(!isVacant(board, dest)) {
		const takenPiece = getPieceFromHtmlId(dest.hor+','+dest.ver, board)
		const takenPieceType = takenPiece.constructor.name;
		removeThePiece(dest, board);
		console.log(`${takenPiece.color} ${takenPieceType} was taken!`)
		if (takenPieceType=== 'KingPiece') {
			checkmate = true;
		}
	}
	piece.hor = dest.hor;
	piece.ver = dest.ver;
	if (pieceType === 'PawnPiece') {
		piece.hasMoved = true;
		if ((piece.ver === 8 && piece.color === "white") ||
			(piece.ver === 1 && piece.color === "black")) {
			let pieceTypeSelected = false;
			let newPieceType;
			while(!pieceTypeSelected) {
				const choosePieceType = prompt("To what piece type you'd like to promote the pawn? (1 - rook, 2 - knight, 3 - bishop, 4 - queen)", 4);	if (!isNaN(choosePieceType)&& choosePieceType>0 && choosePieceType<5) {
					pieceTypeSelected = true;
					newPieceType = parseInt(choosePieceType);
				}
			}
			//code to ask the user to what piece he wants to convert the pawn
			piece = new DynamicChessClass(pieceOrder[newPieceType-1], piece.color, piece.hor, piece.ver);
			console.log(`this piece is now a ${newPieceType}!`);
		}		
	}
	htmlElem = getPieceHtmlElem(piece);
	htmlElem.innerHTML = piece.character();
	htmlElem.classList.add("populated","movedPiece");
	board.contents[dest.hor-1][dest.ver-1] = piece;	
};







