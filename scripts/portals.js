const portals = [
    { 
        x: 100,
        y: 128,
		hueDegree: 150,
		title: '2D Physics Sandbox',
		content: '«Википедия» — это самая крупная и популярная в мире онлайн-энциклопедия. Её название происходит от двух слов: гавайского wiki («быстрый») и латинского encyclopedia («энциклопедия»).',
        destination: '2d-physics-sandbox/'
    },
    { 
        x: 128,
        y: 148,
		hueDegree: 90,
		title: '2D Platformer Game',
		content: 'GitHub — крупнейший веб-сервис для хостинга IT-проектов и их совместной разработки. Веб-сервис основан на системе контроля версий Git и разработан на Ruby on Rails и Erlang компанией GitHub, Inc.',
        destination: '2d-platformer-game/' 
    },
    { 
        x: 182,
        y: 148,
		hueDegree: 330,
		title: '3D Adventure',
		content: 'Stack Overflow — система вопросов и ответов о программировании, разработанная Джоэлем Спольски и Джеффом Этвудом в 2008 году. Является частью Stack Exchange. Как и в других системах подобного рода, Stack Overflow предоставляет возможность оценивать вопросы и ответы, что поднимает или понижает репутацию зарегистрированных пользователей.',
        destination: '3d-adventure/',
    },
    { 
        x: 232,
        y: 148,
		hueDegree: 330,
		title: 'Voxel Adventure',
		content: 'Reddit — сайт, сочетающий черты социальной сети и форума, на котором зарегистрированные пользователи могут размещать ссылки на какую-либо понравившуюся информацию в интернете и обсуждать её.',
        destination: 'voxel-adventure/'
    }
];

// Creating portals
portals.forEach(function(part, index) {
	const element = document.createElement('img');
	element.setAttribute('class', "portal");
	element.setAttribute('src', "assets/portal.gif");
	element.setAttribute('style', "left: " + this[index].x + "rem; top: " + this[index].y + "rem;" +
	"filter: invert(11%) sepia(100%) saturate(551%) hue-rotate(" + this[index].hueDegree + "deg);");
	
	document.getElementById('portals').insertAdjacentElement('beforeend', element);
	this[index].element = element;
}, portals);
