var gameIsRunning = false;
var gameReset = true;

const onGameStart = async () => {
	await resetGame();
	console.log("Starting the game");
	const player1 = document.getElementById('player1Name').value;
	const player2 = document.getElementById('player2Name').value;
	const gameType = document.getElementById('gameType').value

	if ((player1.length === 0)||(player2.length === 0)||(player1 === player2)){
		alert("Please enter two valid different names");
		return
	}
	
	let theGame;
	switch(gameType) {
		case 'checkers':
			theGame = new GameCheckers(player1, player2);
			gameIsRunning = true;
			break;
		case 'knightChase':
			alert("This game is still under construction. Please select another one");
			// theGame = new GameKnightChase(player1, player2);
			//gameIsRunning = true;
			// break;
			return
		case 'chess':
			alert("This game is still under construction. Please select another one");
			// theGame = new GameChess(player1, player2);
			//gameIsRunning = true;
			// break;			
			return
	}
	
	//alert(`Starting new game of ${gameType}\n${theGame.player1.name} - ${theGame.player1.color}\n${theGame.player2.name} - ${theGame.player2.color}`)

	theGame.populateBoard();
	letThemPlay(theGame, theGame.player1);
}

const resetGame = async (value) => {
  return new Promise(function(resolve, reject) {
	  if (gameIsRunning) {		  
		gameReset = false;
		gameIsRunning = false;
		let timer = setInterval(function(){ 
			if(gameReset) {
				console.log("waiting for reset");
				clearInterval(timer);
				resolve();
			}
		}, 100);
	  } else (resolve())
  });
};
