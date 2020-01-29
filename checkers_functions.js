var moveIsCompelled = false;	//global variable indicating if the current move is compelled by the rules.

const populateBoardCheckers = (board) => {
	//console.log("Starting populateBoardCheckers");		
	emptyTheBoard();
	let boardHtmlElement;
	let coordString = "";
	for(let ver=1;ver<4;ver++) {
		for(let hor=1;hor<9;hor++) {
			coordString = hor+','+ver;
			boardHtmlElement = document.getElementById(coordString);
			if(boardHtmlElement.classList.contains("black")) {
				board.contents[hor-1][ver-1] = new CheckerPiece('white',hor,ver);									
				boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
				boardHtmlElement.classList.add("populated");				
			}
			coordString = hor+','+(9-ver);
			boardHtmlElement = document.getElementById(coordString);
			if(boardHtmlElement.classList.contains("black")) {
				board.contents[hor-1][9-ver-1] = new CheckerPiece('black',hor,(9-ver));									
				boardHtmlElement.innerHTML = board.contents[hor-1][(9-ver-1)].character();
				boardHtmlElement.classList.add("populated");				
			}
		}
	}
};

const moveProcedureCheckers = async (game, player) => {
	//console.log("Starting moveProcedureCheckers");
	getPlayerActivePiecesCheckers(player);	
	if(player.activePieces.length>0){
		await getPlayerResponseCheckers(player);
		if (!gameIsRunning) {
			//console.log("resetting the game");
			game.isEnded = true;
			return;
		}		
		//console.log("Player reponse resolved.");		
	} else{
		if(player.pieces().length===0){
			game.isEnded = true;
		}
	}
	if(!game.isEnded) {
		const movedPieceElem = getSelectedElem("movedPiece");
		const movedPiece = getPieceFromHtmlId(movedPieceElem.id, player.board);
		while(moveIsCompelled) {
			if (!gameIsRunning) {
				game.isEnded = true;
				return;
			}		
			console.log("This move was a strike, checking the possibility of the chain move!");
			if (pieceCanStrikeCheckers(movedPiece, player.board)) {
				console.log("This piece can strike again!");
				await getPlayerChainResponseCheckers(player);
			} else {
				moveIsCompelled = false;		
			}
		}
		$(".movedPiece").removeClass("movedPiece");	
		movedPiece.justMoved = false;
		moveIsCompelled = false;		
	}
};

const getPlayerActivePiecesCheckers = (player) => {
	player.activePieces = [];		
	for (const thePiece of player.pieces()) {
		if(pieceHasMovesCheckers(thePiece, player.board) ){
			const pieceElem = thePiece.contElem()
			pieceElem.classList.add("activePiece");
			player.activePieces.push(thePiece);
		}					
	}
	if (moveIsCompelled) {
		//debugger;
		//console.log(player.name + ' has ' + player.activePieces.length + ' active pieces before the filtering.')
		player.activePieces = filterJumps(player.activePieces, player.board);
	}
	console.log(player.name + ' has ' + player.pieces().length + ' pieces total.');
	console.log(player.name + ' has ' + player.activePieces.length + ' active pieces.');
};

const getPlayerResponseCheckers = (player) => {
	//console.log("Starting getPlayerResponseCheckers")	
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
				if(moveIsCompelled) {
					console.log("this move is compelled");
					drawStrikeMovesCheckers(player.board, selectedPiece);	
				} else {
					drawSimpleMovesCheckers(player.board, selectedPiece);
				} 				
				prevSelElem = selElem;					
			}			
			if(destinationSelected()) {
				//console.log("	selected piece coords: ", selectedPiece.hor, selectedPiece.ver);				
				const destElem = getSelectedElem('selectedDestination');
				newDest.hor = parseInt(destElem.id.substr(0, destElem.id.indexOf(',')));
				newDest.ver = parseInt(destElem.id.substr(destElem.id.indexOf(',')+1, destElem.id.length-1));
				//console.log("New destination is set to : ", newDest.hor+","+ newDest.ver);
				timer = Infinity;
			}
		}		
		timer++;					
		if(timer>moveDuration*10){
			clearInterval(hold);
			removePrevPosDes();
			if(selectedPiece && newDest.hor) {
				console.log(`Moving the piece from (${selectedPiece.hor},${selectedPiece.ver}) to (${newDest.hor},${newDest.ver})`);
				moveThePieceCheckers(selectedPiece, newDest, player.board);
			} else {
				console.log("The player didn't select a move, moving over to the next one.");
				moveIsCompelled = false;
			}
			//debugger;
			clearMoveClasses();	
			resolve();
		}			
		}, 100);
	});		
};

const pieceHasMovesCheckers = (piece, board) => {
	//console.log(`	Checking the moves for the piece on the tile (${piece.hor}, ${piece.ver})`);	
	let result = false;
	if (piece.isKing) {
		const kingMoves = getKingMovesCheckers(board, piece);
		const kingMovesNum = kingMoves.moves.length + kingMoves.jumps.length;
		if (kingMovesNum){result = true;}
	} else {
		for (const move of piece.eligibleMoves()) {
			//console.log("	"+move[0],move[1]);
			if(pieceCanMoveCheckers(board, move, piece)) {
				result = true;
			}
		}
	}	
	return result;
};

const pieceCanMoveCheckers = (board, move, piece) => {
	if(isVacant(board, move)) {
		return true;
	}else if (isFoe(board, move, piece.color)) {
		if(canJump(board, move, piece)){
			//console.log("Foe is near!");
			moveIsCompelled = true;
			return true;
		}
	}
};

const filterJumps = (activePieces, board) => {
	$(".activePiece").removeClass("activePiece");
	const filtered = [];	
	//debugger;
	for (const piece of activePieces){
		if(piece.isKing) {
			const jumps = getKingMovesCheckers(board, piece).jumps
			if (jumps.length>0) {
				const pieceElem = piece.contElem();
				pieceElem.classList.add("activePiece");
				filtered.push(piece);
			}
		} else {
			if(pieceCanStrikeCheckers(piece, board)) {
				const pieceElem = piece.contElem();
				pieceElem.classList.add("activePiece");
				filtered.push(piece);
			}
		}		
	}
	return filtered;
};

const pieceCanStrikeCheckers = (piece, board) => {
	if(piece.isKing) {
		if (getKingMovesCheckers(board, piece).jumps.length>0) {
			console.log("The king can strike!")
			return true;
		} else {
			console.log("The king cannot strike!")
			return false;
		}
	} else {
		for (const move of piece.eligibleMoves()) {
			if (isFoe(board, move, piece.color)) {				
				if(canJump(board, move, piece)){
						return true;
				}
			}
		}
	}
	return false;
};




const getPlayerChainResponseCheckers = (player) => {
	//console.log("Starting getPlayerResponseCheckers")	
	return new Promise(function(resolve, reject) {
		let timer = 0;	
		const selElem = getSelectedElem('movedPiece');
		const selectedPiece = getPieceFromHtmlId(selElem.id, player.board);
		const newDest = {hor: 0, ver: 0};
		let destElem;
		var hold = setInterval(() => { 																				
			if (!gameIsRunning) {
				console.log("game stopped running!")
				clearInterval(hold);
				resolve();
			}
				drawStrikeMovesCheckers(player.board, selectedPiece);														
				if(destinationSelected()) {
					destElem = getSelectedElem('selectedDestination');
					newDest.hor = parseInt(destElem.id.substr(0, destElem.id.indexOf(',')));
					newDest.ver = parseInt(destElem.id.substr(destElem.id.indexOf(',')+1, destElem.id.length-1));
					//console.log("	New destination is set to : ", newDest.hor+","+ newDest.ver);
					timer = Infinity;
				}							
				timer++;							
				if(timer>moveDuration*10){
					clearInterval(hold);
					removePrevPosDes();
					if(selectedPiece && newDest.hor) {
						console.log(`Moving the piece from (${selectedPiece.hor},${selectedPiece.ver}) to (${newDest.hor},${newDest.ver})`);
						moveThePieceCheckers(selectedPiece, newDest, player.board);					
					} else {
						console.log("The player didn't select a move, moving over to the next one.");
						moveIsCompelled = false;
					}
					clearMoveClasses();					
					resolve();
				}			
		}, 100);
	});		
};

const drawStrikeMovesCheckers = (board, piece) => {
	if(piece.isKing) {
		for (const jumpMove of getKingMovesCheckers(board, piece).jumps) {
			const posDesElem = document.getElementById((jumpMove.hor)+','+(jumpMove.ver));
			posDesElem.classList.add("possibleDestination");
		}
	} else {
		for (const move of piece.eligibleMoves()){
			if (isFoe(board, move, piece.color)) {				
				if(canJump(board, move, piece)){
					const posDesElem = document.getElementById((move.hor)+','+(move.ver));
					posDesElem.classList.add("possibleDestination");
				}
			}				
		}
	}	
};

const drawSimpleMovesCheckers = (board, piece) => {
	if (piece.isKing) {
		const kingMoves = getKingMovesCheckers(board, piece);
		for(const kingMove of kingMoves.moves) {
			const posDesElem = document.getElementById((kingMove.hor)+','+(kingMove.ver));
			posDesElem.classList.add("possibleDestination");							
		}						
	} else {
		for (const move of piece.eligibleMoves()){
			if(pieceCanMoveCheckers(board, move, piece)){
				const posDesElem = document.getElementById((move.hor)+','+(move.ver));
				posDesElem.classList.add("possibleDestination");
			}
		}						
	}	
};

const getKingMovesCheckers = (board, piece) => {
	let kingMoves = [];
	let kingJumps = [];
	let kingDirMoves = [];
	for(const vec of piece.vectors){
		kingDirMoves = getKingDirectionMoves(board, piece, vec[0], vec[1]);
		kingMoves = kingMoves.concat(kingDirMoves.moves);
		kingJumps = kingJumps.concat(kingDirMoves.jumps);
	}
	return {moves: kingMoves, jumps: kingJumps};
};

const getKingDirectionMoves = (board, piece, horDir, verDir) => {
	console.log("Starting getKingDirectionMoves");
	const kingDirMoves = [];
	const kingDirJumps = [];
	let i = 1;
	let jumped = false;
	let currentMove;
	while((piece.hor+i*horDir)>0 && (piece.hor+i*horDir)<9 && (piece.ver+i*verDir)>0 && (piece.ver+i*verDir)<9) {
		currentMove = {hor: piece.hor+i*horDir, ver: piece.ver+i*verDir};
		if(isVacant(board, currentMove)) {
			if(jumped) {
				kingDirJumps.push(currentMove);
			} else {
				kingDirMoves.push(currentMove);				
			}
		} else if(!jumped){
			if(isFoe(board, currentMove, piece.color)) {
				if(canJump(board, currentMove, piece)){
					kingDirJumps.push(currentMove);
					console.log("Found a jump!")
					i++;
					moveIsCompelled = true;
					jumped = true;
				} else {break}
			}			
		} else {break}
		i++;
	}
	console.log (`For this direction returning ${kingDirMoves.length} moves and ${kingDirJumps.length}`);
	return {moves: kingDirMoves, jumps: kingDirJumps};
};

const clearMoveClasses = () => {
	$(".activePiece").removeClass("activePiece");
	$(".selectedPiece").removeClass("selectedPiece");
	$(".possibleDestination").removeClass("possibleDestination");
	$(".selectedDestination").removeClass("selectedDestination");
};

const moveThePieceCheckers = (piece, dest, board) => {
	removeThePiece(piece.coords(), board);		
	if (Math.abs(piece.ver - dest.ver)>1) {								 //checking if this move is a jump
		for (let i=1;i<Math.abs(piece.hor - dest.hor);i++) {
			let strikeCoords = {			
				hor: piece.hor + i*((dest.hor-piece.hor)/Math.abs(dest.hor - piece.hor)),
				ver: piece.ver + i*((dest.ver-piece.ver)/Math.abs(dest.ver - piece.ver))
			};	
			if(!isVacant(board, strikeCoords)) {
				removeThePiece(strikeCoords, board);
			}
		}
		piece.justMoved = true;
	}
	piece.hor = dest.hor;
	piece.ver = dest.ver;
	if (!piece.isKing) {
		if ((piece.ver === 8 && piece.color === "white") ||
			(piece.ver === 1 && piece.color === "black")) {
			piece.isKing = true;
			console.log("this piece is now a King!");
		}		
	}
	htmlElem = getPieceHtmlElem(piece);
	htmlElem.innerHTML = piece.character();
	htmlElem.classList.add("populated","movedPiece");
	board.contents[dest.hor-1][dest.ver-1] = piece;	
};
