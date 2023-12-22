/**************************************
* -------- Deadly Duel--------
*       December 23, 2023
* 
* Designed by Maximillian Aurelius
* Programmed by B. Tobias Wahyudi (drunk, overnight)
**************************************/

/**************************************
* Global State
*
* Trying to maintain a unidirectional data loop:
* State -> View -> State-Updaters (Controllers) -> State
**************************************/
const gameState = {
	// main menu
	screen: 'menu',
	menu: {
		state: null,
	},
	// options
	options: {
		magicBattle: false,
		visibleHp: false,
	}
	// peerjs
	peerjs: {
		peer: null,
		connId: null,
		conn: null,
		lastMessageTimestamp: null,
	},
	// running game
	game: {
		state: 'enter-name',
		myName: null,
		oppName: null,
		myMove: null,
		oppMove: null,
		myHp: 10,
		myEnergy: 10,
		animationStartTimestamp: null,
	}
}

gameState.peerjs.peer = new Peer();

const hitMatrix = [
	[0, 0, 0, 0, 0, 0, 0, 0, 0], 
	[2, 0, 0, 0, 0, 0, 0, 0, 0], 
	[4, 1, 0, 0, 0, 0, 0, 0, 0], 
	[6, 1, 1, 0, 0, 0, 0, 0, 0], 
	[0, 3, 2, 1, 1, 0, 0, 0, 0], 
	[0, 4, 3, 2, 1, 1, 0, 0, 0], 
	[0, 5, 4, 3, 2, 1, 2, 0, 0], 
	[0, 6, 5, 4, 3, 2, 1, 2, 0], 
	[0, 7, 6, 5, 4, 3, 2, 1, 3]
]

/*********************************************
* Game Control 
*********************************************/
// Shortcut for brevity
function nextData(cb) {
	gameState.peerjs.conn.on('data', cb);
}

// Register Name
function sendName(name) {
	gameState.game.myName = name;
	gameState.peerjs.conn.send(name);
	if(gameState.game.oppName) {
		startDuel();
	} else {
		gameState.game.state = 'waiting-name';
	}
}

function receiveOppName(name) {
	gameState.game.oppName = name;
	if(gameState.game.myName) {
		startMove();
	}
}

// Duel
function startMove() {
	gameState.game.state = 'make-move';
	nextData(receiveMove);
}

function sendMove(move) {
	gameState.game.myMove = move;
	gameState.peerjs.conn.send(move);
	if(gameState.game.oppMove) {
		computeMove();
	} else {
		gameState.game.state = 'waiting-move';
	}
}

function receiveOppMove(move) {
	gameState.game.oppMove = move;
	if(move == "I lost") {
		duelOver();
	}
	if(gameState.game.myMove) {
		computeMove();
	}
}

function computeMove() {
	const dmgReceived = hitMatrix[oppMove][myMove];
	const energyCost = myMove;

	gameState.game.hp -= dmgReceived;
	gameState.game.energy -= myMove;

	if(gameState.game.hp <= 0) {
		gameState.peerjs.conn.send("I lost");
		return;
	}

	gameState.game.state = 'move-animation';
	gameState.game.animationStartTimestamp = new Date().getTime();
	requestAnimationFrame(animateMove);
}

function animateMove() {
	// do stuff here idk
	if(new Date().getTime() - gameState.game.animationStartTimestamp > 1000) {
		startMove();
	} else {
		requestAnimationFrame(animateMove);
	}
}

function duelOver() {
	gameState.game.state = 'game-over';
	
	if(gameState.game.oppMove == "I lost") {
		if(gameState.game.hp <= 0
}

/*********************************************
* Menu Selection / Pre-Connect Functions
*********************************************/
function menuSelectHost() {
	gameState.menu.state = "host";
	updateDisplay();
}

function menuSelectConnect() {
	gameState.menu.state = "connect";
	updateDisplay();
}

function menuConnectingBack() {
	gameState.menu.state = null;
	// reset listeners
	gameState.peerjs.peer = new Peer();
	updateDisplay();
}

function menuConnectingHost() {
	const selfId = document.getElementById('connection-phrase-host').value;
	if(selfId.length < 16) {
		document.getElementById('phrase-error').innerText = 'please forge a phrase at least 16 characters in length';
		return;
	} else {
		document.getElementById('phrase-error').innerText = '';
	}
	gameState.peerjs.selfId = selfId;
	gameState.peerjs.peer.id = selfId;
	
	gameState.peerjs.peer.on('connection', (conn) => {
		gameState.peerjs.conn = conn;
		gameState.peerjs.lastMessageTimestamp = new Date().getTime();
		gameState.screen = 'game';
	});
}

function menuConnectingConnect() {
	const oppId = document.getElementById('connection-phrase-connect').value;
	gameState.peerjs.conn = gameState.peerjs.peer.connect(oppId);

	gameState.peerjs.conn.on('open', () => {
		gameState.peerjs.lastMessageTimestamp = new Date().getTime();
		gameState.screen = 'game';
	});
}

/**************************************
* View
**************************************/
function updateDisplay() {
	if(gameState.screen == 'menu') {
		document.getElementById('main-menu').style.display = 'none';
	} else if(gameState.screen == 'game') {
		document.getElementById('main-menu').style.display = 'unset';
		// Menu section
		if(gameState.menu.state == "host") {
			// Host game
			document.getElementById('menu-select').style.display = 'none';
			document.getElementById('menu-host').style.display = 'unset';
			document.getElementById('menu-host-waiting').style.display = 'none';
			document.getElementById('menu-connect').style.display = 'none';
		} else if(gameState.menu.state == "host-waiting") {
			// Host game
			document.getElementById('menu-select').style.display = 'none';
			document.getElementById('menu-host').style.display = 'none';
			document.getElementById('menu-host-waiting').style.display = 'unset';
			document.getElementById('menu-connect').style.display = 'none';
		} else if(gameState.menu.state == "connect") {
			// Connect to game
			document.getElementById('menu-select').style.display = 'none';
			document.getElementById('menu-host').style.display = 'none';
			document.getElementById('menu-host-waiting').style.display = 'none';
			document.getElementById('menu-connect').style.display = 'unset';
		} else {
			// Selection screen
			document.getElementById('menu-select').style.display = 'unset';
			document.getElementById('menu-host').style.display = 'none';
			document.getElementById('menu-host-waiting').style.display = 'none';
			document.getElementById('menu-connect').style.display = 'none';
		}
	} else if(gameState.screen == 'game-over') {
		
	}
}
