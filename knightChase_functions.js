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


let moveProcedureKnightChase = (game, player) => {
	getPlayerActivePiecesKnightChase(player)
	for (const [index, piece] of player.activePieces.entries()) {
		console.log('For piece number ' + index)
		getPieceHtmlElem(piece).classList.add("activePiece");
	}
}

let getPlayerActivePiecesKnightChase = (player) => {
	for(let i = 0; i < player.board.contents.length; i++) {		
		for (const tile of player.board.contents[i]) {
			//console.log("after population printing pieces on board "+typeof tile);
			if(typeof  tile === 'object'){				
				let thePiece = tile;			//this is made for  readability purposes only
				if(thePiece.color === player.color){
					if(pieceHasMoves(thePiece, player.board) ){
						let pieceElem = thePiece.contElem()
						pieceElem.classList.add("activePiece");
						// pieceElem.addEventListener("click", function handler(){
							// onSelectPiece(this.id);
							// });
						player.activePieces.push(thePiece);
					}
					
				}
			}
		}
	}
	console.log(player.name + ' has ' + player.activePieces.length + ' active pieces.')
}