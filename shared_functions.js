let emptyTheBoard = (board) => {
	let boardElement;
	let coordString = "";
	let pieceToPut = "";
	for(let ver=8;ver>0;ver--){
		for(let hor=1;hor<9;hor++){			
			coordString = hor+','+ver;
			board.contents[hor-1][ver-1] = coordString;
			//console.log(coordString);
			boardElement = document.getElementById(coordString);
			boardElement.innerHTML = "";

		}		
	}
}


let randomBoardLocation = () => {
	let randCoords = [];
	randCoords.push(Math.floor(Math.random() * Math.floor(8))+1)
	randCoords.push(Math.floor(Math.random() * Math.floor(8))+1)
	
	return randCoords
}




let getPieceHtmlElem = (piece) => {
	let coordString = (piece.hor)+ ',' + (piece.ver);
	//console.log('	The coords are ' + coordString)
	return document.getElementById(coordString)
}

let getPieceFromHtmlId = (id, board) => {
	//console.log("Getting the piece from the id " + id)
	let hor = parseInt(id[0])-1;
	let ver = parseInt(id[2])-1;
	return board.contents[hor][ver];
}


let withinBoard = (hor, ver) => {
	if(hor>0 && hor<9) {
		if(ver>0 && ver<9){
			return true;
		}
	}
	return false;
}

let isVacant = (board, move) => {
	if (typeof board.contents[move.hor-1][move.ver-1] === 'string'){
		return true;
	}
	return false
}

let isFoe = (board, move, color) => {
	let tile = board.contents[move.hor-1][move.ver-1];
	if(typeof  tile === 'object'){
		if(tile.color !== color) {
			return true;
		}
	}	
	return false;
}

let canJump = (board, move, piece) => {								//This function chechks is the piece can jump and if it can,
	let jumpMove = {												// it modifies the destination ('move') appropriately
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




let onSelectPiece = (id) => {
	//alert(id);
	$(".selectedPiece").removeClass("selectedPiece");
	document.getElementById(id).classList.add("selectedPiece");
}

let onSelectDestination = (id) => {
	//alert(id);
	document.getElementById(id).classList.add("selectedDestination");
}

let pieceIsSelected = () => {
	return $(".chessboard div").hasClass('selectedPiece')
}

let destinationSelected = () => {
	return $(".chessboard div").hasClass('selectedDestination')
}

let getSelectedElem = (className) => {
	let selectedElem = document.getElementsByClassName(className)[0];
	return selectedElem;
}

let removePrevPosDes = () => {
	$(".possibleDestination").removeClass("possibleDestination");
}

let moveThePiece = (piece, dest, board) => {

	if (piece.isKing) {
		//debugger;
	}
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

	}
	piece.hor = dest.hor;
	piece.ver = dest.ver;
	if (!piece.isKing) {
		if ((piece.ver === 8 && piece.color === "white") ||
			(piece.ver === 1 && piece.color === "black")) {
			piece.isKing = true;
			console.log("this piece is now a King!")
		}		
	}
	htmlElem = getPieceHtmlElem(piece);
	htmlElem.innerHTML = piece.character();

	htmlElem.classList.add("populated","movedPiece");
	board.contents[dest.hor-1][dest.ver-1] = piece;
	
}

let removeThePiece = (coords, board) => {
	let pieceToRemove = board.contents[coords.hor-1][coords.ver-1];
	let htmlElem = getPieceHtmlElem(pieceToRemove);
	htmlElem.innerHTML = "";
	htmlElem.classList.remove("populated","movedPiece");
	board.contents[coords.hor-1][coords.ver-1] = coords.hor + "," + coords.ver;
}

