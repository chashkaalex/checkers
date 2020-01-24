
$(document).on('click', '.activePiece', 
	function handler(){
		onSelectPiece(this.id);
	});
		
$(document).on('click', '.possibleDestination', 
	function handler(){
		onSelectDestination(this.id);
	});
