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

loadScript('js/snakeImpact/Snake.js');
loadScript('js/snakeImpact/GameBoard.js');

$(document).ready(function() {
    $('body').keydown(keyPressedHandler);
    console.log("inside document ready");    
});

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    /* script.onreadystatechange = callback;
    script.onload = callback;*/    
    head.appendChild(script);
}

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
