var gameIsRunning = false;
var gameReset = true;

const onGameStart = async () => {
	await resetGame();	
	const player1 = document.getElementById('player1Name').value;
	const player2 = document.getElementById('player2Name').value;
	const gameType = document.getElementById('gameType').value;

	if ((player1.length === 0)||(player2.length === 0)||(player1 === player2)){
		alert("Please enter two valid different names");
		return
	}

	const theGame = new DynamicGameClass(gameType, player1, player2);
	if (!theGame.isEnded) {
		gameIsRunning = true;
		if(theGame.constructor.name === 'GameChess') {
			alert("This game is still under development, not all the features and rules are implemented.")
		}
		console.log("Starting the game");
		theGame.populateBoard();
		letThemPlay(theGame, theGame.player1);		
	}
	else {
		console.log("This game does not exsist");
		return;
	}
};

const resetGame = async (value) => {
  return new Promise(function(resolve, reject) {
	  if (gameIsRunning) {		  
		gameReset = false;
		console.log("resetting the game");
		gameIsRunning = false;
		let timer = setInterval(function(){ 
			if(gameReset) {
				console.log("waiting for reset");
				emptyTheBoard();
				clearMoveClasses();
				clearInterval(timer);
				resolve();
			}
		}, 100);
	  } else (resolve())
  });
};
