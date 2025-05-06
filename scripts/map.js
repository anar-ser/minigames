let blocks = [
	{
		source: '',
		x: 0,
		y: 0,
		width: 4,
		height: 320
	},
	{
		source: '',
		x: 0,
		y: 316,
		width: 320,
		height: 4
	},
	{
		source: '',
		x: 316,
		y: 0,
		width: 4,
		height: 320
	},
	{
		source: '',
		x: 128,
		y: 160,
		width: 64,
		height: 4
	},
	{
		source: '',
		x: 210,
		y: 160,
		width: 32,
		height: 4
	},
	{
		source: '',
		x: 100,
		y: 140,
		width: 32,
		height: 4
	}
]

blocks.forEach((block) => {
	const element = document.createElement('img');
	element.setAttribute('class', "block");
	element.setAttribute('src', block.source);
	element.setAttribute('style', "left: " + block.x + "rem; top: " + block.y + "rem; " +
					"width: " + block.width + "rem; height: " + block.height + "rem;");
	
	document.getElementById('blocks').insertAdjacentElement('beforeend', element);
});
