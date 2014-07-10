function GameBoard() {
	
	this.lastScore=0;	
	this.highestScore=0;

	this.drawElement = function (classname, xpos,ypos) {
		var $element = $('<div/>').addClass(classname);
		$element.css('top',ypos+'px').css('left',xpos+'px');
		$('#gameField').append($element);
	};
	
	this.clearBoard = function(){
		$('div.bodypart').remove();
		$('.food').remove();
		$('.bonus').remove();
		$('.cutDown').remove();
	};
	
	this.clearGameInfo = function() {
		$('#score').html('0');
		$('#bonus').html('0');
		$('#timeRemains').css('visibility','visible');
		$('#loseMsg').css('visibility','hidden');
		$('#speed').html('1');
	};
	
	this.hasNoCreatedFood = function() {
		return $('.food').length == 0 ;
	};
	
	this.hasNoCreatedBonus = function() {
		return $('.bonus').length == 0;
	};
	
	this.hasNoCreatedCutDown = function() {
		return $('.cutDown').length == 0;
	};
	
	this.removeSnakeBody = function() {
		$('div.bodypart').remove();
	};
	
	this.removeSnakeFood = function() {
		$('.food').remove();
	};
	
	this.removeSnakeBonus =function() {
		$('.bonus').remove();
	};
	
	this.removeSnakeCutDown = function() {
		$('.cutDown').remove();
	};
	
	this.updateScore = function(currentRound) {
		var $currentScore = Number($('#score').html());
		$currentScore+=currentRound;
		$('#score').html($currentScore);
	};
	
	this.updateBonus = function(currentRound){
		var $currentBonus = Number($('#bonus').html());
		$currentBonus+=(currentRound*2);
		$('#bonus').html($currentBonus);
	};
	
	this.showFinalScore = function (){
		var $currentScore = Number($('#score').html());
		$currentScore+= Number($('#bonus').html());
		$('#score').html($currentScore);
		this.lastScore= $currentScore;
		this.updateHighestScore();
	};
	
	this.updateHighestScore = function (){
		if(this.lastScore > this.highestScore){
			this.highestScore = this.lastScore;
			$('#highestScore').html(this.lastScore);
		}				
	};
	
	this.showLoseMessage = function(){
		$('#loseMsg').css('visibility','visible');
	};
	
	this.showNextRoundMsg = function() {
		$('#nextRndMsg').hide().css({visibility: 'visible'}).fadeIn(2000);
		$('#nextRndMsg').fadeOut(2000, function() {
				$(this).show().css({visibility: 'hidden'});
			});
			
		var $currentSpeed = Number($('#speed').html());
		$currentSpeed++;
		$('#speed').html($currentSpeed);
	};
}