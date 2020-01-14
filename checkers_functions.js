let populateBoardCheckers = (board) => {
	//console.log("Starting populateBoardCheckers");		
	let boardHtmlElement;
	let coordString = "";	
	let theTile;
	emptyTheBoard(board);
	for(let ver=8;ver>0;ver--){
		for(let hor=1;hor<9;hor++){
			coordString = hor+','+ver;
			boardHtmlElement = document.getElementById(coordString);
			
			if(boardHtmlElement.classList.contains("black")){
				//console.log(`This tile is black: ${j}, ${i}`);
				if(ver>5){
					board.contents[hor-1][ver-1] = new CheckerPiece('black',hor,ver);					
					//console.log('New piece was created with coords: '+board.contents[i-1][j-1].ver, board.contents[i-1][j-1].hor)					
					boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
					boardHtmlElement.classList.add("populated");
				}
				if(ver<4){
					board.contents[hor-1][ver-1] = new CheckerPiece('white',hor,ver);
					//console.log('New piece was created with coords: '+board.contents[i-1][j-1].ver, board.contents[i-1][j-1].hor)					
					boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
					boardHtmlElement.classList.add("populated");
				}				
			}
			//console.log(boardHtmlElement.classList);
		}		
	}
}


let moveProcedureCheckers = async (game, player) => {
	//console.log("Starting moveProcedureCheckers");		
	var selectedPiece;
	var newDest = {hor: 0, ver: 0};
	getPlayerActivePiecesCheckers(player)	
	if(player.activePieces.length>0){
		await getPlayerResponseCheckers(player);
		//console.log("Player reponse resolved.");		
	} else{
		if(player.pieces().length===0){
			game.isEnded = true;
		}
	}
	while(moveIsCompelled) {
		console.log("This move was a strike, checking the possibility of the chain move!")
		let movedPieceElem = getSelectedElem("movedPiece");
		let movedPiece = getPieceFromHtmlId(movedPieceElem.id, player.board);
		//console.log("movedPiece element id is " + movedPieceElem.id);
		//console.log("moved piece coordinates are " + movedPiece.coords().hor, movedPiece.coords().ver);
		//debugger;
		if (pieceCanStrikeCheckers(movedPiece, player.board)) {
			console.log("This piece can strike again!")
			await getPlayerChainResponseCheckers(player);
		} else {
			moveIsCompelled = false;
		}
	}
	$(".movedPiece").removeClass("movedPiece");
		

	
	
	moveIsCompelled = false;
	
	
}

let getPlayerActivePiecesCheckers = (player) => {
	player.activePieces = [];	
	
	for (const thePiece of player.pieces()) {
		if(pieceHasMovesCheckers(thePiece, player.board) ){
			let pieceElem = thePiece.contElem()
			pieceElem.classList.add("activePiece");
			player.activePieces.push(thePiece);
		}					
	}

	if (moveIsCompelled) {
		//debugger;
		console.log(player.name + ' has ' + player.activePieces.length + ' active pieces before the filtering.')
		player.activePieces = filterJumps(player.activePieces, player.board);
	}
	console.log(player.name + ' has ' + player.pieces().length + ' pieces total.')
	console.log(player.name + ' has ' + player.activePieces.length + ' active pieces.')
	if(moveIsCompelled) {console.log("This move is compelled")}
	
}

let getPlayerResponseCheckers = (player) => {
	//console.log("Starting getPlayerResponseCheckers")	
	return new Promise(function(resolve, reject) {
		var timer = 0;	
		selectedPiece = null;
		var prevSelElem = document.createElement('div');
		prevSelElem.setAttribute("id", "noId");
		var hold = setInterval(() => { 	
			
			newDest = {hor: 0, ver: 0};
			let selElem;
			let destElem;
			
			if (pieceIsSelected()) {
				selElem = getSelectedElem('selectedPiece');				
				if(selElem.id !== prevSelElem.id) {
										
					removePrevPosDes();
					selectedPiece = getPieceFromHtmlId(selElem.id, player.board);
					let selPieceMoves = selectedPiece.eligibleMoves(false);
					//debugger;
					//console.log("Number of possible moves for this piece is: "+selectedPiece.eligibleMoves(false).length)
					if (selectedPiece.isKing) {
						//console.log("This piece is a King!");
						if(moveIsCompelled) {
							for( kingJump of getKingMovesCheckers(player.board, selectedPiece).jumps) {
								let posDesElem = document.getElementById((kingJump.hor)+','+(kingJump.ver));
								posDesElem.classList.add("possibleDestination");							
							}							
						} else {
							for( kingMove of getKingMovesCheckers(player.board, selectedPiece).moves) {
								let posDesElem = document.getElementById((kingMove.hor)+','+(kingMove.ver));
								posDesElem.classList.add("possibleDestination");							
							}
						}
					} else {
						for (move of selectedPiece.eligibleMoves(false)){						
							if(moveIsCompelled) {
								//console.log("this move is compelled");
								drawStrikeMoves(player.board, selectedPiece)	
							} else if(pieceCanMoveCheckers(player.board, move, selectedPiece)){
								let posDesElem = document.getElementById((move.hor)+','+(move.ver));
								posDesElem.classList.add("possibleDestination");
							}
						}						
					}

					prevSelElem = selElem;					
				}
				
				if(destinationSelected()) {
					//console.log("	selected piece coords: ", selectedPiece.hor, selectedPiece.ver);
					
					destElem = getSelectedElem('selectedDestination');
					newDest.hor = parseInt(destElem.id.substr(0, destElem.id.indexOf(',')));
					newDest.ver = parseInt(destElem.id.substr(destElem.id.indexOf(',')+1, destElem.id.length-1));
					//console.log("	New destination is set to : ", newDest.hor+","+ newDest.ver);
					timer = Infinity;
				}

			}
			
			timer++;			
			
			if(timer>200){
				clearInterval(hold);
				removePrevPosDes();
				if(selectedPiece && newDest.hor) {
					console.log(`Moving the piece from (${selectedPiece.hor},${selectedPiece.ver}) to (${newDest.hor},${newDest.ver})`);
					moveThePiece(selectedPiece, newDest, player.board);
				} else {
					console.log("The player didn't select a move, moving over to the next one.");
					moveIsCompelled = false;
				}
				$(".activePiece").removeClass("activePiece");
				$(".selectedPiece").removeClass("selectedPiece");
				$(".possibleDestination").removeClass("possibleDestination");
				$(".selectedDestination").removeClass("selectedDestination");
				resolve();
			}			
		}, 100);
	});		
}

let pieceHasMovesCheckers = (piece, board) => {
	//console.log(`	Checking the moves for the piece on the tile (${piece.hor}, ${piece.ver})`);	
	let result = false;
	let pieceMoves = piece.eligibleMoves(false)
	if (piece.isKing) {
		let kingMoves = getKingMovesCheckers(board, piece);
		let kingMovesNum = kingMoves.moves.length + kingMoves.jumps.length;
		if (kingMovesNum){result = true;}
	} else {
		for (const move of piece.eligibleMoves(false)) {
			//console.log("	"+move[0],move[1]);
			if(pieceCanMoveCheckers(board, move, piece)) {
				result = true;
			}
		}
	}
	
	return result;
}

let pieceCanMoveCheckers = (board, move, piece) => {
	if(isVacant(board, move)) {
		return true;
	}else if (isFoe(board, move, piece.color)) {
		if(canJump(board, move, piece)){
			//console.log("Foe is near!");
			moveIsCompelled = true;
			return true;
		}
	}
}

let filterJumps = (activePieces, board) => {
	$(".activePiece").removeClass("activePiece");
	let filtered = [];	
	//debugger;
	for (const piece of activePieces){
		if(piece.isKing) {
			let jumps = getKingMovesCheckers(board, piece).jumps
			if (jumps.length>0) {
				let pieceElem = piece.contElem()
				pieceElem.classList.add("activePiece");
				filtered.push(piece);
			}
		} else {
			if(pieceCanStrikeCheckers(piece, board)) {
				let pieceElem = piece.contElem()
				pieceElem.classList.add("activePiece");
				filtered.push(piece);
			}
		}		
	}
	return filtered;
}

let pieceCanStrikeCheckers = (piece, board) => {
	if(piece.isKing) {
		if (getKingMovesCheckers(board, piece).jumps.length>0) {
			console.log("The king can strike!")
			return true;
		} else {
			console.log("The king cannot strike!")
			return false;
		}
	} else {
		for (const move of piece.eligibleMoves(true)) {
			if (isFoe(board, move, piece.color)) {				
				if(canJump(board, move, piece)){
						return true;
				}
			}
		}
	}
	return false;
}




let getPlayerChainResponseCheckers = (player) => {
	//console.log("Starting getPlayerResponseCheckers")	
	return new Promise(function(resolve, reject) {
		var timer = 0;	
		let selElem = getSelectedElem('movedPiece');
		let selectedPiece = getPieceFromHtmlId(selElem.id, player.board);
		let newDest = {hor: 0, ver: 0};

		let destElem;

		var hold = setInterval(() => { 	
																			
			
			drawStrikeMoves(player.board, selectedPiece)
			

																	
			if(destinationSelected()) {
				destElem = getSelectedElem('selectedDestination');
				newDest.hor = parseInt(destElem.id.substr(0, destElem.id.indexOf(',')));
				newDest.ver = parseInt(destElem.id.substr(destElem.id.indexOf(',')+1, destElem.id.length-1));
				//console.log("	New destination is set to : ", newDest.hor+","+ newDest.ver);
				timer = Infinity;
			}
						
			timer++;			
			
			if(timer>200){
				clearInterval(hold);
				removePrevPosDes();
				if(selectedPiece && newDest.hor) {
					console.log(`Moving the piece from (${selectedPiece.hor},${selectedPiece.ver}) to (${newDest.hor},${newDest.ver})`);
					moveThePiece(selectedPiece, newDest, player.board);
					$(".activePiece").removeClass("activePiece");
					$(".selectedPiece").removeClass("selectedPiece");
					$(".possibleDestination").removeClass("possibleDestination");
					$(".selectedDestination").removeClass("selectedDestination");
				} else {
					console.log("The player didn't select a move, moving over to the next one.");
					moveIsCompelled = false;
				}
				resolve();
			}			
		}, 100);
	});		
}



let drawStrikeMoves = (board, piece) => {
	if(piece.isKing) {
		for (jumpMove of getKingMovesCheckers(board, piece).jumps) {
			let posDesElem = document.getElementById((jumpMove.hor)+','+(jumpMove.ver));
			posDesElem.classList.add("possibleDestination");
		}
	} else {
		for (move of piece.eligibleMoves(true)){
			if (isFoe(board, move, piece.color)) {				
				if(canJump(board, move, piece)){
					let posDesElem = document.getElementById((move.hor)+','+(move.ver));
					posDesElem.classList.add("possibleDestination");
				}
			}				
		}
	}	
}




let getKingMovesCheckers = (board, piece) => {
	let kingMoves = [];
	let kingJumps = [];
	let i = 1;
	let jumped = false;
	let currentMove;
	//debugger;
	while((piece.hor+i)<9 && (piece.ver+i)<9) {
		//console.log("Going N-E");
		currentMove = {hor: piece.hor+i, ver: piece.ver+i};
		if(isVacant(board, currentMove)) {
			if(jumped) {
				kingJumps.push(currentMove);
			} else {
				kingMoves.push(currentMove);				
			}

		} else if(!jumped){
			if(isFoe(board, currentMove, piece.color)) {
				if(canJump(board, currentMove, piece)){
					kingJumps.push(currentMove);
					//console.log("Found a jump!")
					i++;
					moveIsCompelled = true;
					jumped = true;
				} else {break}
			}			
		} else {break}
		i++;
	}
	
	i = 1;
	jumped = false;
	
	while((piece.hor+i)<9 && (piece.ver-i)>0) {
		//console.log("Going S-E");
		currentMove = {hor: piece.hor+i, ver: piece.ver-i};
		if(isVacant(board, currentMove)) {
			if(jumped) {
				kingJumps.push(currentMove);
			} else {
				kingMoves.push(currentMove);				
			}

		} else if(!jumped){
			if(isFoe(board, currentMove, piece.color)) {
				if(canJump(board, currentMove, piece)){
					kingJumps.push(currentMove);
					//console.log("Found a jump!")
					i++;
					moveIsCompelled = true;
					jumped = true;
				} else {break}
			}			
		} else {break}
		i++;
	}
	
	i = 1;
	jumped = false;
	
	while((piece.hor-i)>0 && (piece.ver-i)>0) {
		//console.log("Going S-W");
		currentMove = {hor: piece.hor-i, ver: piece.ver-i};
		if(isVacant(board, currentMove)) {
			if(jumped) {
				kingJumps.push(currentMove);
			} else {
				kingMoves.push(currentMove);				
			}

		} else if(!jumped){
			if(isFoe(board, currentMove, piece.color)) {
				if(canJump(board, currentMove, piece)){
					kingJumps.push(currentMove);
					//console.log("Found a jump!")
					i++;
					moveIsCompelled = true;
					jumped = true;
				} else {break}
			}			
		} else {break}
		i++;
	}	
	
	i = 1;
	jumped = false;

	while((piece.hor-i)>0 && (piece.ver+i)<9) {
		//console.log("Going N-W");
		currentMove = {hor: piece.hor-i, ver: piece.ver+i};
		if(isVacant(board, currentMove)) {
			if(jumped) {
				kingJumps.push(currentMove);
			} else {
				kingMoves.push(currentMove);				
			}

		} else if(!jumped){
			if(isFoe(board, currentMove, piece.color)) {
				if(canJump(board, currentMove, piece)){
					kingJumps.push(currentMove);
					//console.log("Found a jump!")
					i++;
					moveIsCompelled = true;
					jumped = true;
				} else {break}
			}			
		} else {break}
		i++;
	}		
	
	return {moves: kingMoves, jumps: kingJumps}

}







