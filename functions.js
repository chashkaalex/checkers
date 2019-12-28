const whiteMan = '\u26c0';
const whiteKing = '\u26c1';
const blackMan = '\u26c2';
const blackKing = '\u26c3';
const blackKnight = '\u265e'
const whiteKnight = '\u2658' 

let onGameStart = () => {
	console.log("Starting onGameStart");
	let player1 = document.getElementById('player1Name').value;
	let player2 = document.getElementById('player2Name').value;
	let gameType = document.getElementById('gameType').value
	//let .options[e.selectedIndex].value;
	//console.log(player1, player2, gameType);
	if ((player1.length === 0)||(player2.length === 0)||(player1 === player2)){
		alert("Please enter two valid different names");
		return
	}
	//console.log("the function didn't fail, going on")
	var theGame;
	switch(gameType) {
		case 'knightChase':
			theGame = new GameKnightChase(player1, player2)
			break;
		case 'checkers':
			theGame = new GameCheckers(player1, player2)
			break;
		case 'chess':
			alert("This game is still under construction. Please select another one");
			return
			theGame = new GameChess(player1, player2)
			break;
	}
	
	//alert(`Starting new game of ${gameType}\n${theGame.player1.name} - ${theGame.player1.color}\n${theGame.player2.name} - ${theGame.player2.color}`)
	theGame.populateBoard();
	let currentPlayer = theGame.player1
	theGame.moveProcedure(currentPlayer)
	// while (!theGame.isEnded) {
		
	// }
}


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



let populateBoardCheckers = (board) => {
	console.log("Starting populateBoardCheckers");		
	let boardHtmlElement;
	let coordString = "";	
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

//populateBoardCheckers();

let populateBoardKnightChase = (board) => {		
	emptyTheBoard(board);	
	//creating white Knight
	let randCoords = randomBoardLocation();        //randomly getting the coordinates
	let ver = randCoords[0];
	let hor = randCoords[1];
	//console.log('rand coords are ', i, typeof i,' and ' + j, typeof j)
	let coordString = hor+','+ver;
	let boardHtmlElement = document.getElementById(coordString);
	board.contents[hor-1][ver-1] = new KnightPiece('white',hor,ver);
	boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
	boardHtmlElement.classList.add("populated");
	//creating black Knight
	randCoords = randomBoardLocation();
	ver = randCoords[0];
	hor = randCoords[1];
	coordString = hor+','+ver;
	boardHtmlElement = document.getElementById(coordString);
	board.contents[hor-1][ver-1] = new KnightPiece('black',hor,ver);
	boardHtmlElement.innerHTML = board.contents[hor-1][ver-1].character();
	boardHtmlElement.classList.add("populated");
}

let randomBoardLocation = () => {
	let randCoords = [];
	randCoords.push(Math.floor(Math.random() * Math.floor(8))+1)
	randCoords.push(Math.floor(Math.random() * Math.floor(8))+1)
	
	return randCoords
}



let moveProcedureChechkers = (player, board) => {
	getPlayerActivePieces(player, board)
	for (const [index, piece] of player.pieces.entries()) {
		console.log('For piece number ' + index)
		getPieceHtmlElem(piece).classList.add("activePiece");
	}
}


let moveProcedureKnightChase = (player, board) => {
	getPlayerActivePieces(player, board)
	for (const [index, piece] of player.pieces.entries()) {
		console.log('For piece number ' + index)
		getPieceHtmlElem(piece).classList.add("activePiece");
	}
}


let getPlayerActivePieces = (player, board) => {
	for(let i = 0; i < board.contents.length; i++) {		
		for (const tile of board.contents[i]) {
			//console.log("after population printing pieces on board "+typeof tile);
			if(typeof  tile === 'object'){				
				let thePiece = tile;			//this is made for  readability purposes only
				if(thePiece.color === player.color){
					console.log("this tile holds a "+thePiece.color+" piece: " + thePiece.hor, thePiece.ver)
					let pieceMoves = thePiece.eligibleMoves();
					console.log('That piece has eligible moves as such:')
					let pieceHasMoves = false;
					for (const move of pieceMoves) {
						console.log(move[0],move[1]);
						if(isVacant(board, move[0], move[1])){
							pieceHasMoves = true;
						}
					}
					if(pieceHasMoves){
						player.pieces.push(thePiece);
					}
					
				}
			}
		  }
	}
	console.log(player.name + ' has ' + player.pieces.length + ' active pieces.')
}

let getPieceHtmlElem = (piece) => {
	let coordString = (piece.hor)+ ',' + (piece.ver);
	console.log('	The coords are ' + coordString)
	return document.getElementById(coordString)
}


let withinBoard = (hor, ver) => {
	if(hor>0 && hor<9) {
		if(ver>0 && ver<9){
			return true;
		}
	}
	return false;
}

let isVacant = (board, hor, ver) => {
	if (typeof board.contents[hor-1][ver-1] === 'string'){
		return true;
	}
	return false
}
// let arr = [10, 3, 5, 6, 2];
// let left = [1];
// let right = [1];



// for (let i = 1; i<arr.length; i++) {
	// left.push(arr[i-1]*left[i-1]);
	// right.unshift(arr[arr.length - i]*right[0]);	
	// console.log(left, right);
// }

// for (let i = 0; i<arr.length; i++) {
	// right[i] = (right[i]*left[i]);
// }

// console.log(right);