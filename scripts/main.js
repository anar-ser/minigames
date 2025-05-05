// Event listeners
var pressedKeys = {};
window.onkeyup   = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true;  }
function buttonUp(e)   		   { pressedKeys[e] = false; }
function buttonDown(e) 		   { pressedKeys[e] = true;  }
window.onresize = setViewportProperty;

const movementButtons = document.getElementById('movement-buttons');

const gameField = document.getElementById('game-field');
const background = 	document.getElementById('game-map');
let footer = 		document.getElementById('footer');

let infoShadow = 	document.getElementById('info-shadow');
let infoWindow = { 
	element: 	document.getElementById('info-window'),
	title: 		document.getElementById('info-title'),
	content: 	document.getElementById('info-сontent'),
	redirect:	document.getElementById('redirect-button')
}

let player = new Player(
	'Player',
	document.getElementById('player'),
	{ x: 2240, y: 2240 },
	10,
	0.45
)

const portals = [
    { 
        x: 20,
        y: 42,
		hueDegree: 150,
		title: 'Wikipedia',
		content: '«Википедия» — это самая крупная и популярная в мире онлайн-энциклопедия. Её название происходит от двух слов: гавайского wiki («быстрый») и латинского encyclopedia («энциклопедия»).',
        destination: 'https://www.wikipedia.org'
    },
    { 
        x: 45,
        y: 42,
		hueDegree: 90,
		title: 'GitHub',
		content: 'GitHub — крупнейший веб-сервис для хостинга IT-проектов и их совместной разработки. Веб-сервис основан на системе контроля версий Git и разработан на Ruby on Rails и Erlang компанией GitHub, Inc.',
        destination: 'https://www.github.com' 
    },
    { 
        x: 75,
        y: 32,
		hueDegree: 330,
		title: 'Stack Overflow',
		content: 'Stack Overflow — система вопросов и ответов о программировании, разработанная Джоэлем Спольски и Джеффом Этвудом в 2008 году. Является частью Stack Exchange. Как и в других системах подобного рода, Stack Overflow предоставляет возможность оценивать вопросы и ответы, что поднимает или понижает репутацию зарегистрированных пользователей.',
        destination: 'https://www.stackoverflow.com',
    },
    { 
        x: 60,
        y: 27,
		hueDegree: 330,
		title: 'Reddit',
		content: 'Reddit — сайт, сочетающий черты социальной сети и форума, на котором зарегистрированные пользователи могут размещать ссылки на какую-либо понравившуюся информацию в интернете и обсуждать её.',
        destination: 'https://www.reddit.com'
    }
];

// Создание порталов
portals.forEach(function(part, index) {
	const element = document.createElement('img');
	element.setAttribute('class', "portal");
	element.setAttribute('src', "assets/portal.gif");
	element.setAttribute('style', "left: " + this[index].x + "rem; top: " + this[index].y + "rem;" +
	"filter: invert(11%) sepia(100%) saturate(551%) hue-rotate(" + this[index].hueDegree + "deg);");
	
	document.getElementById('game-field').insertBefore(element, player.element);
	this[index].element = element;
}, portals);


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
  return {
    left: rect.left + window.scrollX - gameField.offsetLeft,
    top: rect.top + window.scrollY - gameField.offsetTop,
	right: rect.right + window.scrollX - gameField.offsetLeft,
    bottom: rect.bottom + window.scrollY - gameField.offsetTop
  };
}

let infoState = false;
function showInfo(show) {
	if (show) {
		infoShadow.classList.add('active');
		infoShadow.classList.remove('hidden');
		infoWindow.element.classList.add('active');
		infoWindow.element.classList.remove('hidden');
		infoState = true;
	} else {
		infoShadow.classList.remove('active');
		infoShadow.classList.add('hidden');
		infoWindow.element.classList.remove('active');
		infoWindow.element.classList.add('hidden');
		infoState = false;
	}
}


function cameraMove(x, y) {
	infoShadow.style.left = x - (infoShadow.offsetWidth - player.element.offsetWidth)/2 + 'px';
	infoShadow.style.top = y - (infoShadow.offsetHeight - player.element.offsetHeight)/2 + 'px';
	
	border = 4
	x -= (window.innerWidth - player.element.offsetWidth)/2;
	y -= (window.innerHeight - player.element.offsetHeight)/2;
	speedX = (window.pageXOffset - x) / window.innerWidth * 32;
	speedY = (window.pageYOffset - y) / window.innerHeight * 32;
	if ( Math.abs(speedX) > border ) {
		cameraOffset.left = window.pageXOffset - Math.sign(speedX) * (Math.abs(speedX)-border);
	}
	if ( Math.abs(speedY) > border ) {
		cameraOffset.top = window.pageYOffset - Math.sign(speedY) * (Math.abs(speedY)-border);
	}
	window.scroll(cameraOffset);

	footer.style.left = window.pageXOffset / (background.offsetWidth - window.innerWidth) *
						(background.offsetWidth - footer.offsetWidth) + 'px';
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
