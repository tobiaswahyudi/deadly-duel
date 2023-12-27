/**************************************
* -------- Deadly Duel--------
*       December 23, 2023
* 
* Designed by Maximillian Aurelius
* Written by B. Tobias Wahyudi
**************************************/

/**************************************
* View
**************************************/

function findWithId(collection, id) {
	return collection.find(child => child.id == id);
}

function updateDisplay() {
	const pages = [...document.getElementsByTagName('page')];
	pages.forEach(page => page.style.display = 'none');
	const currentPage = findWithId(pages, gameState.screen);
	currentPage.style.display = 'unset';

	if(gameState.screen == 'game') {
		// Game page
		const sections = [...currentPage.getElementsByTagName('section')];
		sections.forEach(sec => sec.style.display = 'none');
		const currentSection = findWithId(sections, gameState.game.state);
		currentSection.style.display = 'unset';
		
		if(gameState.game.state == 'game-over') {

			const outcome = document.getElementById('duel-outcome');

			if(gameState.game.oppMove == "I lost") {
				if(gameState.game.hp <= 0) {
					// Tied
					outcome.innerText = "The duel ended in a tie... you are both dead.";
				} else {
					// Win
					outcome.innerText = "The duel ended in your victory! Your pathetic opponent is defeated.";
				}
			} else {
				// Lost
				outcome.innerText = "The duel ended in your defeat. Your corpse looks sad.";
			}			
		} else {
			const moveOptions = [...document.getElementById('move-options').children]
			moveOptions.forEach((opt, idx) => {
				if(idx > gameState.game.myEnergy) opt.disabled = 'true';
			});
		}
		document.getElementById('my-name').innerText = gameState.game.myName || "\u00A0";
		document.getElementById('my-name-display').innerText = gameState.game.myName || "\u00A0";
		document.getElementById('opp-name').innerText = gameState.game.oppName || "\u00A0";	
		document.getElementById('my-move-display').innerText = gameState.game.myMove;
		document.getElementById('my-hp').style.width = `${gameState.game.myHp}0%`;
		document.getElementById('my-hp-label').innerText = `${gameState.game.myHp}/10`;
		document.getElementById('my-energy').style.width = `${gameState.game.myEnergy}0%`;
		document.getElementById('my-energy-label').innerText = `${gameState.game.myEnergy}/10`;
	} else if(gameState.screen == 'menu') {
		// Menu page
		const sections = [...currentPage.getElementsByTagName('section')];
		sections.forEach(sec => sec.style.display = 'none');
		console.log(gameState.menu.state);
		const currentSection = findWithId(sections, gameState.menu.state);
		currentSection.style.display = 'unset';
		if(gameState.menu.state == 'menu-host-waiting') {
			findWithId([...currentSection.children], 'connection-phrase-display').innerText = gameState.peerjs.selfId;
		}
	} else if(gameState.screen == 'game-over') {
		
	}
}
/*********************************************
* Game Control 
*********************************************/
// Shortcut for brevity
function nextData(cb, once = false) {
	gameState.peerjs.conn.on('data', data => {
		console.log("pjs data", cb, data);
		cb(data);
	});
	gameState.peerjs.conn._events.data.once = once;
	console.log(gameState.peerjs.conn._events.data);
}


// Register Name
function sendName() {
	// TODO: Really should do this with <form>
	const name = document.getElementById('my-name-input').value;

	gameState.game.myName = name;
	gameState.peerjs.conn.send(name);
	if(gameState.game.oppName) {
		nextData(receiveMove);
		startMove();
	} else {
		gameState.game.state = 'waiting-name';
	}
	updateDisplay();
}

function receiveOppName(name) {
	gameState.game.oppName = name;
	if(gameState.game.myName) {
		nextData(receiveMove);
		startMove();
	}
	updateDisplay();
}

// Duel
function startMove() {
	if(gameState.game.state == 'game-over') return;
	gameState.game.state = 'make-move';
	updateDisplay();
}

function sendMove(move) {
	gameState.game.myMove = move;
	gameState.peerjs.conn.send(move);
	if(gameState.game.oppMove != null) {
		computeMove();
	} else {
		gameState.game.state = 'waiting-move';
	}
	updateDisplay();
}

function receiveMove(move) {
	gameState.game.oppMove = move;
	if(move == "I lost") {
		duelOver();
		return;
	}
	if(gameState.game.myMove != null) {
		computeMove();
	}
	updateDisplay();
}

function computeMove() {
	const myMove = gameState.game.myMove;
	const oppMove = gameState.game.oppMove;

	const dmgReceived = outcomeDamage(myMove, oppMove);

	gameState.game.myHp -= dmgReceived;
	gameState.game.myEnergy -= myMove;
	gameState.game.myEnergy += Math.floor(gameState.game.myHp/2);

	// Limit the maximum energy to 10
	gameState.game.myEnergy = Math.min(gameState.game.myEnergy, 10);

	if(gameState.game.myHp <= 0) {
		if(gameState.game.myHp < 0) gameState.game.myHp = 0;
		gameState.peerjs.conn.send("I lost");
		duelOver();
		return;
	}

	gameState.game.myMove = null;
	gameState.game.oppMove = null;

	updateDisplay();

	gameState.game.state = 'move-animation';
	gameState.game.animationStartTimestamp = new Date().getTime();

	document.getElementById('outcome-label').innerText = outcomeLabel(myMove, oppMove);
	requestAnimationFrame(animateMove);
}

function animateMove() {
	// do stuff here idk
	if(new Date().getTime() - gameState.game.animationStartTimestamp > 2000) {
		startMove();
	} else {
		requestAnimationFrame(animateMove);
	}
}

function duelOver() {
	gameState.game.state = 'game-over';
	updateDisplay();
}

/*********************************************
* Menu Selection / Pre-Connect Functions
*********************************************/
function menuSelectHost() {
	gameState.menu.state = "menu-host";
	updateDisplay();
}

function menuSelectConnect() {
	gameState.menu.state = "menu-connect";
	updateDisplay();
}

function menuConnectingBack() {
	gameState.menu.state = 'menu-select';
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
	gameState.peerjs.peer = new Peer(selfId);
	
	gameState.peerjs.peer.on('error', console.error);
	console.log("My peer id is ", gameState.peerjs.peer.id);

	gameState.peerjs.peer.on('connection', (conn) => {
		gameState.peerjs.conn = conn;
		startGame();
	});

	gameState.menu.state = 'menu-host-waiting';
	updateDisplay();
}

function menuConnectingConnect() {
	const oppId = document.getElementById('connection-phrase-connect').value;
	gameState.peerjs.conn = gameState.peerjs.peer.connect(oppId, peerJsConnectionSettings);
	gameState.peerjs.peer.on('error', console.error);
	console.log("My peer id is ", gameState.peerjs.peer.id);
	console.log(gameState.peerjs.conn);


	gameState.peerjs.conn.on('open', () => {
		console.log("Connected to peer ", gameState.peerjs.conn.peer);

		gameState.peerjs.lastMessageTimestamp = new Date().getTime();
		gameState.screen = 'game';
		startGame();
		updateDisplay();
	});
}

// Start the game; Set up first listeners
function startGame() {
	console.log("Connected to peer ", gameState.peerjs.conn.peer);
	gameState.peerjs.lastMessageTimestamp = new Date().getTime();
	gameState.screen = 'game';
	nextData(receiveOppName, true);
	updateDisplay();
}

