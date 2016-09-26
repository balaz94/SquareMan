var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var key = 0, level = 0, score = 0, bestScore = 0;

var blocks, enemies, scores, sX, sY, mX, mY, lMenu, lScore;
var co = ["#263238", "#FFFFFF", "#b95d8d", "#ffec8b", "#66cdaa"];

var MyObj = function(x, y, w, h, color) {
	this.w = w;
	this.h = h;
	this.x = x;
	this.y = y;
	this.color = color;
}
var Player = function(x, y, w, h, s) {
	this.m = new MyObj(x, y, w, h, co[0]);
	this.s = s;
	this.xOld = this.m.x;
	this.yOld = this.m.y;
	this.draw = function() { redraw(this); } 
	this.update = function() {
		this.xOld = this.m.x;
		this.yOld = this.m.y;
		if (key == 37 && this.m.x > 0 && collisionArray(this)) {
			this.m.x -= this.s;
		} else if (key == 39 && this.m.x + this.m.w < 400 && collisionArray(this)) {
			this.m.x += this.s;
		} else if (key == 38 && this.m.y > 0 && collisionArray(this)) {
			this.m.y -= this.s;
		} else if (key == 40 && this.m.y + this.m.h < 400 && collisionArray(this)) {
			this.m.y += this.s;
		}
		key = 0;
	}

}
var Enemy = function(x, y, w, h, s, start, last, horizontal) {
	this.m = new MyObj(x, y, w, h, co[2]);
	this.xOld = this.m.x;
	this.yOld = this.m.y;
	this.s = s;
	this.draw = function() { redraw(this); } 
	this.update = function() {
		if (collisionObject(p.m, this.m)) {
			c.clearRect(p.m.x, p.m.y, p.m.w, p.m.h);
			p.m.x = sX;
			p.m.y = sY;
			if (score > 0)
				score--;
			updateScore();
		}
		if (horizontal) {
			this.xOld = this.m.x;
			this.m.x += this.s;
			if (this.m.x >= last || this.m.x <= start) {
				this.s = - this.s;
			} 
		} else {
			this.yOld = this.m.y;
			this.m.y += this.s;
			if (this.m.y >= last || this.m.y <= start) {
				this.s = - this.s;
			} 
		}
	}
}
var Score = function(x, y) {
	this.m = new MyObj(x + 5, y + 5, 10, 10, co[3]);
	this.draw = function() { draw(this.m); }
}
var NextLevel = function(x, y, w, h) {
	this.m = new MyObj(x, y, w, h, co[4]);
	this.draw = function() { draw(this.m); }
	this.update = function() {
		if (collisionObject(p.m, this.m)) {
			switch (level) {
				case 1: cLevel2(); break;
				case 2: cLevel3(); break;
				case 3: cLevel4(); break;
				case 4: cLevel5(); break;
				case 5: restart();
			}
			if (level != 0)
				level++;
			uLevel();
		}
	}
}
var Block = function(x, y, w, h) {
	this.m = new MyObj(x, y, w, h, co[1]);
	draw(this.m);
}
function draw(m) {
	c.fillStyle = m.color;
	c.fillRect(m.x, m.y, m.w, m.h);
}
function redraw(o) {
	draw(o.m);
	clear(o.m.x, o.m.y, o.xOld, o.yOld, o.m.w, o.m.h, o.s);
}
function clear(x, y, xOld, yOld, w, h, s) {
	if (xOld != x) {
		if (x > xOld) {
			c.clearRect(xOld, yOld, s, h);
		} else {
			c.clearRect(xOld + w - s, yOld, s, h);
		}
	} 
	if (yOld != y) {
		if (y > yOld) {
			c.clearRect(xOld, yOld, w, s);
		} else {
			c.clearRect(xOld, yOld + h - s, w, s);
		}
	}
}
function restart() {
	if (bestScore < score)
		bestScore = score;
	level = 0;
	score = 0;
	updateScore();
	uLevel();
	cMenu(); 
}
function collisionBlock(p, b) {
	switch (key) {
        case 39:
            return (p.x + p.w == b.x) && (p.y > b.y || p.y + p.h > b.y) 
				&& (p.y < b.y + b.h || p.y + p.h < b.y + b.h);
        case 37:
            return (p.x == b.x + b.w) && (p.y > b.y || p.y + p.h > b.y) 
				&& (p.y < b.y + b.h || p.y + p.h < b.y + b.h);
        case 38:
            return (p.y == b.y + b.h) && (p.x > b.x || p.x + p.w > b.x) 
				&& (p.x < b.x + b.w || p.x + p.w < b.x + b.w);
        case 40:
            return (p.y + p.h == b.y) && (p.x > b.x || p.x + p.w > b.x) 
				&& (p.x < b.x + b.w || p.x + p.w < b.x + b.w);
	}
	return false;
}
function collisionObject(p, b) {
	return ((p.x + p.w > b.x && p.x < b.x + b.w) && (p.y > b.y || p.y + p.h > b.y) 
				&& (p.y < b.y + b.h || p.y + p.h < b.y + b.h));
}
function collisionArray(p) {
	for (x in blocks)
		if (collisionBlock(p.m, blocks[x].m))
			return false;
	return true;
}
function defaultArrays() {
	blocks = new Array();
	scores = new Array();
	enemies = new Array();
}
function createBlocks2(x1, x2, w, y) {
	cBlock(x1, y, x2 - x1 - 30, 20);
	cBlock(x2, y, w, 20);
}
function createBlocks3(x1, x2, x3, w, y) {
	cBlock(x1, y, x2 - x1 - 30, 20);
	cBlock(x2, y, x3 - x2 - 30, 20);
	cBlock(x3, y, w, 20);
}
function move(e) {
	key = e.keyCode;
	if (e.keyCode == 27)
		restart();
}
document.onkeydown = move;

function updateScore() {
	document.getElementById("score").innerHTML = "Score: " + score.toString();
}
function uLevel() {
	document.getElementById("level").innerHTML = "Level: " + level.toString();
}
var p = new Player(100, 380, 20, 20, 10);
var n = new NextLevel(240, 380, 20, 20);
cMenu();

function mainLoop() {
	p.update();
	p.draw();
	n.draw();
	n.update();
	for (i in scores) {
		if (scores[i] != null) {
			if (collisionObject(p.m, scores[i].m)) {
				c.clearRect(scores[i].m.x, scores[i].m.y, scores[i].m.w, scores[i].m.h);
				score++;
				updateScore();
				scores[i] = null;
			} else {
				scores[i].draw();
			}
		}
	}
	for(i in enemies) {
		enemies[i].update();
		enemies[i].draw();
	}
    requestAnimationFrame(mainLoop);
}
mainLoop();

function cMenu() {
	defaultArrays();
	lMenu = true;
	lScore = false;
	sLevel(500, -100, 500, 500);
	cBlock(480, -100, 20, 20);
	cBlock(500, -80, 40, 20);
	c.fillStyle = co[2];
	c.fillRect(100, 150, 200, 60);
	c.fillRect(150, 250, 100, 60);
	c.fillStyle = co[1];
	c.font = "60px sans-serif";
	c.fillText("SquareMan", 50, 80);
	c.font = "40px sans-serif";
	c.fillText("Play", 160, 195);
	c.fillText("Help", 160, 295);
	c.fillText("Highscore is " + bestScore, 70, 360);
}
function cHelp() {
	lScore = true;
	var names = ["Player", "Block", "Enemy", "Score", "Next level"];
	c.fillStyle = co[2];
	c.fillRect(125, 350, 150, 40);
	c.font = "40px sans-serif";
	c.fillStyle = "#FFFFFF";
	c.fillText("Help", 160, 50);
	for (var i = 0; i < co.length; i++) {
		var m = new MyObj(20, 60 + i * 40 + 20, 25, 25, co[i]);
		draw(m);
		c.font = "18px sans-serif";
		c.fillStyle = co[1];
		c.fillText(names[i], 60, 60 + (i + 1) * 40);
	}
	c.fillText("Back to menu", 145, 375);
	c.fillText("Arrows - move", 30, 300);
	c.fillText("ESC - menu", 30, 320);
	c.fillText("Enemy colision - score decrement", 30, 340);
}
function sLevel(xP, yP, xN, yN) {
	c.clearRect(0, 0, 400, 400);
	sX = xP;
	sY = yP;
	p.m.x = sX;
	p.m.y = sY;
	n.m.x = xN;
	n.m.y = yN;
	defaultArrays();
}
function cBlock(x, y, w, h) {
	blocks.push(new Block(x, y, w, h));
}
function cScore(x, y) {
	scores.push(new Score(x, y));
}
function cEnemy(x, y, w, h, s, start, last, horizontal) {
	enemies.push(new Enemy(x, y, w, h, s, start, last, horizontal));
}
function addScore() {
	for (var i = 0; i < 10; i++) {
		if (i % 2 == 0)
			cScore(0, (i * 2) * 20);
		else
			cScore(380, (i * 2) * 20);
	}
}
function cLevel1() {
	sLevel(20, 380, 380, 0);
	for (var i = 0; i < 9; i++) {
		var y = (i * 2 + 1) * 20;
		switch(i % 4) {
			case 0: createBlocks2(20, 240, 160, y); break;
			case 1: createBlocks3(0, 120, 300, 100, y); break;
			case 2: createBlocks2(0, 160, 220, y); break;
			default: createBlocks3(20, 140, 280, 120, y);
		}
		cEnemy(i * 40, i * 40, 20, 20, i % 3 + 1, 0, 380, true);
	}
	addScore();
}
function cLevel2() {
	sLevel(20, 380, 380, 0);
	for (var i = 0; i < 9; i++) {
		cEnemy((i % 5) * 20, i * 40, 20, 20, i % 5 + 1, 0, 380, true);
		if (i % 2 == 0) 
			createBlocks3(0, 160, 280, 120, (i * 2 + 1) * 20);
		else 
			cBlock(20, (i * 2 + 1) * 20, 360, 20);
	}
	addScore();
}
function cLevel3() {
	sLevel(20, 380, 380, 0);
	for (var i = 0; i < 9; i++) {
		var y = (i * 2 + 1) * 20;
		switch(i % 4) {
			case 0: createBlocks2(20, 300, 100, y); break;
			case 1: createBlocks2(0, 200, 200, y); break;
			case 2: createBlocks2(20, 160, 220, y); break;
			default: createBlocks2(0, 100, 300, y);
		}
		cEnemy(360 - (i % 5) * 20, i * 40, 20, 20, i % 5 + 1, 0, 380, true);
	}
	addScore();
}
function cLevel4() {
	sLevel(200, 380, 380, 0);
	for (var i = 0; i < 19; i++) {
		cEnemy((i % 19) * 20, i * 20, 20, 20, i % 5 + 1, 0, 380, true);
	}
	addScore();
}
function cLevel5() {
	sLevel(20, 380, 380, 0);
	for (var x = 1; x < 20; x += 2) {
		for (var y = 1; y < 19; y += 2) {
			cBlock(x * 20, y * 20, 20, 20);
			if (x == 1) {
				cEnemy(20, y * 20 - 20, 20, 20, 3, 0, 380, true);
				cScore(380, (y * 2) * 20);
				cScore(340, (y * 2) * 20);
			}

		}
		cEnemy(x * 20 - 20, 20, 20, 20, 3, 0, 380, false);
	}
}
canvas.addEventListener('mousemove', function(evt) {
	if (lMenu) {
		var r = canvas.getBoundingClientRect();
	  	mX =  evt.clientX - r.left;
	  	mY = evt.clientY - r.top;
	}
}, false);
canvas.addEventListener('click', function() { 
	if (lMenu) {
		if (lScore) {
			if (clickIn(mX, mY, 145, 370, 150, 40)) {
				lHelp = false;
				cMenu();
			}
		} else {
			if (clickIn(mX, mY, 120, 170, 200, 60)) {
				lMenu = false;
				level++;
				uLevel();
				cLevel1();
			} else if (clickIn(mX, mY, 170, 270, 100, 60)) {
				lHelp = true;
				c.clearRect(0, 0, 400, 400);
				cHelp();
			}
		}
	}
}, false);
function clickIn(x1, y1, x2, y2, w2, h2) {
	return x1 >= x2 && x1 <= x2 + w2 && y1 > y2 && y1 <= y2 + h2;
}
