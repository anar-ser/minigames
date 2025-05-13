// Event listeners
var pressedKeys = {};
window.onkeyup   = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true;  }
function buttonUp(e)   		   { pressedKeys[e] = false; }
function buttonDown(e) 		   { pressedKeys[e] = true;  }
window.onresize = setViewportProperty;

const movementButtons = document.getElementById('movement-buttons');

const gameField = document.getElementById('game-field');
let footer = 	  document.getElementById('footer');

let menu = {
	element: document.getElementById('menu'),
	controls: {
		left: document.getElementById('controls-left'),
		right: document.getElementById('controls-right'),
		up: document.getElementById('controls-up'),
		down: document.getElementById('controls-down')
	}
}

let infoShadow =  document.getElementById('info-shadow');
let infoWindow = { 
	element: 	document.getElementById('info-window'),
	title: 		document.getElementById('info-title'),
	content: 	document.getElementById('info-сontent'),
	redirect:	document.getElementById('redirect-button')
}


if (!localStorage.left) {
	localStorage.left = JSON.stringify({
		key: 'keyA',
		code: 65
	})
}
if (!localStorage.right) {
	localStorage.right = JSON.stringify({
		key: 'keyD',
		code: 68
	})
}
if (!localStorage.up) {
	localStorage.up = JSON.stringify({
		key: 'keyW',
		code: 87
	})
}
if (!localStorage.down) {
	localStorage.down = JSON.stringify({
		key: 'keyS',
		code: 83
	})
}

let controls = {
	left: JSON.parse(localStorage.left),
	right: JSON.parse(localStorage.right),
	up: JSON.parse(localStorage.up),
	down: JSON.parse(localStorage.down)
}

let player = new Player();

let cameraOffset = { left: player.x - window.innerWidth/2 + player.element.offsetWidth/2,
					 top: player.y - window.innerHeight/2 + player.element.offsetHeight/2 };
window.scroll(cameraOffset);

if (navigator.userAgentData.mobile) movementButtons.classList.remove('hidden');

// Функция устанавливает динамическую высоту видимой области
function setViewportProperty() {
  const vh = window.innerHeight * 0.01;
  const vw = window.innerWidth * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--vw', `${vw}px`);
}

let state = false;
function toggleState() {
	if (state) state = false
	else       state = true
	setTimeout(() => {}, 2000);
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  const border = parseFloat(getComputedStyle(el,null).getPropertyValue('border-width'));
  
  return {
    left: rect.left + window.scrollX - gameField.offsetLeft + border,
    top: rect.top + window.scrollY - gameField.offsetTop + border,
	right: rect.right + window.scrollX - gameField.offsetLeft - border,
    bottom: rect.bottom + window.scrollY - gameField.offsetTop - border
  };
}

function showMenu(show) {
	if (show){
		infoShadow.classList.add('hidden_menu');
		infoWindow.element.classList.add('hidden_menu');
		menu.element.classList.remove('hidden');
		document.getElementById('menu-button').classList.add('hidden_menu');
		
		menu.controls.left.innerHTML = controls.left.key;
		menu.controls.right.innerHTML = controls.right.key;
		menu.controls.up.innerHTML = controls.up.key;
		menu.controls.down.innerHTML = controls.down.key;
	} else {
		infoShadow.classList.remove('hidden_menu');
		infoWindow.element.classList.remove('hidden_menu');
		menu.element.classList.add('hidden');
		document.getElementById('menu-button').classList.remove('hidden_menu');
	}
}

async function changeControl(key) {
	document.getElementById('controls-info').classList.remove('hidden');
	controls[key] = await waitingKeypress();
	localStorage[key] = JSON.stringify(controls[key]);
	menu.controls[key].innerHTML = controls[key].key;
	menu.controls[key].blur();
	document.getElementById('controls-info').classList.add('hidden');
}

function waitingKeypress() {
	return new Promise((resolve) => {
		document.addEventListener('keydown', onKeyHandler);
		function onKeyHandler(e) {
			resolve({
				key: e.code,
				code: e.keyCode
			});
		}
	});
}

let infoState = false;
function showInfo(show) {
	if (show) {
		infoShadow.classList.remove('hidden');
		infoWindow.element.classList.remove('hidden');
		infoState = true;
	} else {
		infoShadow.classList.add('hidden');
		infoWindow.element.classList.add('hidden');
		infoState = false;
	}
}


function cameraMove(x, y) {
	infoShadow.style.left = x - (infoShadow.offsetWidth - player.element.offsetWidth)/2 + 'px';
	infoShadow.style.top = y - (infoShadow.offsetHeight - player.element.offsetHeight)/2 + 'px';
	
	border = 10
	force = 6
	x -= (window.innerWidth - player.element.offsetWidth)/2;
	y -= (window.innerHeight - player.element.offsetHeight)/2;
	speedX = (window.pageXOffset - x) / window.innerWidth * 16 * force;
	speedY = (window.pageYOffset - y) / window.innerHeight * 16 * force;
	if ( Math.abs(speedX) > border ) {
		cameraOffset.left = window.pageXOffset - Math.sign(speedX) * (Math.abs(speedX)-border);
	}
	if ( Math.abs(speedY) > border ) {
		cameraOffset.top = window.pageYOffset - Math.sign(speedY) * (Math.abs(speedY)-border);
	}
	window.scroll(cameraOffset);

	footer.style.left = window.pageXOffset / (gameField.offsetWidth - window.innerWidth) *
						(gameField.offsetWidth - footer.offsetWidth) + 'px';
}

function checkPortalCollision(x, y) {
	let collision = false;
	portals.forEach(portal => {
		const offset = getOffset(portal.element);
        if (
            x < offset.right &&
            x + player.element.offsetWidth > offset.left &&
            y < offset.bottom &&
            y + player.element.offsetHeight > offset.top
        ) { 
			if (!infoState || infoWindow.title.innerHTML != portal.title) {
				infoWindow.title.innerHTML = portal.title;
				infoWindow.content.innerHTML = portal.content;
				infoWindow.redirect.setAttribute('href', portal.destination);
			}
			collision = true;
		}
    });
	showInfo(collision);
};

// Main Game Loop
var gameLoop = function(interval) {
	
	player.controls();
	player.physicsCalculate();
	
	checkPortalCollision(player.x, player.y);	
	cameraMove(player.x, player.y);
}

// Set FPS
let FPS = 60;
let interval = 1 / FPS;
let frameCounter = 0;
let oldTime = Date.now();
let previousFrameTime = oldTime;
// Initialization
setViewportProperty();

// Game States
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
