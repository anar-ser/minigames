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
		if (pressedKeys[controls.left.code]) this.addForce({ x: -1, y: 0 });
		if (pressedKeys[controls.right.code]) this.addForce({ x: 1, y: 0 });
		if ((pressedKeys[controls.up.code]) && this.onGround){
			this.addForce({ x: 0, y: -70 });
			this.onGround = false;
		}
		if (pressedKeys[controls.down.code]) this.addForce({ x: 0, y: 1 });
	}
}