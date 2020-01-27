const letThemPlay = async (game, player) => {		
	let i = 1;
	while(i<=maxMoves) {
		if(game.isEnded) {
			console.log("The game has ended!");
			gameReset = true;
			moveIsCompelled = false;
			gameIsRunning = false;
			return;
		}
		console.log("MOVE №"+i);
		await game.moveProcedure(game, player);
		player = (player.color === 'white') ? game.player2 : game.player1;
		console.log("Next move: ", player.color);
		i++;
	}	
}

const emptyTheBoard = () => {
	$(".chessboard div")
		.removeClass(
			"activePiece",
			"selectedPiece",
			"possibleDestination",
			"selectedDestination",
			"movedPiece",
			"populated")
		.html("");
}

const getPieceHtmlElem = (piece) => {
	const coordString = (piece.hor)+ ',' + (piece.ver);
	//console.log('	The coords are ' + coordString)
	return document.getElementById(coordString);
}

const getPieceFromHtmlId = (id, board) => {
	//console.log("Getting the piece from the id " + id)
	const hor = parseInt(id[0])-1;
	const ver = parseInt(id[2])-1;
	return board.contents[hor][ver];
}

const withinBoard = (hor, ver) => {
	if(hor>0 && hor<9) {
		if(ver>0 && ver<9){
			return true;
		}
	}
	return false;
}

const isVacant = (board, move) => {
	if (typeof board.contents[move.hor-1][move.ver-1] === 'string'){
		return true;
	}
	return false
}

const isFoe = (board, move, color) => {
	const tile = board.contents[move.hor-1][move.ver-1];
	if(typeof  tile === 'object'){
		if(tile.color !== color) {
			return true;
		}
	}	
	return false;
}

const canJump = (board, move, piece) => {							//This function chechks is the piece can jump and if it can,
	const jumpMove = {												// it modifies the destination ('move') appropriately
		hor: (move.hor>piece.hor) ? move.hor+1 : move.hor-1,
		ver: (move.ver>piece.ver) ? move.ver+1 : move.ver-1
	};	
	if(withinBoard(jumpMove.hor, jumpMove.ver)){
		if (isVacant(board, jumpMove)){
			move.hor = jumpMove.hor;
			move.ver = jumpMove.ver;
			//console.log("move is now "+move.hor+","+move.ver)
			return true;
		}
	}	
	return false;
}

const onSelectPiece = (id) => {
	//alert(id);
	$(".selectedPiece").removeClass("selectedPiece");
	document.getElementById(id).classList.add("selectedPiece");
}

const onSelectDestination = (id) => {
	//alert(id);
	document.getElementById(id).classList.add("selectedDestination");
}

const pieceIsSelected = () => {
	return $(".chessboard div").hasClass('selectedPiece')
}

const destinationSelected = () => {
	return $(".chessboard div").hasClass('selectedDestination')
}

const getSelectedElem = (className) => {	
	return document.getElementsByClassName(className)[0];
}

const removePrevPosDes = () => {
	$(".possibleDestination").removeClass("possibleDestination");
}

const removeThePiece = (coords, board) => {
	const pieceToRemove = board.contents[coords.hor-1][coords.ver-1];
	const htmlElem = getPieceHtmlElem(pieceToRemove);
	htmlElem.innerHTML = "";
	htmlElem.classList.remove("populated","movedPiece");
	board.contents[coords.hor-1][coords.ver-1] = coords.hor + "," + coords.ver;
}
