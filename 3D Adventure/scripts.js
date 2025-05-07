// Game variables
let score = 0;
let timeLeft = 60;
let gameActive = true;
let timer;

// Three.js variables
let scene, camera, renderer, player, coins = [], obstacles = [];
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
const playerSpeed = 0.1;

// Initialize the game
init();
animate();
startTimer();

function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3a5f0b,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    
    // Create player
    const playerGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 32);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 0.5;
    scene.add(player);
    
    // Create coins
    createCoins(10);
    
    // Create obstacles
    createObstacles(5);
    
    // Add event listeners
    window.addEventListener('resize', onWindowResize);
    
    // Touch controls
    document.getElementById('up-btn').addEventListener('touchstart', () => moveForward = true);
    document.getElementById('up-btn').addEventListener('touchend', () => moveForward = false);
    document.getElementById('down-btn').addEventListener('touchstart', () => moveBackward = true);
    document.getElementById('down-btn').addEventListener('touchend', () => moveBackward = false);
    document.getElementById('left-btn').addEventListener('touchstart', () => moveLeft = true);
    document.getElementById('left-btn').addEventListener('touchend', () => moveLeft = false);
    document.getElementById('right-btn').addEventListener('touchstart', () => moveRight = true);
    document.getElementById('right-btn').addEventListener('touchend', () => moveRight = false);
    
    // Keyboard controls
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    // Restart button
    document.getElementById('restart-btn').addEventListener('click', restartGame);
}

function createCoins(count) {
    for (let i = 0; i < count; i++) {
        const coinGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
        const coinMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            metalness: 0.9,
            roughness: 0.2
        });
        const coin = new THREE.Mesh(coinGeometry, coinMaterial);
        coin.rotation.x = Math.PI / 2;
        
        // Position coin randomly
        coin.position.x = (Math.random() - 0.5) * 18;
        coin.position.z = (Math.random() - 0.5) * 18;
        coin.position.y = 0.5;
        
        scene.add(coin);
        coins.push(coin);
    }
}

function createObstacles(count) {
    for (let i = 0; i < count; i++) {
        const size = 0.5 + Math.random() * 1.5;
        const obstacleGeometry = new THREE.CylinderGeometry(size/2, size/2, size, 32);
        const obstacleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        
        // Position obstacle randomly
        obstacle.position.x = (Math.random() - 0.5) * 18;
        obstacle.position.z = (Math.random() - 0.5) * 18;
        obstacle.position.y = size / 2;
        
        scene.add(obstacle);
        obstacles.push(obstacle);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            moveForward = true;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            moveBackward = true;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveLeft = true;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            moveRight = true;
            break;
    }
}

function onKeyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            moveForward = false;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            moveBackward = false;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moveLeft = false;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            moveRight = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    if (!gameActive) return;
    
    // Move player
    if (moveForward) player.position.z -= playerSpeed;
    if (moveBackward) player.position.z += playerSpeed;
    if (moveLeft) player.position.x -= playerSpeed;
    if (moveRight) player.position.x += playerSpeed;
    
    // Keep player within bounds
    player.position.x = Math.max(-9.5, Math.min(9.5, player.position.x));
    player.position.z = Math.max(-9.5, Math.min(9.5, player.position.z));
    
    // Rotate coins
    coins.forEach(coin => {
        coin.rotation.z += 0.05;
    });
    
    // Check coin collisions
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        const distance = player.position.distanceTo(coin.position);
        
        if (distance < 0.8) {
            scene.remove(coin);
            coins.splice(i, 1);
            score++;
            document.getElementById('coin-count').textContent = score;
            
            // Create new coin if all are collected
            if (coins.length === 0) {
                createCoins(5);
            }
        }
    }
    
    // Check obstacle collisions
    for (let obstacle of obstacles) {
        const distance = player.position.distanceTo(obstacle.position);
		const size = obstacle.position.y + 0.25
        if (distance < size) {
            // Bounce back
            if (moveForward) player.position.z += playerSpeed * 20 * (size - distance);
            if (moveBackward) player.position.z -= playerSpeed * 20 * (size - distance);
            if (moveLeft) player.position.x += playerSpeed * 20 * (size - distance);
            if (moveRight) player.position.x -= playerSpeed * 20 * (size - distance);
        }
    }
    
    // Update camera position to follow player
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 5;
    camera.lookAt(player.position.x, player.position.y, player.position.z);
    
    renderer.render(scene, camera);
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-count').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    document.getElementById('final-score').textContent = `You collected ${score} coins!`;
    document.getElementById('game-over').style.display = 'flex';
}

function restartGame() {
    // Reset game state
    score = 0;
    timeLeft = 60;
    gameActive = true;
    
    // Reset UI
    document.getElementById('coin-count').textContent = '0';
    document.getElementById('time-count').textContent = '60';
    document.getElementById('game-over').style.display = 'none';
    
    // Reset player position
    player.position.set(0, 0.5, 0);
    
    // Remove all coins
    coins.forEach(coin => scene.remove(coin));
    coins = [];
    
    // Remove all obstacles
    obstacles.forEach(obstacle => scene.remove(obstacle));
    obstacles = [];
    
    // Create new coins and obstacles
    createCoins(10);
    createObstacles(5);
    
    // Restart timer
    startTimer();
}
