var moveDuration = 20;
var maxMoves = 100;
var touchMove = true;
const gameTypeElem = document.getElementById('gameType');

const onOpenSettings = () => {
	const settingsElem = document.getElementById("settings");	
	const settingsButtonElem = document.getElementById("settingsButton");	
	if (getComputedStyle(settingsElem).display === "none") {
		settingsElem.style.display = "block";
		settingsButtonElem.innerText = "Hide Settings";
	} else {
		settingsElem.style.display = "none";
		settingsButtonElem.innerText = "Show Settings";
		document.getElementById('moveDur').value = moveDuration;
		document.getElementById('maxMoves').value = maxMoves;
		if(gameTypeElem.value === 'chess') {
			document.getElementById('touchMove').checked = touchMove;	
		}		
	}	
	const touchMoveSetElem = document.getElementById("touchMovePar");
	if(gameTypeElem.value === 'chess') {		
		touchMoveSetElem.style.display = "block";
	} else {
		touchMoveSetElem.style.display = "none";
	}
}

const onSaveSettings = () => {
	moveDuration = document.getElementById('moveDur').value;
	maxMoves = document.getElementById('maxMoves').value;
	touchMove = document.getElementById('touchMove').checked;
	onOpenSettings();
}

const onResetSettings = () => {	
	moveDuration = 20;
	maxMoves = 100;
	if(gameTypeElem.value === 'chess') {
		touchMove = true;
	}	
	onOpenSettings();
}

gameTypeElem.addEventListener('change', (event) => {
  onOpenSettings();
  onOpenSettings();
});
