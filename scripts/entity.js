gravity = 1.2;
forceLimit = 10;

fontSize = parseFloat(window.getComputedStyle(document.getElementsByTagName('html')[0]).fontSize);

blocks = document.getElementsByClassName('block');

class Entity {
	constructor(name, element, position, mass, airResistance) {
		this.name = name;
		this.element = element;
		this.x = position.x * fontSize;
		this.y = position.y * fontSize;
		this.mass = mass;
		this.airResistance = airResistance;
		
		const rect = this.element.getBoundingClientRect();
		this.width = rect.width;
		this.height = rect.height;
		
		this.force = { x: 0, y: 0 };
		this.speed = { x: 0, y: 0 };
		this.onGround = false;
	}
	
	addForce(force) {
		this.force.x += force.x;
		this.force.y += force.y;
	}
	
	physicsCalculate() {
		this.speed.x += this.force.x / this.mass * 10;
		this.speed.y += this.force.y / this.mass * 10;
		this.speed.y += gravity;
		
		const airForce = {
			x: Math.pow(this.speed.x, 2)/2 * this.airResistance /this.mass / 10 + 0.01,
			y: Math.pow(this.speed.y, 2)/2 * this.airResistance / this.mass / 10 + 0.01
		}
		const friction = (this.onGround && this.force.x == 0)? Math.pow(this.speed.x, 2) / this.mass / 2.5 + 0.5 : 0 ;

		this.speed.x = (Math.abs(this.speed.x) - airForce.x - friction) * Math.sign(this.speed.x);
		this.speed.y = (Math.abs(this.speed.y) - airForce.y) * Math.sign(this.speed.y);
		if (0.1 > this.speed.x && this.speed.x > -0.1) this.speed.x = 0;
		if (0.1 > this.speed.y && this.speed.y > -0.1) this.speed.y = 0;
		
		this.checkCollision();
		this.x += this.speed.x;
		this.y += this.speed.y;
		
		this.element.style.left = this.x + 'px';
		this.element.style.top  = this.y + 'px';
		this.force = { x: 0, y: 0 };
	}
	
	checkCollision() {
		this.onGround = false
		for (let i=0; i < blocks.length; i++) {
			const block = getOffset(blocks[i])
			if (block.right > this.x + this.speed.x &&				
				block.bottom > this.y + this.speed.y &&
				block.left < this.x + this.speed.x + this.width &&
				block.top < this.y + this.speed.y + this.height){
				
				const distance = {
					top: block.top - this.y - this.height,
					bottom: this.y - block.bottom,
					left: block.left - this.x - this.width,
					right: this.x - block.right
				}
				const closeDistance = Math.min(
					Math.abs(distance.top),
					Math.abs(distance.bottom),
					Math.abs(distance.left),
					Math.abs(distance.right)
				);
				if (closeDistance == Math.abs(distance.top))   {this.speed.y = distance.top;
					this.onGround = true;}
				if (closeDistance == Math.abs(distance.bottom)) this.speed.y = -distance.bottom;
				if (closeDistance == Math.abs(distance.left))	this.speed.x = distance.left;
				if (closeDistance == Math.abs(distance.right))  this.speed.x = -distance.right;
			}
		}
	}

	
	raycast() {
		this.speed.x
		this.speed.y
		this.x
		this.y
	}
}