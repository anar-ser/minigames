gravity = 1.2;
forceLimit = 10;

class Entity {
	constructor(name, element, position, mass, airResistance) {
		this.name = name;
		this.element = element;
		this.x = position.x;
		this.y = position.y;
		this.mass = mass;
		this.airResistance = airResistance;
		
		this.element.style.left = this.x;
		this.element.style.top  = this.y;
		
		this.force = { x: 0, y: 0 };
		this.speed = { x: 0, y: 0 };
	}
	
	addForce(force) {
		this.force.x += force.x;
		this.force.y += force.y;
	}
	
	physicsCalculate() {
		this.speed.x += this.force.x;
		this.speed.y += this.force.y;
		this.speed.y += gravity;
		
		const airForce = {
			x: Math.pow(this.speed.x, 2)/2 * this.airResistance / 100 + 0.01,
			y: Math.pow(this.speed.y, 2)/2 * this.airResistance / 100 + 0.01
		}

		this.speed.x = (Math.abs(this.speed.x) - airForce.x) * Math.sign(this.speed.x);
		this.speed.y = (Math.abs(this.speed.y) - airForce.y) * Math.sign(this.speed.y);
		
		this.x += this.speed.x;
		this.y += this.speed.y;
		
		this.element.style.left = this.x + 'px';
		this.element.style.top  = this.y + 'px';
		this.force = { x: 0, y: 0 };
	}
	
	raycast() {
		this.speed.x
		this.speed.y
		this.x
		this.y
	}
}