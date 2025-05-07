// Event listeners
var pressedKeys = {};
window.onkeyup   = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true;  }

const background = 	document.getElementById('game-map');
let footer = 		document.getElementById('footer');

let infoShadow = 	document.getElementById('info-shadow');
let infoWindow = { 
	element: 	document.getElementById('info-window'),
	title: 		document.getElementById('info-title'),
	content: 	document.getElementById('info-сontent'),
	redirect:	document.getElementById('redirect-button')
}

let player = document.getElementById('player');

const portals = [
    { 
        x: 20,
        y: 42,
		title: 'Wikipedia',
		content: '«Википедия» — это самая крупная и популярная в мире онлайн-энциклопедия. Её название происходит от двух слов: гавайского wiki («быстрый») и латинского encyclopedia («энциклопедия»).',
        destination: 'https://www.wikipedia.org'
    },
    { 
        x: 45,
        y: 42,
		title: 'GitHub',
		content: 'А',
        destination: 'https://www.github.com' 
    },
    { 
        x: 75,
        y: 32,
		title: 'Stack Overflow',
		content: 'А',
        destination: 'https://www.stackoverflow.com',
    },
    { 
        x: 60,
        y: 27,
		title: 'Reddit',
		content: 'А',
        destination: 'https://www.reddit.com'
    }
];

// Создание порталов
portals.forEach(function(part, index) {
	const element = document.createElement('img');
	element.setAttribute('class', "portal");
	element.setAttribute('src', "portal.gif");
	element.setAttribute('style', "left: " + this[index].x + "rem; top: " + this[index].y + "rem;");
	
	document.body.insertBefore(element, player);
	this[index].element = element;
}, portals);

let playerOffset = { left: 300, top: 300 };
let cameraOffset = { left: playerOffset.left - window.innerWidth/2 + player.offsetWidth/2,
					 top: playerOffset.top - window.innerHeight/2 + player.offsetHeight/2 };
window.scroll(cameraOffset);



let state = false;
function toggleState() {
	if (state) state = false
	else       state = true
	showInfo(state);
	setTimeout(() => {}, 2000);
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
	right: rect.right + window.scrollX,
    bottom: rect.bottom + window.scrollY
  };
}

let infoState = false;
function showInfo(show) {
	if (show) {
		infoShadow.classList.add('active');
		infoShadow.classList.remove('hidden');
		infoWindow.element.classList.add('active');
		infoWindow.element.classList.remove('hidden');
	} else {
		infoShadow.classList.remove('active');
		infoShadow.classList.add('hidden');
		infoWindow.element.classList.remove('active');
		infoWindow.element.classList.add('hidden');
	}
}

function cameraMove(x, y) {
	infoShadow.style.left = x - (infoShadow.offsetWidth - player.offsetWidth)/2 + 'px';
	infoShadow.style.top = y - (infoShadow.offsetHeight - player.offsetHeight)/2 + 'px';
	
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
	window.scroll(cameraOffset);
	
	infoWindow.element.style.left = window.pageXOffset + window.innerWidth/2 -
									infoWindow.element.offsetWidth/2 + 'px';
	infoWindow.element.style.top = 	window.pageYOffset + window.innerHeight/4 -
									infoWindow.element.offsetHeight/2 + 'px';
	footer.style.left = window.pageXOffset / (background.offsetWidth - window.innerWidth) *
						(background.offsetWidth - footer.offsetWidth) + 'px';
}

function checkPortalCollision() {
	let collision = false;
	portals.forEach(portal => {
		const offset = getOffset(portal.element);
        if (
            playerOffset.left < offset.right &&
            playerOffset.left + player.offsetWidth > offset.left &&
            playerOffset.top < offset.bottom &&
            playerOffset.top + player.offsetHeight > offset.top
        ) { 
			infoWindow.title.innerHTML = portal.title;
			infoWindow.content.innerHTML = portal.content;
			infoWindow.redirect.setAttribute('href', portal.destination);
			collision = true;
		}
    });
	showInfo(collision);
};

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
	if (pressedKeys[13]) {
		toggleState();
	}
	
	player.style.top = playerOffset.top + 'px';
	player.style.left = playerOffset.left + 'px';
	cameraMove(playerOffset.left, playerOffset.top);

	checkPortalCollision();
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
