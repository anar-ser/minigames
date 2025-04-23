// Event listeners
var pressedKeys = {};
window.onkeyup   = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true;  }

const background = document.getElementById('game-map');
let footer = document.getElementById('footer');

let player = document.getElementById('player');

let cameraOffset = { left: 0, top: 0 };
let playerOffset = { left: 300, top: 300 };

function cameraMove(x, y) {
	border = 4
	x -= (window.innerWidth - player.offsetWidth)/2;
	y -= (window.innerHeight - player.offsetHeight)/2;
	speedX = (window.pageXOffset - x) / window.innerWidth * 32;
	speedY = (window.pageYOffset - y) / window.innerHeight * 32;
	if ( Math.abs(speedX) > border ) {
		cameraOffset.left = window.pageXOffset - Math.sign(speedX) * (Math.abs(speedX)-border);
	}
	if ( Math.abs(speedY) > border ) {
		cameraOffset.top = window.pageYOffset - Math.sign(speedY) * (Math.abs(speedY)-border);
	}
	console.log();
	window.pageXOffset
	window.scroll(cameraOffset);
	footer.style.left = window.pageXOffset / (background.offsetWidth - window.innerWidth) *
						(background.offsetWidth - footer.offsetWidth) + 'px';
}
		
function startGame() {
    gameRunning = true;
    requestAnimationFrame(gameLoop);
}

function render() {
	
}

/* Main Game Loop */
var gameLoop = function(interval) {
	
	if (pressedKeys[65]) {
		playerOffset.left -= 5;
	}
	if (pressedKeys[68]) {
		playerOffset.left += 5;
	}
	if (pressedKeys[87]) {
		playerOffset.top -= 5;
	}
	if (pressedKeys[83]) {
		playerOffset.top += 5;
	}
	
	player.style.top = playerOffset.top + 'px';
	player.style.left = playerOffset.left + 'px';
	cameraMove(playerOffset.left, playerOffset.top)
}

/* Set FPS */
let FPS = 60;
let interval = 1 / FPS;
let frameCounter = 0;
let oldTime = Date.now();
let previousFrameTime = oldTime;

/* Game States */
setInterval(function() {
    let now = Date.now();
    /*if (!gameStarted) {
        if (gameOver) {
            if (audioPlaying) {
                audioElement.pause();
                audioPlaying = false;
            }
            gameOverScreen(now, oldTime);
        } else if (demoComplete){
            demoCompleteScreen(now, oldTime);
        } else {
            if (audioPlaying) {
                audioElement.pause();
                audioPlaying = false;
            }
            titleScreenLoop(now, oldTime);
        }
    } else {
        if (!audioPlaying) {
            audioElement.currentTime = 0;
            if (enterPressedInitially) {
                audioElement.play();
                document.removeEventListener('keypress', 
                    onInitialEnterPress);
            }
            audioPlaying = true;
        }
        
        context.font = "28px Luminari, fantasy";
        context.fillStyle = "rgb(255, 247, 227)";
        context.fillText(points + " Pts", 10, 50);
    }*/
	gameLoop(interval);
    previousFrameTime = now;
    frameCounter++;
    if (now - oldTime > 1000) {
        frameCounter = 0;
        oldTime = Date.now();
    }

}, interval * 1000);
