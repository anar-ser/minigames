px = 0.15625

let blocks = [
	{
		source: 'assets/blocks/block_tile.png',
		border: 'assets/blocks/block_tile_border.png',
		x: 0,
		y: 0,
		width: 5,
		height: 320
	},
	{
		source: 'assets/blocks/block_tile.png',
		border: 'assets/blocks/block_tile_border.png',
		x: 0,
		y: 315,
		width: 320,
		height: 5
	},
	{
		source: 'assets/blocks/block_tile.png',
		border: 'assets/blocks/block_tile_border.png',
		x: 315,
		y: 0,
		width: 5,
		height: 320
	},
	{
		source: 'assets/blocks/grass_tile.png',
		border: 'assets/blocks/grass_tile_border.png',
		x: 128,
		y: 160,
		width: 64,
		height: 5
	},
	{
		source: 'assets/blocks/grass_tile.png',
		border: 'assets/blocks/grass_tile_border.png',
		x: 210,
		y: 160,
		width: 32,
		height: 5
	},
	{
		source: 'assets/blocks/grass_tile.png',
		border: 'assets/blocks/grass_tile_border.png',
		x: 100,
		y: 140,
		width: 32,
		height: 4
	}
	,
	{
		source: 'assets/blocks/grass_tile.png',
		border: 'assets/blocks/grass_tile_border.png',
		x: 132 + 2*px,
		y: 140,
		width: 40,
		height: px
	}
]

let decorations = [
	{
		source: 'assets/decorations/cave_background.png',
		x: 0,
		y: 161,
		z: -9,
		width: 320,
		height: 160
	}
]

blocks.forEach((block) => {
	const element = document.createElement('div');
	element.setAttribute('class', "block");
	element.setAttribute('style', "left: " + (block.x - 0.625) + "rem; top: " + (block.y - 0.625) + "rem; " +
					"width: " + block.width + "rem; height: " + block.height + "rem; " +
					"background-image: url('" + block.source + "'); " +
					"border-image: url('" + block.border + "') 4 round repeat; ");
	
	document.getElementById('blocks').insertAdjacentElement('beforeend', element);
});

decorations.forEach((decoration) => {
	const element = document.createElement('img');
	element.setAttribute('class', "decoration");
	element.setAttribute('src', decoration.source);
	element.setAttribute('style', "left: " + decoration.x + "rem; top: " + decoration.y + "rem; " +
					"width: " + decoration.width + "rem; height: " + decoration.height + "rem; " +
					"z-index: " + decoration.z + ";");
	
	document.getElementById('decorations').insertAdjacentElement('beforeend', element);
});
