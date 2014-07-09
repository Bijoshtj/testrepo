function timer(){
	count=count-1;
	if(count===0){
		document.getElementById("canvas").classList.add("hide");
		document.getElementById("results").classList.remove("hide");
		clearInterval(counter);
		++ashwins;
		document.getElementById("ashwins").innerHTML="Ash won "+ashwins;document.getElementById("uitslag").innerHTML="Ash won ";
		document.getElementById("again").classList.remove("hide")
	}
	document.getElementById("timer").innerHTML=count+" secs"
}
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
canvas.width=512;
canvas.height=480;
var bgImage=new Image;
bgImage.src="images/background2.png";
var heroImage=new Image;
heroImage.src="images/hero3.png";
var monsterImage=new Image;
monsterImage.src="images/monster1.png";
var barrelImage=new Image;barrelImage.src="images/barrel.png";
var heartImage=new Image;
heartImage.src="images/heart.png";
var count=31;
var counter=setInterval(timer,1e3);
document.getElementById("again").onclick=function(){
	document.getElementById("canvas").classList.remove("hide");
	count=31;
	counter=setInterval(timer,1e3);
	timer();
	levens=["1","1","1"];
	document.getElementById("leven3").classList.remove("hide");
	document.getElementById("leven2").classList.remove("hide");
	document.getElementById("leven1").classList.remove("hide");
	document.getElementById("results").classList.add("hide")
};
var ashwins=0;
document.getElementById("ashwins").innerHTML="Ash won "+ashwins;
var pokewon=0;
document.getElementById("pokewins").innerHTML="Pokémon won "+pokewon;
var levens=["1","1","1"];
var leven=function(){
	if(levens.length===2){
		document.getElementById("leven3").classList.add("hide")
	}
	else if(levens.length===1){
		document.getElementById("leven2").classList.add("hide")
	}
	else if(levens.length===0){
		document.getElementById("leven1").classList.add("hide")
	}
	if(levens.length===0){
		document.getElementById("canvas").classList.add("hide");
		document.getElementById("results").classList.remove("hide");
		document.getElementById("again").classList.remove("hide");
		++pokewon;
		document.getElementById("pokewins").innerHTML="Pokémon won "+pokewon;
		document.getElementById("uitslag").innerHTML="Pokémon won ";
		clearInterval(counter);
		monstersCaught=0;
		barrelCaught=0;
		reBarrel();
		begin();
		reset();
		console.log(levens);
		levens.push("1","1","1")
	}
};
var levenErbij=function(){
	if(levens.length===3){
		document.getElementById("leven3").classList.remove("hide")
	}
	else if(levens.length===2){
		document.getElementById("leven2").classList.remove("hide")
	}else if(levens.length===1){
		document.getElementById("leven1").classList.remove("hide")
	}
};
document.getElementById("reset").onclick=function(){
	location.reload()
};
var hero={speed:5};
var monster={speed:5};
var barrel={};
var heart={};
var monstersCaught=0;
var barrelCaught=0;
var speedCaught=0;
var keysDown={};
addEventListener("keydown",function(e){
	keysDown[e.keyCode]=true
},false);
addEventListener("keyup",function(e){
	delete keysDown[e.keyCode]
},false);
var reset=function(){
	monster.x=32+Math.random()*(canvas.width-64);
	monster.y=32+Math.random()*(canvas.height-64)
};
var resetItem=function(e){
	e.x=600;e.y=600
};
var reBarrel=function(){
	resetItem(barrel);
	setTimeout(function(){
		barrel.x=32+Math.random()*(canvas.width-64);
		barrel.y=32+Math.random()*(canvas.height-64)
	},5e3)
};	
var reHeart=function(){
	setInterval(function(){
		resetItem(heart);
		setTimeout(function(){
			heart.x=32+Math.random()*(canvas.width-64);
			heart.y=32+Math.random()*(canvas.height-64)
		},8e3)
	},1e4)
};		
var begin=function(){
	hero.x=canvas.width/2;hero.y=canvas.height/2
};
var minEen=function(){
	--barrelCaught
};
var minSpeed=function(){
	--speedCaught
};
var update=function(){
	if(87 in keysDown){
		hero.y-=hero.speed
	}
	if(83 in keysDown){
		hero.y+=hero.speed
	}
	if(65 in keysDown){
		hero.x-=hero.speed
	}
	if(68 in keysDown){
		hero.x+=hero.speed
	}
	if(38 in keysDown){
		monster.y-=monster.speed
	}
	if(40 in keysDown){
		monster.y+=monster.speed
	}
	if(37 in keysDown){
		monster.x-=monster.speed
	}
	if(39 in keysDown){
		monster.x+=monster.speed
	}
	if(hero.x<=monster.x+32&&monster.x<=hero.x+32&&hero.y<=monster.y+32&&monster.y<=hero.y+32){
		++monstersCaught;
		levens.pop();
		leven();
		reset()
	}
	else if(hero.x<=barrel.x+32&&barrel.x<=hero.x+32&&hero.y<=barrel.y+32&&barrel.y<=hero.y+32){
		++barrelCaught;
		setTimeout(minEen,2e3);
		reBarrel()
	}
	else if(monster.x<=barrel.x+32&&barrel.x<=monster.x+32&&monster.y<=barrel.y+32&&barrel.y<=monster.y+32){
		++speedCaught;
		setTimeout(minSpeed,2e3);
		reBarrel()
	}
	else if(hero.x<=heart.x+32&&heart.x<=hero.x+32&&hero.y<=heart.y+32&&heart.y<=hero.y+32){
		resetItem(heart);
		levens.push("1");
		levenErbij()
	}
	if(hero.x>=canvas.width-60){
		hero.x=canvas.width-60
	}
	if(hero.x<=30){
		hero.x=30
	}
	if(hero.y>=canvas.height-60){
		hero.y=canvas.height-60
	}
	if(hero.y<=30){
		hero.y=30
	}
	if(monster.x>=canvas.width-60){
		monster.x=canvas.width-60
	}
	if(monster.x<=30){
		monster.x=30
	}
	if(monster.y>=canvas.height-60){
		monster.y=canvas.height-60
	}
	if(monster.y<=30){
		monster.y=30
	}
};
var render=function(){
	ctx.drawImage(bgImage,0,0);
	ctx.drawImage(heroImage,hero.x,hero.y);
	ctx.drawImage(monsterImage,monster.x,monster.y);
	ctx.drawImage(barrelImage,barrel.x,barrel.y);
	ctx.drawImage(heartImage,heart.x,heart.y)
};
var main=function(e){
	update();
	if(barrelCaught===1){
		hero.speed=10;
	}
	else{hero.speed=5}
	if(speedCaught===1){
		monster.speed=10
	}
	else{
		monster.speed=5
	}
	render();
	requestAnimationFrame(main)
};
var w=window;
requestAnimationFrame=w.requestAnimationFrame||w.webkitRequestAnimationFrame||w.msRequestAnimationFrame||w.mozRequestAnimationFrame;
reBarrel();
setTimeout(reHeart,1e3);
begin();
reset();
main();			