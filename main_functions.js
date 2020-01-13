var moveIsCompelled = false;


let onGameStart = () => {
	console.log("Starting the game");
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
		
	
	
	
	
	
	async function letThemPlay (game, player){
		var currentPlayer = player;
		let i = 1;
		while(i<100) {
			console.log("MOVE №"+i);
			await game.moveProcedure(game, currentPlayer)
			if(currentPlayer.color === 'white') {
				currentPlayer = game.player2;
			} else{
				currentPlayer = game.player1;
			}
			console.log("Next move: ", currentPlayer.color);
			if(theGame.isEnded) {
				console.log("The game has ended!")
				break;
			}
			i++;
		}	
	}
	
	letThemPlay(theGame, currentPlayer)

	
	
	// while (!theGame.isEnded) {
		
	// }
}
























