//***********MAIN.js**********//
var timeOut=21;
function timer(){
	--timeOut;
	
	$("#timeRemains").html(timeOut);
	if(timeOut<1){		
		snakeCrashHandler();
	}
};
var gameBoard;
var snake;
var moveDirection = 'right';
var gameExecutor;
var gameSpeed=100;
var roundNum = 1;

var bonusExecuter;
var bonusTime=15e3;
var bonusLasting=5e3;
var bonusInterval=15e3;

var countDownExecuter;
var cutDownExecuter;
var cutDownProviderInterval= 15e3;
var cutDownElementDisp = 5e3;
var cutDown;

var eatenItemsCount =0;
var MAX_FOOD_ITEMS = 12;

//actual field size(400px) divided by corresponding bodypart size(8px)
var gameFieldRelativeWidth = 50;
var gameFieldRelativeHeight = 50;

//actual field size(400px) divided by bonuspart size(10px)
var bonusFieldRelativeWidth = 40;
var bonusFieldRelativeHeight = 40;

//width and height of snake body element
var snakeElementWidth = 8;
var snakeElementHeight = 8;

//width and height of bonus element
var bonusElementWidth = 10;
var bonusElementHeight =10;

//game keys
var ESC = 27;
var SPACE = 32;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var food;
var bonus;

$(document).ready(function() {
    $('body').keydown(keyPressedHandler);
    console.log("inside document ready");
    
    
});

function bonusProvider(){
	console.log("inside bonus provider");
	if(gameExecutor && bonusExecuter){
		console.log("inside bonus provider if condition");
		generateBonus();
		setTimeout(function(){ console.log("inside timeout fn");gameBoard.removeSnakeBonus();bonus=null;}, bonusLasting);
	}
};

function generateBonus() {
	if(gameBoard.hasNoCreatedBonus()){
		do{
			xpos = Math.floor(Math.random() * gameFieldRelativeWidth) * snakeElementWidth;
			ypos = Math.floor(Math.random() * gameFieldRelativeHeight)* snakeElementHeight;
		}
		while(snake.holdsPosition(xpos,ypos));
		bonus = {xPos:xpos,yPos:ypos};
		gameBoard.drawElement('bonus',xpos,ypos);
	}
};

function cutDownProvider(){
	console.log("inside cut down snake length provider method");
	var snakeBody = snake.getBody();
	if(gameExecutor && cutDownExecuter && snakeBody.length > 5){
		generateCutDown();
		setTimeout(function(){ console.log("inside timeout fn");gameBoard.removeSnakeCutDown();cutDown=null;}, cutDownElementDisp);
	}
};

function generateCutDown(){
	var snakeBody = snake.getBody();
	if(gameBoard.hasNoCreatedCutDown()){
		console.log("inside if condition to draw cutdown element");
		do{
			xpos = Math.floor(Math.random() * gameFieldRelativeWidth) * snakeElementWidth;
			ypos = Math.floor(Math.random() * gameFieldRelativeHeight)* snakeElementHeight;
		}
		while(snake.holdsPosition(xpos,ypos));
		cutDown = {xPos:xpos,yPos:ypos};
		gameBoard.drawElement('cutDown',xpos,ypos);
	}
};

function move() {
	generateFood();
	snake.move(moveDirection);
	
	if(snake.holdsPosition(food.xPos,food.yPos))
		eatFood();
	if(bonus && snake.holdsPosition(bonus.xPos,bonus.yPos))
		addBonus();
	if(cutDown && snake.holdsPosition(cutDown.xPos,cutDown.yPos))
		processCutDown();
		
	drawSnake();
};

function keyPressedHandler(e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	
	switch(code) {
		case LEFT_ARROW:
			moveDirection = 'left';
			break;
		case UP_ARROW:
			moveDirection = 'up';
			break;
		case RIGHT_ARROW:
			moveDirection = 'right';
			break;
		case DOWN_ARROW:
			moveDirection = 'down';
			break;
		case SPACE:
			startGame();
			break;
		case ESC:
			endGame();
			break;
	}
 }

function startGame() {
	gameBoard = new GameBoard();
	moveDirection = 'right';
	eatenItemsCount = 0;
	roundNum = 1;
	gameSpeed=100;
	clearExecutors();
	
	timeOut=21;
	var bonusLasting=5e3;
	var bonusInterval=15e3;
	gameBoard.clearGameInfo();
	
	snake = new Snake(80,80);
	snake.onCrash(snakeCrashHandler,{xPos:400,yPos:400});
	drawSnake();
	gameExecutor = setInterval(move,gameSpeed);
	bonusExecuter = setInterval(bonusProvider, bonusInterval);
	
	setTimeout(function(){ 		
		cutDownExecuter= setInterval(cutDownProvider,  cutDownProviderInterval);
		}, 5e3);
	countDownExecuter = setInterval(timer, 1e3);
	timer();
};

function clearExecutors(){
	if(gameExecutor)
		clearInterval(gameExecutor);
	if(bonusExecuter)
		clearInterval(bonusExecuter);
	if(cutDownExecuter)
		clearInterval(cutDownExecuter);
	if(countDownExecuter)
		clearInterval(countDownExecuter);
};

function endGame() {
	clearExecutors();
	gameBoard.showFinalScore();
	//gameBoard.updateHighestScore();
	gameBoard.clearBoard();
};

function drawSnake() {
	gameBoard.removeSnakeBody();
	
	//draw the new snake
	var snakeBody = snake.getBody();
	
	for(var i=0; i<snakeBody.length; i++){
		gameBoard.drawElement('bodypart',snakeBody[i].xPos,snakeBody[i].yPos);
	}
};

function generateFood() {
	if(gameBoard.hasNoCreatedFood()){
		do{
			xpos = Math.floor(Math.random() * gameFieldRelativeWidth) * snakeElementWidth;
			ypos = Math.floor(Math.random() * gameFieldRelativeHeight)* snakeElementHeight;
		}
		while(snake.holdsPosition(xpos,ypos));
		food = {xPos:xpos,yPos:ypos};
		gameBoard.drawElement('food',xpos,ypos);
	}
};

function eatFood() {
	timeOut=20;
	snake.eatFood();
	gameBoard.removeSnakeFood();
	
	eatenItemsCount++;
	if(eatenItemsCount >= MAX_FOOD_ITEMS)
		startNextRound();
	
	gameBoard.updateScore(roundNum);
};

function addBonus(){
	console.log("inside add bonus method");
	bonus=null;
	gameBoard.removeSnakeBonus();
	eatenItemsCount++;
	if(eatenItemsCount >= MAX_FOOD_ITEMS)
		startNextRound();	
	gameBoard.updateBonus(roundNum);
};

function processCutDown(){	
	snake.cutDown();
	cutDown = null;
	gameBoard.removeSnakeCutDown();
}

function snakeCrashHandler() {
	endGame();
	gameBoard.showLoseMessage();
};

function startNextRound() {
	roundNum++;
	eatenItemsCount = 0;
	gameBoard.showNextRoundMsg();
	gameSpeed = Math.floor(gameSpeed * 0.8);
	clearInterval(gameExecutor);
	gameExecutor = setInterval(move,gameSpeed);
	bonusInterval = Math.floor(bonusInterval * 0.8);
	bonusLasting = bonusInterval/3;
	if(bonusExecutor)
	clearInterval(bonusExecutor);
	bonusExecutor = setInterval(bonusProvider, bonusInterval);
};
//***************************//
//*********SNAKE.js*********//
function BodyPart(xpos,ypos,direction) {
	this.xPos=xpos;
	this.yPos=ypos;
	this.direction=direction;;
};

function Snake(startX,startY) {
	var moveStep = 8;
	var bodyParts = [new BodyPart(startX,startY,'right')];
	var reverseDirections = {'right':'left','left':'right','up':'down','down':'up'};
	var gameRegion;
	var onCrashCallback;
	var self = this;
	
	this.eatFood = function() {
		bodyParts.push(getNewTail());
	};
	
	this.cutDown = function() {
		bodyParts.pop();
		bodyParts.pop();
		bodyParts.pop();
	};
	
	this.move = function(newDirection) {
		if(isReverseDirection(newDirection))
			reverseBodyMove();
			
		var newHead = getNewHead(newDirection);
		
		if(crash(newHead))
			onCrashCallback();
		else{		
			for(var i = bodyParts.length-1; i>0 ;i--){
				bodyParts[i] = bodyParts[i-1];
			}
			bodyParts[0] = newHead;
		}
	};
	
	this.getBody = function() {
		return bodyParts;
	};
	
	this.holdsPosition = function(xpos,ypos) {
		for(var i = 0; i< bodyParts.length; i++){
			if(bodyParts[i].xPos == xpos && bodyParts[i].yPos == ypos)
				return true;
		}
		return false;
	};
	
	this.holdsPositionForBonus = function (xpos,ypos) {
		for(var i = 0; i< bodyParts.length; i++){
			/*if((Math.abs(bodyParts[i].xPos - xpos) <=2)  && (Math.abs(bodyParts[i].yPos - ypos) <=2) )
				return true;*/
			if(bodyParts[i].xPos == xpos && bodyParts[i].yPos == ypos)
				return true;
		}
		return false;
	};
	
	this.onCrash = function(crashCallback,fieldSize) {
		gameRegion = fieldSize;
		onCrashCallback = crashCallback;
	};
	
	var getNewHead = function(direction){
		var currentHead = bodyParts[0];
		
		switch(direction){
			case 'right':
				return new BodyPart(currentHead.xPos+moveStep,currentHead.yPos,direction);
			case 'left':
				return new BodyPart(currentHead.xPos-moveStep,currentHead.yPos,direction);
			case 'up':
				return new BodyPart(currentHead.xPos,currentHead.yPos-moveStep,direction);
			case 'down':
				return new BodyPart(currentHead.xPos,currentHead.yPos+moveStep,direction);
		};
	};
	
	var getNewTail = function(){
		var currentTail = bodyParts[bodyParts.length-1];
		var tailDirection = currentTail.direction;
		
		switch(tailDirection){
			case 'right':
				return new BodyPart(currentTail.xPos-moveStep,currentTail.yPos,tailDirection);
			case 'left':
				return new BodyPart(currentTail.xPos+moveStep,currentTail.yPos,tailDirection);
			case 'up':
				return new BodyPart(currentTail.xPos,currentTail.yPos+moveStep,tailDirection);
			case 'down':
				return new BodyPart(currentTail.xPos,currentTail.yPos-moveStep,tailDirection);
		};
	};
	
	var crash = function(head){
		if(head.xPos >= gameRegion.xPos
			|| head.yPos >= gameRegion.yPos
			|| head.xPos < 0
			|| head.yPos < 0
			|| self.holdsPosition(head.xPos,head.yPos))
			return true;
		
		return false;
	};
	
	var isReverseDirection = function(newDirection) {
		var currentHeadDirection = bodyParts[0].direction;
		return newDirection == reverseDirections[currentHeadDirection];
	};
	
	var reverseBodyMove = function() {
		var tmpBodyPart;
		var halfBodyLength = Math.floor(bodyParts.length/2);
		var bodyLength = bodyParts.length -1;
		
		for(var i = 0; i< halfBodyLength; i++){
			tmpBodyPart = bodyParts[i];
			bodyParts[i] = bodyParts[bodyLength - i];
			bodyParts[bodyLength - i] = tmpBodyPart;
			bodyParts[i].direction = reverseDirections[bodyParts[i].direction];
			bodyParts[bodyLength - i].direction = reverseDirections[bodyParts[bodyLength - i]];
		}
	};
};
//**************************//
//*******GAMEBOARD.js******//
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
//************************//