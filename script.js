var myGamePiece;
var myEnemies = [];

function startGame() {
	myGamePiece = new component(randomPositionX(), randomPositionY(), 20, 'red', 0, 0);
	myGameArea.start();
}

var myGameArea = {
	canvas: document.createElement('canvas'),
	start: function() {
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext('2d');
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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

function component(x, y, radius, color, speedX, speedY) {
	this.x = x;
	this.y = y;
	this.speedX = speedX;
	this.speedY = speedY;
	this.radius = radius;
	this.update = function() {
		ctx = myGameArea.context;
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
	}
	this.newPos = function() {
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.x + this.speedX > myGameArea.canvas.width) {
			this.x = 0;
		} else if (this.x + this.speedX < 0) {
			this.x = myGameArea.canvas.width;
		} else if (this.y + this.speedY > myGameArea.canvas.height) {
			this.y = 0;
		} else if (this.y + this.speedY < 0) {
			this.y = myGameArea.canvas.height;
		} 
	}
	this.collisionDetection = function(enemy) {
		this.distance = Math.sqrt(Math.pow((this.x - enemy.x), 2) + Math.pow((this.y - enemy.y), 2));
		if (this.distance < this.radius + enemy.radius) {
			return true;
		} else {
			return false;
		}
	}
	this.startFollowing = function(player) {
		this.distance = Math.sqrt(Math.pow((player.x - this.x), 2) + Math.pow((player.y - this.y), 2)); //расстояние между объектами
		this.angle = Math.atan2(player.y - this.y, player.x - this.x) * 180 / Math.PI; //значение угла между объектами в градусах
		this.amp = Math.sqrt(Math.pow(speedX, 2) + Math.pow(speedY, 2));
		if (this.distance < (this.radius + player.radius) * 3) {
			this.speedX = this.amp * Math.sin(this.angle);
			this.speedY = this.amp * Math.cos(this.angle);
		} 
	}
}

function everyInterval(n) {
	if ((myGameArea.frameNumber / n) % 1 == 0) {
		return true;
	}
	return false;
}

function randomNumber() { return (Math.random() < 0.5 ? -1 : 1)*(Math.random() * 5);}

function randomPositionX() {return (Math.round(Math.random() * myGameArea.canvas.width));}

function randomPositionY() {return (Math.round(Math.random() * myGameArea.canvas.height));}



function moveGamePiece(event) {
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
	if (event.keyCode == 37) {
		myGamePiece.speedX = -1;
	} else if (event.keyCode == 39) {
		myGamePiece.speedX = 1;
	} else if (event.keyCode == 38) {
		myGamePiece.speedY = -1;
	} else if (event.keyCode == 40) {
		myGamePiece.speedY = 1;
	}
}

function updateGameArea() {
	for (var i = 0; i < myEnemies.length; i++) {
		
		if(myGamePiece.collisionDetection(myEnemies[i])) {
			myGameArea.stop();
			return;
		} 
	}
	myGameArea.clear();

	myGameArea.frameNumber += 1;
	if (myGameArea.frameNumber == 1 || everyInterval(150)) {
		myEnemies.push(new component(randomPositionX(), randomPositionY(), 15, 'grey', randomNumber(), randomNumber()));
	}
	for (i = 0; i < myEnemies.length; i++) {
		myEnemies[i].startFollowing(myGamePiece);
		myEnemies[i].newPos();
		myEnemies[i].update();
	}
	myGamePiece.newPos();
	myGamePiece.update();
}


startGame();

