class Player extends Entity {
	controls() {
		if (pressedKeys[65]) this.addForce({ x: -1, y: 0 });
		if (pressedKeys[68]) this.addForce({ x: 1, y: 0 });
		if (pressedKeys[87]) this.addForce({ x: 0, y: -10 });
		if (pressedKeys[83]) this.addForce({ x: 0, y: 1 });
	}
}