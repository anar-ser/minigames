class Player extends Entity {
	constructor() {
		super(
			'Player',
			document.getElementById('player'),
			{ x: 157.5, y: 155 },
			10,
			0.45,
			{
				top: document.getElementById('player-up'),
				bottom: document.getElementById('player-down'),
				left: document.getElementById('player-left'),
				right: document.getElementById('player-right')
			}
		);
	}
	
	controls() {
		if (pressedKeys[65]) this.addForce({ x: -1, y: 0 });
		if (pressedKeys[68]) this.addForce({ x: 1, y: 0 });
		if ((pressedKeys[32] || pressedKeys[87]) && this.onGround){this.addForce({ x: 0, y: -70 });
			this.onGround = false;}
		if (pressedKeys[83]) this.addForce({ x: 0, y: 1 });
	}
}