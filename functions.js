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
	
	alert(`Starting new game of ${gameType}\n${theGame.player1.name} - ${theGame.player1.color}\n${theGame.player2.name} - ${theGame.player2.color}`)
	theGame.populateBoard();
	let currentPlayer = theGame.player1
	// while (!theGame.isEnded) {
		
	// }
}


let emptyTheBoard = () => {
	let boardElement;
	let coordString = "";
	let pieceToPut = "";
	for(let i=8;i>0;i--){
		for(let j=1;j<9;j++){
			coordString = j+','+i;
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
	let thisTile;
	emptyTheBoard();
	for(let i=8;i>0;i--){
		for(let j=1;j<9;j++){
			coordString = j+','+i;
			//console.log(board.contents[i-1][j-1]);
			thisTile = board.contents[i-1][j-1];
			boardHtmlElement = document.getElementById(coordString);
			
			if(boardHtmlElement.classList.contains("black")){
				//console.log(`This tile is black: ${j}, ${i}`);
				if(i>5){
					thisTile = new CheckerPiece('black',i,j);					
					boardHtmlElement.innerHTML = thisTile.character();
					boardHtmlElement.classList.add("populated");
				}
				if(i<4){
					thisTile = new CheckerPiece('white',i,j);
					boardHtmlElement.innerHTML = thisTile.character();
					boardHtmlElement.classList.add("populated");
				}				
			}
			//console.log(boardHtmlElement.classList);
		}		
	}
}

//populateBoardCheckers();

let populateBoardTwoKnights = () => {
	//randomly getting the coordinates	
	let boardHtmlElement;
	emptyTheBoard();
	boardHtmlElement = document.getElementById(randomBoardLocation());
	boardHtmlElement.innerHTML = whiteKnight;
	boardHtmlElement.classList.add("populated");
	boardHtmlElement = document.getElementById(randomBoardLocation());
	boardHtmlElement.innerHTML = blackKnight;
	boardHtmlElement.classList.add("populated");
}

let randomBoardLocation = () => {
	let coordString = "";
	coordString = coordString + (Math.floor(Math.random() * Math.floor(8))+1);
	coordString = coordString + ','
	coordString = coordString + (Math.floor(Math.random() * Math.floor(8))+1);
	return coordString
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