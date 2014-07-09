var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
//document.body.appendChild(canvas);
document.getElementById("mainDiv").appendChild(canvas);

var count = 31;


var backgrndReady = false;
var backGrndImage = new Image();
backGrndImage.onload = function(){
	backgrndReady = true;
};
backGrndImage.src="images/background.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function(){
	heroReady = true;
};
heroImage.src="images/hero.png";

var monstReady = false;
var monstrImage = new Image();
monstrImage.onload = function(){
	monstReady=true;
};
monstrImage.src = "images/monster.png";

var hero = {
		level : 1,
		speed : 225
};

var monster = {};
var monsterCaught = 0;

var keyDown =[];

addEventListener("keydown", function(e){
	keyDown[e.keyCode]=true;
}, false);

addEventListener("keyup", function(e){
	delete keyDown[e.keyCode];
}, false);

var reset = function(){
	hero.x = canvas.width/2;
	hero.y = canvas.width/2;
	
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var refreshCanvas = function(modifier){
	if(37 in keyDown){
		var current = hero.x - (modifier * hero.speed);		
		if(current >= 0)			
			hero.x -= (modifier * hero.speed);
	}
	if(38 in keyDown){
		var current = hero.y + (modifier * hero.speed);
		if(current >= 0)
			hero.y -= (modifier * hero.speed);
				
	}
	if(39 in keyDown){
		var current = hero.x + (modifier * hero.speed);
		if(current <= (canvas.width-32))
			hero.x += (modifier * hero.speed);
		
	}
	if(40 in keyDown){
		var current = hero.y + (modifier * hero.speed);
		if(current <= (canvas.height-32))
			hero.y += (modifier * hero.speed);
	}
	
	if(hero.x <= (monster.x+32) && monster.x <= (hero.x+32) &&
			hero.y <= (monster.y+32) && monster.y <= (hero.y+32)){
		monsterCaught++;
		reset();
	}	
}

var drawCanvas = function(){
	if(backgrndReady)
		ctx.drawImage(backGrndImage, 0, 0);
	if(heroReady)
		ctx.drawImage(heroImage, hero.x, hero.y);
	if(monstReady)
		ctx.drawImage(monstrImage, monster.x, monster.y);
	document.getElementById("result").innerHTML="Caught : "+monsterCaught;
}

var main =function(){
	var now = Date.now();
	var delta = now - then;
	refreshCanvas(delta/1000);
	drawCanvas();
	then = now;
	requestAnimationFrame(main);
}

var w = window;
var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
//while(1)
main();

