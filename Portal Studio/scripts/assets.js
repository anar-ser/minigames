const assetsWindow = document.getElementById('assets');

function addDirectoryAssets() {
	const element = document.createElement('div');
	element.setAttribute('class', 'content');
	
	const name = document.createElement('button');
	name.setAttribute('class', 'content directory');
	name.innerHTML = 'Directory';
	
	element.insertAdjacentElement('beforeend', name);
	assetsWindow.insertAdjacentElement('beforeend', element);
}

function addFileAssets() {
	const element = document.createElement('button');
	element.setAttribute('class', 'content active');
	element.innerHTML = 'File';
	
	assetsWindow.insertAdjacentElement('beforeend', element);
}