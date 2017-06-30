var myGamePiece;
var myScore;
var myGameResult;
var myLevel;
var colors = ['#d9d9db', '#cbd9ef', '#efe4cb'];
//var frames = [];
var bestPlayer = document.getElementById('player');
var bestScore = document.getElementById('score');
var gameWrapper = document.getElementById('game-wrapper');
var scoreBlock = document.getElementById('score-block');
var buttonsBlock = document.getElementById('buttons-block');
var playerName;
var playButton = document.getElementById('play-button');
var replayButton = document.getElementById('replay-button');
//var myEnemies = [];
//var myOtherEnemies = [];

playButton.addEventListener('click', function() {
	playerName = document.getElementById('player-name').value;
})

replayButton.style.display = 'none';

function startGame() {
	myGamePiece = new component(randomPositionX(), randomPositionY(), 15, 'sprite-test.png', 0, 0, 'image');
	myLevel = new component(400, 30, 'italic small-caps bold 12px arial', '#4f4e4b', 0, 0, 'text');
	myScore = new component(400, 50, 'italic small-caps bold 12px arial', '#4f4e4b', 0, 0, 'text');
	myGameArea.start();
}

var myGameArea = {
	canvas: document.createElement('canvas'),
	start: function() {
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.canvas.style.border = '1px solid #4f4e4b';
		this.context = this.canvas.getContext('2d');
		gameWrapper.appendChild(this.canvas);
		scoreBlock.style.display = 'none';
		buttonsBlock.style.display = 'none';
		this.canvas.focus();
		this.frameNumber = 0;
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', moveGamePiece);
		this.myEnemies = [];
		this.myOtherEnemies = [];
		this.frames = [];
		this.playerName = playerName;
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function() {
		clearInterval(this.interval);
	},
	changeColor: function()	{
		var colorIndex = Math.round(this.frameNumber / 300) % 3;
		this.canvas.style.backgroundColor = colors[colorIndex];
	},
	result: function() {
		myGameResult = Math.round(this.frameNumber / 30);
	},
	copy: function() {
		var frame = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.frames.push(frame);
	}
};

function component(x, y, radius, color, speedX, speedY, type) {
	this.x = x;
	this.y = y;
	this.speedX = speedX;
	this.speedY = speedY;
	this.radius = radius;
	this.color = color;
	this.type = type;
	this.step = 0;
	
	if (type == 'image') {
		this.image = new Image();
		this.image.src = color;
	}
	
	this.draw = function(ctx) {
		if (this.type == 'text') {
			ctx.font = this.radius;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, this.x, this.y);
		} 

		else if (this.type == 'image') {
			this.step += 1;
			this.step = this.step % 30;
			var dir = 0;

			if (this.speedX <= 0 && this.speedY <= 0) {
				if (Math.abs(this.speedX) < Math.abs(this.speedY)) {
					dir = 3;
				} else {
					dir = 1;
				}
			}

			if (this.speedX <= 0 && this.speedY >= 0) {
				if (Math.abs(this.speedX) < Math.abs(this.speedY)) {
					dir = 0;
				} else {
					dir = 1;
				}
			}

			if (this.speedX >= 0 && this.speedY <= 0) {
				if (Math.abs(this.speedX) < Math.abs(this.speedY)) {
					dir = 3;
				} else {
					dir = 2;
				}
			}

			if (this.speedX >= 0 && this.speedY >= 0) {
				if (Math.abs(this.speedX) < Math.abs(this.speedY)) {
					dir = 0;
				} else {
					dir = 2;
				}
			}

			if (this.speedX == 0 && this.speedY == 0) {
				dir = 0;
			}

			ctx.drawImage(
				this.image,												// img	Source image
				this.image.width / 3 * Math.floor(this.step / 10),		// sx	Source x
				this.image.height / 4 * dir,							// sy	Source y
				this.image.width / 3,									// sw	Source width
				this.image.height / 4,	// sh	Source height
				this.x - this.radius,	// dx	Destination x
				this.y - this.radius,	// dy	Destination y
				this.radius * 2,		// dw	Destination width
				this.radius * 2			// dh	Destination height
				);
		} 

		else {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();
		}
	}
	
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
		
		if (this.x > myGameArea.canvas.width) {
			this.x = 0;
		}
		if (this.x < 0) {
			this.x = myGameArea.canvas.width;
		}
		if (this.y > myGameArea.canvas.height) {
			this.y = 0;
		}
		if (this.y < 0) {
			this.y = myGameArea.canvas.height;
		}
	}
	
	this.collisionDetected = function(player) {
		var dx = player.x - this.x;
		var dy = player.y - this.y;
		var distance = Math.sqrt(dx * dx + dy * dy);
		
		if (distance < this.radius + player.radius) {
			return true;
		} else {
			return false;
		}
	}
	
	this.startFollowing = function(player) {
		var dx = player.x - this.x;
		var dy = player.y - this.y;
		var distance = Math.sqrt(dx * dx + dy * dy); //расстояние между объектами
		var angle = Math.atan2(dy, dx); //значение угла между объектами в радианах
		var speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
		
		if (distance < (this.radius + player.radius) * 3) {
			this.speedX = speed * Math.cos(angle);
			this.speedY = speed * Math.sin(angle);
		} 
	}
}


function everyInterval(n) {
	if ((myGameArea.frameNumber / n) % 1 == 0) {
		return true;
	}
	return false;
}

function randomNumber() { return (Math.random() < 0.5 ? -1 : 1)*(Math.random() * 3);}

function randomPositionX() {return (Math.round(Math.random() * myGameArea.canvas.width));}

function randomPositionY() {return (Math.round(Math.random() * myGameArea.canvas.height));}

function moveGamePiece(event) {
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;

	if (event.keyCode == 37) {
		myGamePiece.speedX = -4;
	} 

	if (event.keyCode == 39) {
		myGamePiece.speedX = 4;
	} 

	if (event.keyCode == 38) {
		myGamePiece.speedY = -4;
	} 

	if (event.keyCode == 40) {
		myGamePiece.speedY = 4;
	}
}

var arr = JSON.parse(localStorage.getItem('bestscore')) || [0, 0];
bestPlayer.innerHTML = arr[0];
bestScore.innerHTML = arr[1];


function setHistoryItem() {
	if (myGameResult > Number(arr[1])) {
		arr[1] = myGameResult;
		arr[0] = playerName;
		localStorage.setItem('bestscore', JSON.stringify(arr));
	}
}

function updateGameArea() {
	var ctx = myGameArea.context;
	
	for (var j = 0; j < myGameArea.myOtherEnemies.length; j++) {
		if(myGamePiece.collisionDetected(myGameArea.myOtherEnemies[j])) {
			myGameArea.stop();
			setHistoryItem();
			bestPlayer.innerHTML = arr[0];
			bestScore.innerHTML = arr[1];
			buttonsBlock.style.display = 'flex';
			buttonsBlock.style.position = 'absolute';
			replayButton.style.display = 'block';
			return;
		} 
	}
	
	for (var i = 0; i < myGameArea.myEnemies.length; i++) {
		if(myGamePiece.collisionDetected(myGameArea.myEnemies[i])) {
			myGameArea.stop();
			setHistoryItem();
			bestPlayer.innerHTML = arr[0];
			bestScore.innerHTML = arr[1];
			buttonsBlock.style.display = 'flex';
			buttonsBlock.style.position = 'absolute';
			replayButton.style.display = 'block';
			myGameArea.clear();
			return;
		} 
	}
	myGameArea.clear();

	myGameArea.frameNumber += 1;
	if (myGameArea.frameNumber == 1 || everyInterval(150)) {
		myGameArea.myEnemies.push(new component(randomPositionX(), randomPositionY(), 15, 'sprite-enemy.png', randomNumber(), randomNumber(), 'image'));
	}

	if (myGameArea.frameNumber == 1 || everyInterval(300)) {
		myGameArea.myOtherEnemies.push(new component(randomPositionX(), randomPositionY(), 15, 'sprite-another-enemy.png', randomNumber(), randomNumber(), 'image'));
	}

	myGameArea.changeColor();
	
	for (i = 0; i < myGameArea.myEnemies.length; i++) {
		myGameArea.myEnemies[i].newPos();
		myGameArea.myEnemies[i].draw(ctx);
	}

	for (j = 0; j < myGameArea.myOtherEnemies.length; j++) {
		myGameArea.myOtherEnemies[j].startFollowing(myGamePiece);
		myGameArea.myOtherEnemies[j].newPos();
		myGameArea.myOtherEnemies[j].draw(ctx);
	}

	myGameArea.result();
	myLevel.text = "LEVEL: " + Math.round(myGameArea.frameNumber / 300); 
	myLevel.draw(ctx);
	myScore.text = "SCORE: " + myGameResult;
	myScore.draw(ctx);
	myGamePiece.newPos();
	myGamePiece.draw(ctx);
	myGameArea.copy();

}

function bestReplay() {
	var ctx = myGameArea.context;
	var frameIndex = 0;
	var timer = setInterval(function() {
		ctx.putImageData(myGameArea.frames[frameIndex++], 0, 0);
		if (frameIndex >= myGameArea.frames.length) {
			clearInterval(timer);
		}
	}, 5);
}

//localStorage.clear();


var router = new Router({
  routes: [{
    name: 'index',
    match: '',
    //onEnter: () => console.log('onEnter index')
  }, {
    name: 'play-game',
    match: (text) => text === 'play-game',
    onEnter: () => startGame()
  }, {
    name: 'replay-game',
    match: (text) => text === 'replay-game',
    onEnter: () => bestReplay()
  }]
});