// Game setup
document.addEventListener('DOMContentLoaded', function() {
    // Matter.js setup
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Body = Matter.Body,
          Events = Matter.Events,
          Composite = Matter.Composite;
    
    // Create engine
    const engine = Engine.create({
        gravity: { x: 0, y: 1 },
        enableSleeping: true
    });
    
    // Get canvas and context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Adjust canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = Math.min(container.clientWidth * 0.625, window.innerHeight * 0.7);
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Game state
    let selectedMaterial = 'sand';
    let brushSize = 15;
    let isDrawing = false;
    let isErasing = false;
    let particles = [];
    let bodies = [];
    let lastSpawnTime = 0;
    const spawnInterval = 50; // ms
    
    // Materials properties
    const materials = {
        sand: {
            color: '#e3a008',
            density: 0.7,
            friction: 0.3,
            restitution: 0.1,
            render: { fillStyle: '#e3a008' },
            isStatic: false,
            frictionAir: 0.01
        },
        water: {
            color: '#3b82f6',
            density: 0.5,
            friction: 0.1,
            restitution: 0.01,
            render: { fillStyle: '#3b82f6' },
            isStatic: false,
            frictionAir: 0.05
        },
        stone: {
            color: '#6b7280',
            density: 2.5,
            friction: 0.8,
            restitution: 0.2,
            render: { fillStyle: '#6b7280' },
            isStatic: true
        },
        wood: {
            color: '#92400e',
            density: 0.3,
            friction: 0.5,
            restitution: 0.4,
            render: { fillStyle: '#92400e' },
            isStatic: false,
            frictionAir: 0.02
        },
        lava: {
            color: '#dc2626',
            density: 1.2,
            friction: 0.2,
            restitution: 0.1,
            render: { fillStyle: '#dc2626' },
            isStatic: false,
            frictionAir: 0.01
        }
    };
    
    // Create boundary walls
    const wallOptions = { isStatic: true, render: { fillStyle: '#4a5568' } };
    const walls = [
        Bodies.rectangle(canvas.width / 2, canvas.height, canvas.width, 20, { ...wallOptions, chamfer: { radius: 10 } }), // bottom
        Bodies.rectangle(canvas.width / 2, 0, canvas.width, 20, wallOptions), // top
        Bodies.rectangle(0, canvas.height / 2, 20, canvas.height, wallOptions), // left
        Bodies.rectangle(canvas.width, canvas.height / 2, 20, canvas.height, wallOptions) // right
    ];
    
    World.add(engine.world, walls);
    
    // UI event listeners
    document.querySelectorAll('.material-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.material-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedMaterial = this.dataset.material;
        });
    });
    
    document.getElementById('brushSize').addEventListener('input', function() {
        brushSize = parseInt(this.value);
        document.getElementById('brushSizeValue').textContent = brushSize;
    });
    
    document.getElementById('gravitySlider').addEventListener('input', function() {
        const gravity = parseFloat(this.value);
        engine.gravity.y = gravity;
        document.getElementById('gravityValue').textContent = gravity.toFixed(1);
    });
    
    document.getElementById('clearBtn').addEventListener('click', function() {
        // Remove all bodies except walls
        Composite.allBodies(engine.world).forEach(body => {
            if (!walls.includes(body)) {
                World.remove(engine.world, body);
            }
        });
        bodies = [];
    });
    
    // Help modal
    const helpModal = document.getElementById('helpModal');
    document.getElementById('helpBtn').addEventListener('click', () => helpModal.classList.remove('hidden'));
    document.getElementById('closeHelp').addEventListener('click', () => helpModal.classList.add('hidden'));
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.add('hidden');
    });
    
    // Tooltip
    const tooltip = document.getElementById('tooltip');
    
    // Canvas interaction
    canvas.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // left click
            isDrawing = true;
            if (selectedMaterial === 'erase') {
                isErasing = true;
            } else {
                addMaterial(e.clientX, e.clientY);
            }
        } else if (e.button === 2) { // right click
            isErasing = true;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        // Update tooltip position
        const x = e.clientX;
        const y = e.clientY;
        
        tooltip.style.left = `0px`;
        tooltip.style.top = `0px`;
        
        // Show tooltip with coordinates
        tooltip.textContent = `X: ${Math.round(x)}, Y: ${Math.round(y)}`;
        tooltip.classList.add('show');
        
        // Drawing/erasing
        const now = Date.now();
        if ((isDrawing || isErasing) && now - lastSpawnTime > spawnInterval) {
            if (isErasing) {
                eraseAtPosition(x, y);
            } else {
                addMaterial(x, y);
            }
            lastSpawnTime = now;
        }
    });
    
    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        isErasing = false;
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
        isErasing = false;
        tooltip.classList.remove('show');
    });
    
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Mouse wheel for brush size
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const brushInput = document.getElementById('brushSize');
        let newSize = brushSize + (e.deltaY > 0 ? -5 : 5);
        newSize = Math.max(5, Math.min(50, newSize));
        brushSize = newSize;
        brushInput.value = newSize;
        document.getElementById('brushSizeValue').textContent = newSize;
    });
    
    // Add material at position
    function addMaterial(x, y) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        // Check if position is within canvas
        if (canvasX < 20 || canvasX > canvas.width - 20 || 
            canvasY < 20 || canvasY > canvas.height - 20) return;
        
        const material = materials[selectedMaterial];
        const size = brushSize;
        
        // Create a new body
        const body = Bodies.circle(canvasX, canvasY, size, {
            ...material,
            render: {
                ...material.render,
                strokeStyle: '#ffffff',
                lineWidth: 1
            },
            label: selectedMaterial
        });
        
        World.add(engine.world, body);
        bodies.push(body);
        
        // Add visual particle effect
        createParticles(canvasX, canvasY, material.color, size);
    }
    
    // Erase at position
    function eraseAtPosition(x, y) {
        const rect = canvas.getBoundingClientRect();
        const canvasX = x - rect.left;
        const canvasY = y - rect.top;
        
        // Find bodies within brush radius
        const bodiesToRemove = Composite.allBodies(engine.world).filter(body => {
            if (walls.includes(body)) return false;
            
            const distance = Math.sqrt(
                Math.pow(body.position.x - canvasX, 2) + 
                Math.pow(body.position.y - canvasY, 2)
            );
            
            return distance < body.circleRadius;
        });
        
        // Remove bodies
        bodiesToRemove.forEach(body => {
            World.remove(engine.world, body);
            bodies = bodies.filter(b => b !== body);
            
            // Add erase particles
            createParticles(body.position.x, body.position.y, '#ffffff', body.circleRadius*2, 10);
        });
    }
    
    // Create visual particles
    function createParticles(x, y, color, size, count = 5) {
        const rect = canvas.getBoundingClientRect();
        x += rect.left;
        y += rect.top;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = `${Math.random() * 4 + 2}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = color;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 2;
            const lifetime = Math.random() * 1000 + 500;
            
            document.body.appendChild(particle);
            
            let startTime = Date.now();
            
            function updateParticle() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / lifetime;
                
                if (progress >= 1) {
                    particle.remove();
                    return;
                }
                
                const currentX = x + Math.cos(angle) * velocity * elapsed * 0.05;
                const currentY = y + Math.sin(angle) * velocity * elapsed * 0.05 + (elapsed * 0.001 * engine.gravity.y * 100);
                
                particle.style.left = `${currentX}px`;
                particle.style.top = `${currentY}px`;
                particle.style.opacity = 1 - progress;
                
                requestAnimationFrame(updateParticle);
            }
            
            updateParticle();
        }
    }
    
    // Check for lava interactions
    function checkLavaInteractions(lavaBody) {
        const lavaPos = lavaBody.position;
        
        // Find nearby bodies
        const nearbyBodies = Composite.allBodies(engine.world).filter(body => {
            if (body === lavaBody || walls.includes(body)) return false;
            
            const distance = Math.sqrt(
                Math.pow(body.position.x - lavaPos.x, 2) + 
                Math.pow(body.position.y - lavaPos.y, 2)
            );
            
            return distance < body.circleRadius + lavaBody.circleRadius;
        });
        
        nearbyBodies.forEach(body => {
            // Lava turns water to stone
            if (body.label === 'water') {
                // Create stone at water position
                const stone = Bodies.circle(lavaBody.position.x, lavaBody.position.y, lavaBody.circleRadius, {
                    ...materials.stone,
                    render: {
                        ...materials.stone.render,
                        strokeStyle: '#ffffff',
                        lineWidth: 1
                    },
                    label: 'stone'
                });
                
                World.add(engine.world, stone);
                bodies.push(stone);
                
                // Remove the water
                World.remove(engine.world, body);
                bodies = bodies.filter(b => b !== body);
                
                // Remove the lava
                World.remove(engine.world, lavaBody);
                bodies = bodies.filter(b => b !== lavaBody);
                
                // Add steam effect
                createParticles(body.position.x, body.position.y, '#a5b4fc', body.circleRadius*2, 15);
            }
            
            // Lava burns wood
            if (body.label === 'wood') {
                // Create fire particles
                createParticles(body.position.x, body.position.y, '#f59e0b', body.circleRadius*2, 10);

                // Remove wood
                World.remove(engine.world, body);
                bodies = bodies.filter(b => b !== body);
            }
        });
    }
    
    // Check for wood interactions
    function checkWoodInteractions(woodBody) {
        const woodPos = woodBody.position;
        
        // Find nearby bodies
        const nearbyBodies = Composite.allBodies(engine.world).filter(body => {
            if (body === woodBody || walls.includes(body)) return false;
            
            const distance = Math.sqrt(
                Math.pow(body.position.x - woodPos.x, 2) + 
                Math.pow(body.position.y - woodPos.y, 2)
            );
            
            return distance < body.circleRadius + woodBody.circleRadius;
        });
        
        nearbyBodies.forEach(body => {
            // Wood floats on water
            if (body.label === 'water') {
                woodPos.y -= 0.1 * (engine.gravity.y);
            }
        });
    }
    
    // Game loop
    function gameLoop() {
        // Update physics
        Engine.update(engine, 1000 / 60);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw all bodies
        ctx.save();
        Composite.allBodies(engine.world).forEach(body => {
            if (body.render.visible === false) return;
            
            if (body.label === 'lava') {
                checkLavaInteractions(body);
            }
            
            if (body.label === 'wood') {
                checkWoodInteractions(body);
            }
            
            ctx.beginPath();
            
            if (body.circleRadius) {
                // Draw circle
                ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
            } else {
                // Draw polygon (for walls)
                ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
                for (let i = 1; i < body.vertices.length; i++) {
                    ctx.lineTo(body.vertices[i].x, body.vertices[i].y);
                }
                ctx.lineTo(body.vertices[0].x, body.vertices[0].y);
            }
            
            ctx.fillStyle = body.render.fillStyle;
            ctx.fill();
            
            if (body.render.strokeStyle) {
                ctx.strokeStyle = body.render.strokeStyle;
                ctx.lineWidth = body.render.lineWidth || 1;
                ctx.stroke();
            }
        });
        
        ctx.restore();
        
        // Draw brush preview
        if (isDrawing || isErasing) {
            const rect = canvas.getBoundingClientRect();
            const mouseX = lastMouseX - rect.left;
            const mouseY = lastMouseY - rect.top;
            
            if (mouseX > 0 && mouseX < canvas.width && mouseY > 0 && mouseY < canvas.height) {
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, brushSize, 0, Math.PI * 2);
                ctx.fillStyle = isErasing ? 'rgba(255, 0, 0, 0.2)' : `${materials[selectedMaterial].color}80`;
                ctx.fill();
                ctx.strokeStyle = isErasing ? 'red' : 'white';
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        requestAnimationFrame(gameLoop);
    }
    
    // Track last mouse position for brush preview
    let lastMouseX = 0;
    let lastMouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });
    
    // Start the game
    gameLoop();
});