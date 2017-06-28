var myGamePiece;
var myEnemies = [];
var myOtherEnemies = [];
var myScore;

function startGame() {
	myGamePiece = new component(randomPositionX(), randomPositionY(), 15, 'sprite-test.png', 0, 0, 'image');
	myScore = new component(400, 50, 'italic small-caps bold 12px arial', 'black', 0, 0, 'text');
	myGameArea.start();
}

var myGameArea = {
	canvas: document.createElement('canvas'),
	start: function() {
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext('2d');
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.canvas.focus();
		this.frameNumber = 0;
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', moveGamePiece);
	},
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function() {
		clearInterval(this.interval);
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

function updateGameArea() {
	var ctx = myGameArea.context;

	for (var j = 0; j < myOtherEnemies.length; j++) {
		if(myGamePiece.collisionDetected(myOtherEnemies[j])) {
			myGameArea.stop();
			return;
		} 
	}
	
	for (var i = 0; i < myEnemies.length; i++) {
		if(myGamePiece.collisionDetected(myEnemies[i])) {
			myGameArea.stop();
			return;
		} 
	}
	myGameArea.clear();

	myGameArea.frameNumber += 1;
	if (myGameArea.frameNumber == 1 || everyInterval(150)) {
		myEnemies.push(new component(randomPositionX(), randomPositionY(), 15, 'sprite-enemy.png', randomNumber(), randomNumber(), 'image'));
		myOtherEnemies.push(new component(randomPositionX(), randomPositionY(), 15, 'sprite-another-enemy.png', randomNumber(), randomNumber(), 'image'));
	}

	for (i = 0; i < myEnemies.length; i++) {
		myEnemies[i].newPos();
		myEnemies[i].draw(ctx);
	}

	for (j = 0; j < myOtherEnemies.length; j++) {
		myOtherEnemies[j].startFollowing(myGamePiece);
		myOtherEnemies[j].newPos();
		myOtherEnemies[j].draw(ctx);
	}

	
	myScore.text = "SCORE: " + Math.round(myGameArea.frameNumber / 30);
	myScore.draw(ctx);
	myGamePiece.newPos();
	myGamePiece.draw(ctx);
}

startGame();

