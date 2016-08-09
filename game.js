var imgBackground=new Image();
imgBackground.src="img/background.png"

var imgPlayer=new Image();
imgPlayer.src="img/player.png"

var ball=new Image();
ball.src="img/enemy.png";

var item1 = new Image();
item1.src = "img/item1.png";

var item2 = new Image();
item2.src = "img/item2.png";

var bgm = new Audio();
bgm.src = "sound/ready.mp3";
bgm.loop = true;
document.body.appendChild(bgm);

var yelow = new Array();
var greenArr = new Array();
var yellowArr = new Array();

var intervalItem;
var intervalMake;
var intervalMove;
var intervalUpdate;
var intervalRender;
var intervalScore;
var arrBall = new Array();
var game=0;
var gameStateReady=0;
var gameStateGame=1;
var gameStateOver=2;
var x=600;
var y=600;
var check=0;
var up = false;
var down = false;
var right = false;
var left = false;
var score = 0;
var theCanvas=document.getElementById("GameCanvas");
var Context=theCanvas.getContext("2d");
var randomX = randomInt(1024);
var randomY = randomInt(768);
var greenBall = false;
var yellowBall = false;

window.addEventListener("load",drawScreen,false);
window.addEventListener("keydown",onkeydown,false);
window.addEventListener("keyup",onkeyup,false);

bgm.play();

function drawScreen(){
	Context.drawImage(imgBackground,0,0,1024,768);
	Context.fillStyle="#fff";
	Context.font="24px NanumGothic";

	if(game==gameStateReady){
		Context.fillText("Press Enter To Start",380,384);
	}
	else if(game==gameStateGame){
		Context.fillText(score,100,100);
		Context.drawImage(imgPlayer,x,y,100,100);
		for(var i = 0; i < arrBall.length; i++)
			Context.drawImage(ball, arrBall[i].x, arrBall[i].y,80,80);
		drawGreen();
		drawYellow();
	}
	else if(game==gameStateOver){
		Context.fillText("GameOver",460,384);
		Context.fillText("Score : "+score ,460, 200);
	}
}
function onGameStart(){
	score=0;
	game = gameStateGame;
	intervalmake = setInterval(makeBall, 1000);
	intervalId = setInterval(moveBall,10);
	intervalUpdate = setInterval(update, 1);
	intervalRender = setInterval(drawScreen, 1);
	intervalScore = setInterval(addScore, 100);
	intervalItem = setInterval(spawnItem, 3000);
	drawScreen();
}
function spawnItem() {
	var itemType = randomInt(2);
	switch(itemType) {
		case 1: greenArr.push( {x : randomInt(1024), y : randomInt(768) } ); break;
		case 2: yellowArr.push( {x : randomInt(1024), y : randomInt(768) } ); break;
	}
}
function addScore(){
	score++;
}
function makeBall(){
	arrBall.push({x : randomInt(1024), y : 0, go_x : goX(), go_y : goY()});
}

function onGameOver(){
	while(arrBall.length>0)
		arrBall.pop();
	clearInterval(intervalMake);
	clearInterval(intervalId);
	clearInterval(intervalUpdate);
	clearInterval(intervalRender);
	clearInterval(intervalScore);
	clearInterval(intervalItem);
	game=gameStateOver;

}
function randomInt(max){
	return 1 + Math.floor(Math.random()*max);
}
function moveBall(){
	for(var i=0;i<arrBall.length;i++){
		arrBall[i].x += arrBall[i].go_x;
		arrBall[i].y += arrBall[i].go_y;
		if(collision(x, y, arrBall[i].x, arrBall[i].y))
			onGameOver();
		if(arrBall[i].x<-50 || arrBall[i].x>1100||
		   arrBall[i].y<-100|| arrBall[i].y>800){
		   arrBall[i].x = randomInt(1024);
		   arrBall[i].y = 0;
		   arrBall[i].go_x = goX();
		   arrBall[i].go_y = goY();
		}
	}
	drawScreen();
}
function collision(playerX, playerY, enemyX, enemyY){
	if(playerX + 70 > enemyX  && playerX  < enemyX + 50 && playerY  < enemyY + 50 && playerY + 70 > enemyY){
		return true;
	}
	return false;
}
function onkeydown(e){
	if(game==gameStateReady){
		if(e.keyCode==13){
			onGameStart();
		}
	}
	else if(game==gameStateGame){
		switch(e.keyCode){
			case 38:
				up = true;
				break;
			case 40:
				down = true;
				break;
			case 37:
				left = true;
				break;
			case 39:
				right = true;
				break;
		}
	}
	else if(game==gameStateOver){
		if(e.keyCode==13){
			game=gameStateReady;
		}
	}
	drawScreen();
}
function update(){
	if ( y > 0 && up == true )
		y -= 1;
	if ( y < 730 && down == true )
		y += 1;
	if ( x > 0 && left == true )
		x -= 1;
	if ( x < 1000 && right == true )
		x += 1;
}
function onkeyup(e){
	switch(e.keyCode){
		case 37 : left = false; break;
		case 39 : right = false; break;
		case 38 : up = false; break;
		case 40 : down = false; break;
	}
	drawScreen();
}
function goX() {
	switch(randomInt(4)) {
		case 1:return -1;
		case 2:return -2;
		case 3:return 1;
		case 4:return 2;
	}
}
function goY() {
	switch(randomInt(2)) {
		case 1:return 1;
		case 2:return 2;
	}
}

function drawGreen() {
	var i;
	for(i = 0; i < greenArr.length; i++) {
		Context.drawImage(item1, greenArr[i].x, greenArr[i].y, 80, 80);
		if(collision(x, y, greenArr[i].x, greenArr[i].y)){
			greenArr.splice(i, 1);
			excuteGreen();
		}
	}
}
function drawYellow() {
	var i;
	for(i = 0; i < yellowArr.length; i++) {
		Context.drawImage(item2, yellowArr[i].x, yellowArr[i].y, 80, 80);
		if(collision(x, y, yellowArr[i].x, yellowArr[i].y))
			//yelow.push({x : yellowArr[i].x, y : yellowArr[i].y});
			//excuteYellow();
			yellowArr.splice(i, 1);
	}
}
function excuteGreen() {
	while(arrBall.length != 0) {
		arrBall.pop();
	}
}
function excuteYellow() {
	var i;
	for(i = 0; i < yelow.length; i++) {
		Context.drawImage(item2, yelow[i].x - 100, yelow[i].y + 100, 300, 300);
		//setTimeOut('yelow.shift()', 5000);
	}
}
